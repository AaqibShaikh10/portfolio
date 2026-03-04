import { useState } from 'react';
import type { FormEvent } from 'react';

export default function Contact() {
    const [formState, setFormState] = useState<{
        status: 'idle' | 'sending' | 'success' | 'error';
        message: string;
    }>({ status: 'idle', message: '' });

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setFormState({ status: 'sending', message: '' });

        try {
            const res = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'Failed to send message');
            }

            setFormState({
                status: 'success',
                message: 'Message sent successfully. I will get back to you soon.',
            });
            setName('');
            setEmail('');
            setMessage('');
        } catch (err) {
            setFormState({
                status: 'error',
                message:
                    err instanceof Error
                        ? err.message
                        : 'Something went wrong. Please try again.',
            });
        }
    }

    return (
        <section id="contact" className="section">
            <div className="container">
                <span className="section-label">Contact</span>
                <h2 className="section-title">Get in touch</h2>
                <p className="section-subtitle">
                    Have a project in mind, want to collaborate, or just want to say
                    hello? Reach out through the form or connect directly.
                </p>
                <div className="contact-grid">
                    <div className="contact-info">
                        <p>
                            I'm open to collaboration on AI/ML projects, full-stack
                            development, and applied research. If you have a specific problem
                            to solve or want to discuss any of the projects above, I'd like to
                            hear about it.
                        </p>
                        <div className="contact-details">
                            <div className="contact-detail">
                                <span className="contact-detail-label">Email</span>
                                <span className="contact-detail-value">
                                    <a href="mailto:aaqibshaikh300@gmail.com">
                                        aaqibshaikh300@gmail.com
                                    </a>
                                </span>
                            </div>
                            <div className="contact-detail">
                                <span className="contact-detail-label">GitHub</span>
                                <span className="contact-detail-value">
                                    <a
                                        href="https://github.com/AaqibShaikh10"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        github.com/AaqibShaikh10
                                    </a>
                                </span>
                            </div>
                            <div className="contact-detail">
                                <span className="contact-detail-label">LinkedIn</span>
                                <span className="contact-detail-value">
                                    <a
                                        href="https://www.linkedin.com/in/aaqib-shaikh-432b26306/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        linkedin.com/in/aaqib-shaikh-432b26306
                                    </a>
                                </span>
                            </div>
                            <div className="contact-detail">
                                <span className="contact-detail-label">Phone</span>
                                <span className="contact-detail-value">
                                    <a href="tel:+923113321523">
                                        +92 311 332 1523
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <h3 className="contact-form-title">Send a message</h3>
                        <div className="form-group">
                            <label htmlFor="contact-name">Name</label>
                            <input
                                id="contact-name"
                                type="text"
                                placeholder="Your name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact-email">Email</label>
                            <input
                                id="contact-email"
                                type="email"
                                placeholder="your@email.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact-message">Message</label>
                            <textarea
                                id="contact-message"
                                placeholder="Tell me about your project or idea..."
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary form-submit"
                            disabled={formState.status === 'sending'}
                        >
                            {formState.status === 'sending' ? 'Sending...' : 'Send message'}
                        </button>
                        {formState.message && (
                            <div
                                className={`form-status ${formState.status === 'success' ? 'success' : 'error'
                                    }`}
                            >
                                {formState.message}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}
