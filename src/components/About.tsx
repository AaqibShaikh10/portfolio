import type { GitHubProfile } from '../data/types';

interface AboutProps {
    profile: GitHubProfile;
}

export default function About({ profile }: AboutProps) {
    const details = [
        { label: 'Location', value: profile.location || 'Not specified' },
        {
            label: 'Focus areas',
            value: 'Deepfake detection, healthcare AI, NLP, full-stack development',
        },
        {
            label: 'Building',
            value:
                'DeepSafe (video/audio deepfake detection), clinical prediction systems, RAG chatbots',
        },
        {
            label: 'Exploring',
            value:
                'Large language models, retrieval-augmented generation, real-time computer vision',
        },
    ];

    return (
        <section id="about" className="section section-alt">
            <div className="container">
                <span className="section-label">About</span>
                <h2 className="section-title">Background</h2>
                <p className="section-subtitle">
                    What I work on, what I've shipped, and where I'm headed.
                </p>
                <div className="about-content">
                    <div className="about-text">
                        <p>
                            I work at the intersection of machine learning and product
                            engineering. My projects address specific problems: detecting
                            AI-manipulated video and audio, predicting heart disease from
                            clinical features, managing urban traffic with computer vision, and
                            building document Q&A systems with retrieval-augmented generation.
                        </p>
                        <p>
                            The stack is typically Python (TensorFlow, PyTorch, scikit-learn,
                            FastAPI) on the backend and TypeScript with React on the frontend.
                            I've deployed production systems using Django, Flask, and Node.js.{' '}
                            {profile.public_repos} public repositories on GitHub, with work
                            spanning AI/ML research prototypes to full-stack web applications.
                        </p>
                    </div>
                    <div className="about-details">
                        <table>
                            <tbody>
                                {details.map((row) => (
                                    <tr key={row.label}>
                                        <th>{row.label}</th>
                                        <td>{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}
