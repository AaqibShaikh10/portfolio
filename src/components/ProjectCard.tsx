import type { FeaturedProject } from '../data/types';
import { formatDate } from '../utils/date';

interface ProjectCardProps {
    project: FeaturedProject;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <article className="project-card">
            <div className="project-card-body">
                {project.language && (
                    <span className="project-card-language">{project.language}</span>
                )}
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-summary">{project.summary}</p>
                <ul className="project-card-bullets">
                    {project.bullets.map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                    ))}
                </ul>
                <p className="project-card-tech">{project.tech.join(' / ')}</p>
            </div>
            <div className="project-card-footer">
                <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                >
                    View on GitHub
                </a>
                <span
                    className="btn btn-sm"
                    style={{
                        cursor: 'default',
                        borderColor: 'transparent',
                        backgroundColor: 'transparent',
                        color: 'var(--color-text-tertiary)',
                        fontSize: 'var(--text-xs)',
                    }}
                >
                    Updated {formatDate(project.updatedAt)}
                    {project.stars > 0 ? ` / ${project.stars} stars` : ''}
                </span>
            </div>
        </article>
    );
}
