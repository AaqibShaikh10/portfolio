import type { FeaturedProject } from '../data/types';
import ProjectCard from './ProjectCard';

interface WorkProps {
    projects: FeaturedProject[];
}

export default function Work({ projects }: WorkProps) {
    return (
        <section id="work" className="section">
            <div className="container">
                <span className="section-label">Selected Work</span>
                <h2 className="section-title">Projects</h2>
                <p className="section-subtitle">
                    A selection of projects spanning AI/ML, full-stack development, and
                    real-time systems. Each built to solve a specific problem.
                </p>
                <div className="projects-grid">
                    {projects.map((project) => (
                        <ProjectCard key={project.name} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
}
