import { Routes, Route } from 'react-router-dom';
import './index.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
import SkillsTable from './components/SkillsTable';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';
import siteData from './data/github.json';
import type { SiteData } from './data/types';

const data = siteData as SiteData;

function HomePage() {
    return (
        <>
            <main>
                <Hero profile={data.profile} />
                <About profile={data.profile} />
                <Work projects={data.featuredProjects} />
                <SkillsTable skills={data.skills} />
                <Contact />
            </main>
        </>
    );
}

export default function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
        </>
    );
}

