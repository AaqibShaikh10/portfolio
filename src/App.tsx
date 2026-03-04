import './index.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
import SkillsTable from './components/SkillsTable';
import Contact from './components/Contact';
import Footer from './components/Footer';
import siteData from './data/github.json';
import type { SiteData } from './data/types';

const data = siteData as SiteData;

export default function App() {
    return (
        <>
            <Header />
            <main>
                <Hero profile={data.profile} />
                <About profile={data.profile} />
                <Work projects={data.featuredProjects} />
                <SkillsTable skills={data.skills} />
                <Contact />
            </main>
            <Footer />
        </>
    );
}
