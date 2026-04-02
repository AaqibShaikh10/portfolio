/**
 * Blog post data for Aaqib Shaikh's portfolio.
 *
 * Content is stored as HTML strings and rendered with dangerouslySetInnerHTML.
 * Rationale: The posts contain embedded code snippets with syntax highlighting
 * classes and structured sections. Inline HTML gives precise control over
 * markup without adding a markdown parsing dependency at runtime. The content
 * is authored here and never user-supplied, so XSS risk is zero.
 */

export interface BlogPost {
    id: number;
    slug: string;
    title: string;
    date: string; // ISO 8601
    readTime: string;
    excerpt: string;
    content: string; // HTML string — rendered via dangerouslySetInnerHTML
    tags: string[];
    coverImage?: string;
}

export const blogPosts: BlogPost[] = [
    {
        id: 1,
        slug: 'how-aaqib-shaikh-built-a-real-time-ai-pipeline-for-healthcare-data',
        title: 'How Aaqib Shaikh Built a Real-Time AI Pipeline for Healthcare Data',
        date: '2025-03-10',
        readTime: '9 min read',
        excerpt:
            'A deep dive into the architecture behind a clinical prediction system — covering streaming ingestion, feature engineering under latency constraints, and why most ML pipelines fail at the inference layer.',
        tags: ['AI', 'Healthcare', 'Python', 'Real-Time Systems', 'MLOps'],
        content: `
<p>When I started working on the heart disease prediction project, the first assumption I had to throw out was that the hard part was the model. It wasn't. The hard part was getting clean, low-latency data to the model reliably — while also making sure the system could survive partial failures without silently producing wrong predictions.</p>

<p>This post walks through the architecture I ended up with, the dead-ends I hit, and the specific tradeoffs I made at each layer.</p>

<h2>Why Real-Time Inference Is Harder in Healthcare</h2>

<p>In most ML applications, a slow prediction is an annoyance. A recommendation engine that takes 800ms instead of 120ms still serves its purpose. In clinical contexts, latency and correctness matter in a different way — a prediction pipeline that silently degrades or produces stale results based on incomplete data is dangerous. I wasn't building a hospital system, but the discipline of thinking about failure modes that way made everything more robust.</p>

<p>The pipeline had to handle three classes of input: structured vitals (heart rate, blood pressure, cholesterol), patient history flags, and derived features computed from combinations of those (like age-adjusted risk scores). The structured vitals are the tricky ones — they change over time and have to be considered in the right temporal window.</p>

<h2>Ingestion Layer: Don't Flatten Too Early</h2>

<p>The first mistake I made was flattening all inputs into a single feature vector at ingestion time. This makes the preprocessing code simple but creates a maintenance nightmare: any change to derived features requires re-processing the entire historical dataset.</p>

<p>The better approach — which took me a couple of refactors to reach — is to store raw inputs separately from derived features and compute the derived ones just-in-time, or to cache them with explicit invalidation logic.</p>

<pre><code class="language-python"># Bad: baking derived features into ingestion
def ingest(record):
    return {
        "age": record["age"],
        "cholesterol_ratio": record["ldl"] / record["hdl"],  # fragile
        "normalized_bp": (record["systolic"] - 120) / 20,   # tied to this normalization
    }

# Better: keep raw, compute derived lazily
def ingest(record):
    return {
        "age": record["age"],
        "ldl": record["ldl"],
        "hdl": record["hdl"],
        "systolic": record["systolic"],
        "diastolic": record["diastolic"],
    }

def compute_features(raw):
    return {
        **raw,
        "cholesterol_ratio": raw["ldl"] / raw["hdl"] if raw["hdl"] > 0 else 0.0,
        "pulse_pressure": raw["systolic"] - raw["diastolic"],
    }
</code></pre>

<p>This separation also enables you to unit-test <code>compute_features</code> in complete isolation, which matters a lot when you're trying to track down why a model starts performing differently after a data change.</p>

<h2>Feature Engineering Under Latency Constraints</h2>

<p>For the clinical model, I was computing a mix of point-in-time features and rolling window features. The rolling window features (e.g., "average resting heart rate over the past 7 days") are the expensive ones.</p>

<p>Two strategies helped here. First, precompute and cache rolling aggregates on insert rather than at query time. Second, degrade gracefully when the cache is cold — if a patient has fewer than 3 readings in the window, fall back to a point-in-time reading and flag the prediction confidence accordingly.</p>

<pre><code class="language-python">def get_rolling_hr(patient_id: str, window_days: int = 7) -> tuple[float, bool]:
    """
    Returns (value, is_reliable).
    is_reliable is False when we have fewer than 3 readings.
    """
    readings = cache.get(f"hr:{patient_id}:{window_days}d")
    if readings is None:
        readings = db.query_readings(patient_id, window_days)
        cache.set(f"hr:{patient_id}:{window_days}d", readings, ttl=3600)

    if len(readings) < 3:
        # Degrade to latest reading
        latest = readings[-1]["value"] if readings else 70.0  # clinical default
        return latest, False

    return sum(r["value"] for r in readings) / len(readings), True
</code></pre>

<p>The <code>is_reliable</code> flag propagates through the pipeline and gets attached to the prediction output. A downstream consumer (or a human reviewing predictions) then knows whether to weight this result differently.</p>

<h2>Model Serving: Where Most Pipelines Break</h2>

<p>The model itself (a gradient boosted ensemble trained with XGBoost) was fairly straightforward. The serving layer was not. Three failure modes I specifically designed around:</p>

<p><strong>1. Feature skew.</strong> The features the model was trained on have to match exactly what production serves it. I solved this by exporting the feature schema at training time to a JSON manifest, then validating every inference request against that manifest before it hits the model.</p>

<p><strong>2. Silent model version mismatches.</strong> If you load a model from a path without version-locking, a redeployment can silently swap in a new model with a different feature order. I pinned model artifacts to content-addressed hashes and recorded the hash in every prediction response.</p>

<p><strong>3. Downstream confidence collapse.</strong> When many features degrade simultaneously (e.g., a data source is slow), the model produces predictions but they're based on mostly-imputed values. I added a composite reliability score — if more than 40% of features were imputed, the system returns <code>"confidence": "low"</code> rather than a numeric probability.</p>

<h2>Results and What I'd Do Differently</h2>

<p>The pipeline achieved sub-50ms median inference latency on the local test setup, with the majority of time spent in the feature cache lookup rather than model inference (as expected). The model achieved 85%+ accuracy on the validation set — respectable for a structured clinical dataset without deep domain feature engineering.</p>

<p>If I were building this from scratch today, I'd invest earlier in a proper feature store (something like Feast or even a simple Redis-backed implementation) rather than rolling bespoke caching logic. The ad-hoc cache works, but a feature store gives you point-in-time correctness for free, which is critical in healthcare ML where training/serving skew can completely invalidate your offline metrics.</p>

<p>The full source for the prediction model and feature pipeline is on <a href="https://github.com/AaqibShaikh10/Heart-Disease-Prediction-And-Analysis" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
`,
    },
    {
        id: 2,
        slug: 'lessons-from-shipping-production-ai-systems-in-2024',
        title: 'Lessons from Shipping Production AI Systems in 2024',
        date: '2025-02-18',
        readTime: '8 min read',
        excerpt:
            'Five hard-won lessons from taking AI systems from prototype to production — including why eval harnesses matter more than model selection, and how to think about hallucination in high-stakes contexts.',
        tags: ['AI', 'MLOps', 'Production Systems', 'Software Engineering'],
        content: `
<p>Most AI tutorials stop at the demo. The demo works perfectly: clean data, a cooperative model, a happy path that produces impressive output. Production is different. Production has malformed inputs, users who do unexpected things, infrastructure that occasionally hiccups, and — most importantly — no one watching the system at 3am when it starts behaving oddly.</p>

<p>After spending the past year building and maintaining AI systems across different domains, here are the five lessons I've found most actionable.</p>

<h2>1. Your Eval Harness Is More Important Than Your Model</h2>

<p>This one surprises people. When you're starting out, model selection feels like the critical decision: GPT-4 vs Claude vs Llama, XGBoost vs random forest vs neural net. In reality, without a rigorous evaluation harness, you can't make principled decisions about any of this.</p>

<p>An eval harness is a battery of tests that you run against every model version or prompt change. For a generative AI system, it might look like:</p>

<ul>
<li>A curated set of 200–500 representative inputs with expected outputs (or expected output properties)</li>
<li>Automated scoring: exact match where applicable, LLM-as-judge where outputs are open-ended</li>
<li>Regression tracking: did this change make any previously-passing cases fail?</li>
<li>Coverage analysis: are your test cases actually representative of real traffic?</li>
</ul>

<p>Without this, every model change is a leap of faith. With it, you can iterate quickly and confidently. I've switched model providers in under a day by running the eval harness and seeing that accuracy held within acceptable bounds.</p>

<h2>2. Hallucination Is a Distribution Problem, Not a Model Problem</h2>

<p>When a language model produces confident but incorrect output, the instinct is to blame the model. Sometimes that's right. But more often, the root cause is that you're sending inputs the model's training distribution didn't cover well.</p>

<p>For a retrieval-augmented generation system, for example, the model might handle questions about your product documentation perfectly — and then confidently hallucinate when asked about a niche edge case that wasn't in the retrieved context. The solution isn't a better model; it's better retrieval and — critically — explicit uncertainty signaling.</p>

<pre><code class="language-python">def generate_response(query: str, context_chunks: list[str]) -> dict:
    if not context_chunks:
        return {
            "response": "I don't have enough information to answer that.",
            "confidence": "none",
            "sources": []
        }

    # Check relevance scores — if all chunks are low similarity, be upfront
    max_relevance = retrieve_max_relevance(query, context_chunks)
    if max_relevance < 0.6:
        return {
            "response": generate(query, context_chunks),
            "confidence": "low",
            "sources": context_chunks
        }

    return {
        "response": generate(query, context_chunks),
        "confidence": "high",
        "sources": context_chunks
    }
</code></pre>

<p>Showing <code>confidence: low</code> to users isn't a failure mode — it's a feature. It sets correct expectations and builds trust over time.</p>

<h2>3. Observability Is Not Optional</h2>

<p>I've seen teams skip observability because "we'll add it later." Later never comes. By the time you need to debug a production issue, the relevant data is gone.</p>

<p>For AI systems, observability means at minimum:</p>

<ul>
<li><strong>Input/output logging</strong>: sample at least 1–5% of all requests, retaining full prompts, contexts, and outputs</li>
<li><strong>Latency histograms</strong>: p50, p95, p99 — not just averages</li>
<li><strong>Token usage</strong>: for cost attribution and anomaly detection</li>
<li><strong>Error classification</strong>: distinguish model errors, infra errors, and input validation failures separately</li>
</ul>

<p>For the DeepSafe deepfake detection project, I added a lightweight event log that records the confidence score, processing time, and a hash of the input media for every analysis request. Reviewing this log weekly revealed that a certain category of input (heavily compressed JPEG video) was consistently getting low-confidence scores not because of deepfake activity but because of compression artifacts confusing the model. That insight led to a preprocessing step that improved accuracy materially.</p>

<h2>4. Prompt Engineering Is Software Engineering</h2>

<p>Prompts should be versioned, reviewed, and tested like code. I've worked with teams that had prompts scattered across environment variables, hardcoded strings in functions, and Notion docs — with no clear mapping between which prompt was live and what the current model behavior was.</p>

<p>A simple discipline that helps: treat prompts as typed constants in your codebase, commit them under version control, and reference them by name in your eval harness. When a prompt changes, the change is visible in the diff, the eval re-runs, and you know exactly what changed and what effect it had.</p>

<pre><code class="language-typescript">// prompts/classification.ts
export const CLASSIFICATION_SYSTEM = \`
You are a media authenticity analyzer. Your job is to assess whether the
provided evidence suggests AI-generated or manipulated media.

Respond ONLY with a JSON object containing:
- "verdict": "authentic" | "manipulated" | "uncertain"
- "confidence": number between 0 and 1
- "reasoning": string (max 100 words)

Do not include any text outside the JSON object.
\`.trim();

// Version this file in git. Every prompt change is a trackable commit.
</code></pre>

<h2>5. Deploy Small, Monitor Hard, Scale After</h2>

<p>The temptation with AI features is to build the full system before shipping anything. In practice, a feature used by 10 real users teaches you more than 3 weeks of local testing. Ship something minimal that works correctly for the happy path, instrument it thoroughly, and let real usage tell you where to invest next.</p>

<p>For the WebAirDrop project, the initial peer-to-peer file transfer worked for same-network scenarios. Only after watching real usage patterns did I realize that users frequently tried to transfer across different networks — a much harder problem that required STUN/TURN relay infrastructure. If I'd built relay server support speculatively before shipping, I'd have over-engineered the wrong thing.</p>

<p>The lesson is general: real feedback compresses iteration time more than any amount of upfront planning. Ship, observe, adjust.</p>

<h2>The Underlying Theme</h2>

<p>All five of these lessons point at the same underlying principle: production AI systems fail at the seams between components, not at the model. The model is usually fine. The pipeline that feeds it, the infrastructure that serves it, the monitoring that watches it, and the product decisions about what to do when it's uncertain — that's where the real complexity lives.</p>

<p>Build those layers as carefully as you build the model, and production will be much less surprising.</p>
`,
    },
    {
        id: 3,
        slug: 'why-cloudflare-workers-is-the-perfect-backend-for-a-portfolio-site',
        title: 'Why Cloudflare Workers Is the Perfect Backend for a Portfolio Site',
        date: '2025-01-25',
        readTime: '7 min read',
        excerpt:
            'How I used Cloudflare Workers and Pages to ship a zero-cold-start, globally distributed portfolio with a contact form API — for exactly $0/month — and what the architecture looks like.',
        tags: ['Cloudflare', 'TypeScript', 'Web Performance', 'Infrastructure'],
        content: `
<p>Every developer portfolio needs roughly the same backend functionality: a contact form endpoint, static asset serving, and maybe a handful of API calls to enrich the data (like pulling live GitHub stats). The surface area is tiny, but the requirements are interesting — it has to be fast globally, always available, easy to deploy, and ideally free.</p>

<p>I considered the usual options. A Node.js server on a VPS gives you full control but adds operational overhead for something this simple. Vercel and Netlify Functions work well, but cold starts on the free tier can add hundreds of milliseconds to first requests. Lambda is excellent but arguably overkill and has the same cold start concern on infrequent traffic.</p>

<p>Cloudflare Workers solves all of these problems, and the architecture for this portfolio is worth documenting.</p>

<h2>How Cloudflare Workers Actually Work</h2>

<p>Workers run at Cloudflare's edge — in over 300 data centers worldwide. Every request is handled by a Worker instance that's already warm (Cloudflare uses a V8 isolate model rather than containers, which eliminates cold starts at the cost of some Node.js API compatibility). The execution environment is a subset of the Web Platform APIs: <code>fetch</code>, <code>Request</code>, <code>Response</code>, <code>crypto</code>, and so on — familiar to frontend developers.</p>

<p>The tradeoff is that you can't use Node.js-specific APIs directly. No <code>fs</code>, no <code>path</code>, no <code>Buffer</code> (well, technically you can polyfill some of these, but it's not the right mental model). You're writing for a browser-like environment that happens to run on a server. Once you internalize that, the worker APIs feel natural.</p>

<h2>The Portfolio Architecture</h2>

<p>The portfolio is a React + TypeScript + Vite SPA deployed on Cloudflare Pages. Pages handles the static asset CDN, automatic deploys from git, and routes all unknown paths to <code>index.html</code> (via <code>_redirects</code>) for client-side routing.</p>

<p>The backend is a single Cloudflare Pages Function — which is just a Worker — living at <code>functions/api/send.ts</code>. It handles POST requests to <code>/api/send</code> for the contact form:</p>

<pre><code class="language-typescript">// functions/api/send.ts
import { Resend } from 'resend';

interface Env {
    RESEND_API_KEY: string;
}

export const onRequestPost: PagesFunction&lt;Env&gt; = async (context) => {
    const resend = new Resend(context.env.RESEND_API_KEY);

    const { name, email, message } = await context.request.json() as {
        name?: string; email?: string; message?: string;
    };

    if (!name || !email || !message) {
        return new Response(
            JSON.stringify({ error: 'All fields are required.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    await resend.emails.send({
        from: 'Portfolio Contact &lt;onboarding@resend.dev&gt;',
        to: 'aaqibshaikh300@gmail.com',
        subject: \`Portfolio Contact: \${name}\`,
        replyTo: email,
        text: \`Name: \${name}\\nEmail: \${email}\\n\\nMessage:\\n\${message}\`,
    });

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};
</code></pre>

<p>The <code>RESEND_API_KEY</code> is stored as a Cloudflare Pages environment variable — never in source. The function receives it via <code>context.env</code> with a typed interface, which is a pleasantly ergonomic pattern.</p>

<h2>Performance Characteristics</h2>

<p>For a portfolio site, performance is primarily about first contentful paint and time-to-interactive. With static assets served from Cloudflare's CDN, the SPA loads from an edge node that's typically under 20ms away from any visitor's city. The contact form Worker responds in under 100ms globally (Cloudflare's processing adds roughly 2–5ms on top of the Resend API latency).</p>

<p>The static data (GitHub profile, project list) is fetched at build time and baked into the bundle as a JSON file — no runtime API calls mean no latency from that source. This makes the stats page fast and resilient even if GitHub's API is slow or rate-limited.</p>

<h2>Deployment and CI/CD</h2>

<p>Cloudflare Pages integrates directly with GitHub. Every push to <code>main</code> triggers a build — <code>npm run build</code> runs Vite, sitemap generation, and TypeScript compilation — and the output <code>dist/</code> folder is deployed across the CDN within 60–90 seconds. Preview deployments (for PRs) are also automatic and get a unique URL.</p>

<p>The build command I use:</p>

<pre><code class="language-bash">npm run sitemap && tsc && vite build
</code></pre>

<p>The <code>sitemap</code> step regenerates <code>public/sitemap.xml</code> automatically on every build, ensuring crawlers always see fresh URLs as new blog posts are added.</p>

<h2>Limitations Worth Knowing</h2>

<p>Workers have a CPU time limit (10ms on the free tier, 30ms on paid) per request. For a contact form handler that makes a single outbound fetch, this is never an issue — the CPU time for JSON parsing and constructing a response is well under 1ms. For compute-heavy operations (image processing, complex data transformation), Workers aren't the right tool.</p>

<p>The other gotcha is that Workers can't do arbitrary TCP connections — only HTTP/S via <code>fetch</code>. Direct database connections (Postgres, MySQL) aren't supported without a Cloudflare Hyperdrive proxy. For simple APIs that talk to other HTTP services (like Resend, Stripe, or any REST API), this isn't a constraint at all.</p>

<h2>Would I Recommend It?</h2>

<p>For a portfolio site or any project with modest, well-defined API needs: yes, emphatically. The combination of Pages + Workers gives you a globally distributed system with zero operational overhead, automatic SSL, DDoS protection at the CDN layer, and a genuinely pleasant developer experience — all on the free tier.</p>

<p>The mental model adjustment (Web Platform APIs, not Node.js) takes a day or two to internalize, but after that, it's the fastest path from code to globally deployed that I've found.</p>
`,
    },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
    return blogPosts.find((p) => p.slug === slug);
}

export function getSortedPosts(): BlogPost[] {
    return [...blogPosts].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}
