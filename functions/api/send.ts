import { Resend } from 'resend';

interface Env {
    RESEND_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const resend = new Resend(context.env.RESEND_API_KEY);

    const { name, email, message } = (await context.request.json()) as {
        name?: string;
        email?: string;
        message?: string;
    };

    if (!name || !email || !message) {
        return new Response(JSON.stringify({ error: 'All fields are required.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: 'aaqibshaikh300@gmail.com',
            subject: `Portfolio Contact: ${name}`,
            replyTo: email,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Resend error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to send email. Please try again later.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
