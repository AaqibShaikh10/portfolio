import { useState } from 'react';
import type { FeaturedProject } from '../data/types';
import ProjectCard from './ProjectCard';

interface WorkProps {
    projects: FeaturedProject[];
}

const INITIAL_VISIBLE = 3;

export default function Work({ projects }: WorkProps) {
    const [showAll, setShowAll] = useState(false);

    const visibleProjects = showAll ? projects : projects.slice(0, INITIAL_VISIBLE);
    const hasMore = projects.length > INITIAL_VISIBLE;

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
                    {visibleProjects.map((project) => (
                        <ProjectCard key={project.name} project={project} />
                    ))}
                </div>

                {hasMore && (
                    <div className="projects-toggle-wrap">
                        <button
                            className="btn projects-toggle-btn"
                            onClick={() => setShowAll((prev) => !prev)}
                            aria-expanded={showAll}
                        >
                            {showAll ? (
                                <>
                                    <span>Show Less</span>
                                    <span className="projects-toggle-icon">↑</span>
                                </>
                            ) : (
                                <>
                                    <span>View All Projects</span>
                                    <span className="projects-toggle-icon">↓</span>
                                    <span className="projects-toggle-count">
                                        +{projects.length - INITIAL_VISIBLE} more
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
