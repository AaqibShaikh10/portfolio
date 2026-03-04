import type { SkillCategory } from '../data/types';

interface SkillsTableProps {
    skills: SkillCategory[];
}

export default function SkillsTable({ skills }: SkillsTableProps) {
    return (
        <section id="skills" className="section section-alt">
            <div className="container">
                <span className="section-label">Skills</span>
                <h2 className="section-title">Tech Stack</h2>
                <p className="section-subtitle">
                    Technologies and tools I use across machine learning, backend
                    engineering, and frontend development.
                </p>
                <div className="skills-grid">
                    {skills.map((group) => (
                        <div key={group.category} className="skill-group">
                            <h3 className="skill-group-title">{group.category}</h3>
                            <div className="skill-group-items">
                                {group.items.map((item) => (
                                    <span key={item}>{item}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
