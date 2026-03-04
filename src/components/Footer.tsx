export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <p className="footer-brand-name">Aaqib Shaikh</p>
                        <p className="footer-brand-desc">
                            Software engineer building AI systems for healthcare, security,
                            and real-time data processing. Based in Karachi, Pakistan.
                        </p>
                    </div>

                    <div className="footer-col">
                        <h4 className="footer-col-title">Navigation</h4>
                        <div className="footer-col-links">
                            <a href="#about">About</a>
                            <a href="#work">Work</a>
                            <a href="#skills">Skills</a>
                            <a href="#contact">Contact</a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4 className="footer-col-title">Connect</h4>
                        <div className="footer-col-links">
                            <a
                                href="https://github.com/AaqibShaikh10"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                GitHub
                            </a>
                            <a
                                href="https://www.linkedin.com/in/aaqib-shaikh-432b26306/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                LinkedIn
                            </a>
                            <a href="mailto:aaqibshaikh300@gmail.com">Email</a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4 className="footer-col-title">Projects</h4>
                        <div className="footer-col-links">
                            <a
                                href="https://github.com/AaqibShaikh10/DeepSafe"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                DeepSafe
                            </a>
                            <a
                                href="https://github.com/AaqibShaikh10/Heart-Disease-Prediction-And-Analysis"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Heart Disease AI
                            </a>
                            <a
                                href="https://github.com/AaqibShaikh10/WebAirDrop"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                WebAirDrop
                            </a>
                            <a
                                href="https://github.com/AaqibShaikh10/AI-Enabled-Intelligent-Traffic-Management-System"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                AI Traffic System
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <span>
                        {currentYear} Aaqib Shaikh. All rights reserved.
                    </span>
                </div>
            </div>
        </footer>
    );
}
