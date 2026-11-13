import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Highlight } from '../components/common/Highlight';
import {
  Compass,
  Search,
  ArrowRight,
  Code2,
  Cpu,
  Palette,
  Rocket,
  CheckCircle2,
  Layers,
  Clock,
  LayoutDashboard,
  Filter,
} from 'lucide-react';
import { useCareer } from '../context/CareerContext';
import { SAMPLE_HANDOFFS } from '../utils/sampleHandoffs';

interface CareerPathCardData {
  id: string;
  title: string;
  category: 'Engineering' | 'Artificial Intelligence' | 'Design & UX' | 'Entrepreneurship';
  icon: any;
  tagline: string;
  description: string;
  coreSkills: string[];
  capstoneProject: string;
  timeHorizon: string;
  demandLevel: string;
}

const CAREER_PATHS: CareerPathCardData[] = [
  {
    id: 'software-engineer',
    title: 'Full-Stack Software Engineer',
    category: 'Engineering',
    icon: Code2,
    tagline: 'Architect resilient web applications, end-to-end TypeScript systems & scalable APIs.',
    description: 'Bridges frontend visual experiences with robust backend microservices, transactional databases, and production DevOps.',
    coreSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'System Design', 'Docker'],
    capstoneProject: 'Production SaaS platform with multi-tenant auth, background queue processing & PostgreSQL caching.',
    timeHorizon: '6–9 months to professional readiness',
    demandLevel: 'High • Enduring foundational need',
  },
  {
    id: 'ai-engineer',
    title: 'Applied AI & ML Systems Engineer',
    category: 'Artificial Intelligence',
    icon: Cpu,
    tagline: 'Build production agent workflows, fine-tuned LLM pipelines & vector retrieval systems.',
    description: 'Turns foundation models into reliable software products using prompt evaluation, RAG architectures, and latency-optimized inference.',
    coreSkills: ['Python', 'LangChain/LlamaIndex', 'Vector DBs (pgvector)', 'FastAPI', 'Eval Frameworks', 'PyTorch'],
    capstoneProject: 'Self-correcting research agent with hybrid BM25 + dense retrieval and hallucination mitigation guardrails.',
    timeHorizon: '6–12 months of focused applied practice',
    demandLevel: 'Surging • Premium capability',
  },
  {
    id: 'product-designer',
    title: 'Product & UX/UI Designer',
    category: 'Design & UX',
    icon: Palette,
    tagline: 'Translate complex product workflows into intuitive, beautiful & accessible human experiences.',
    description: 'Conducts generative user research, architects design systems in Figma, and bridges the gap between customer problems and high-converting interfaces.',
    coreSkills: ['Figma Design Systems', 'User Research', 'Interactive Prototyping', 'Usability Audits', 'Design Tokens'],
    capstoneProject: 'Complete 0-to-1 redesign of an enterprise analytics workflow with 12 documented user test iterations.',
    timeHorizon: '4–8 months to cohesive portfolio',
    demandLevel: 'Strong • Vital for product differentiation',
  },
  {
    id: 'tech-founder',
    title: 'Tech Founder / Indie Hacker',
    category: 'Entrepreneurship',
    icon: Rocket,
    tagline: 'Validate customer pain points, rapidly ship MVPs, and scale profitable software businesses.',
    description: 'Combines full-stack prototyping speed with customer discovery, growth loops, and lean business unit economics.',
    coreSkills: ['Rapid Prototyping', 'Customer Discovery', 'Distribution & SEO', 'Stripe Billing', 'Lean Analytics'],
    capstoneProject: 'Live, monetized micro-SaaS with paying subscribers and automated onboarding sequence.',
    timeHorizon: '3–6 months to first dollar revenue',
    demandLevel: 'Self-driven • High independence & upside',
  },
];

const CATEGORIES = ['All', 'Engineering', 'Artificial Intelligence', 'Design & UX', 'Entrepreneurship'] as const;

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile, loadSampleProfession } = useCareer();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPaths = useMemo(() => {
    return CAREER_PATHS.filter((path) => {
      const matchesCategory = selectedCategory === 'All' || path.category === selectedCategory;
      const matchesSearch =
        path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        path.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        path.coreSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleStartDiscovery = (path: CareerPathCardData) => {
    updateProfile({
      currentField: path.title,
      careerStage: 'pivoting',
    });
    navigate('/onboarding');
  };

  const handlePreviewRoadmap = (path: CareerPathCardData) => {
    loadSampleProfession(path.id);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF5EB] text-[#171717]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Header Section */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 border-[#171717] bg-white shadow-[2px_2px_0px_#171717] mb-4">
            <Compass className="w-4 h-4 text-[#171717]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#171717]">
              Explore Career Horizons
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#171717] tracking-tight leading-tight">
            Explore realistic career paths.{' '}
            <Highlight color="#FFE76B">No vague advice.</Highlight>
          </h1>

          <p className="text-base sm:text-lg text-[#333333] font-medium mt-3 leading-relaxed">
            Browse structured career trajectories supported by FOYC's personalized roadmap engine. Inspect required skills, capstone projects, and preview real action plans.
          </p>
        </div>

        {/* Controls: Search & Category Filter */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                  selectedCategory === cat
                    ? 'bg-[#171717] text-white border-[#171717] shadow-[2px_2px_0px_#526B50]'
                    : 'bg-white text-[#333333] border-[#E8E5DE] hover:border-[#171717]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles, skills (e.g. React)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border-2 border-[#171717] text-xs font-semibold text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#FFE76B] shadow-[2px_2px_0px_#171717]"
            />
            <Search className="w-4 h-4 text-[#777777] absolute left-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Results Grid */}
        {filteredPaths.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredPaths.map((path) => {
              const IconComp = path.icon;
              return (
                <Card
                  key={path.id}
                  variant="white"
                  shadowSize="md"
                  className="p-6 sm:p-8 flex flex-col justify-between border-2 border-[#171717] bg-white transition-transform hover:-translate-y-1"
                >
                  <div className="space-y-5">
                    {/* Top Row: Icon & Category */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFE76B] border-2 border-[#171717] flex items-center justify-center shadow-[2px_2px_0px_#171717]">
                        <IconComp className="w-6 h-6 text-[#171717]" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#EDF2E9] text-[#526B50] border border-[#A8B99A]">
                        {path.category}
                      </span>
                    </div>

                    {/* Role Title & Tagline */}
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                        {path.title}
                      </h2>
                      <p className="text-xs font-bold text-[#526B50] mt-1">
                        {path.tagline}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#444444] font-medium leading-relaxed">
                      {path.description}
                    </p>

                    {/* Core Skills Tags */}
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#777777] block mb-2">
                        Core Capabilities to Build
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {path.coreSkills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[11px] font-semibold bg-[#F4F3EF] text-[#171717] px-2.5 py-1 rounded-lg border border-[#E8E5DE]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Capstone Proof */}
                    <div className="p-3.5 rounded-xl bg-[#FDF5EB] border border-[#E8E5DE] space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#526B50] block">
                        Example Capstone Proof of Work
                      </span>
                      <p className="text-xs font-semibold text-[#171717] leading-snug">
                        {path.capstoneProject}
                      </p>
                    </div>

                    {/* Horizon & Demand */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E8E5DE] text-[11px]">
                      <div>
                        <span className="text-[#777777] block font-medium">Readiness Timeline</span>
                        <span className="font-bold text-[#171717]">{path.timeHorizon}</span>
                      </div>
                      <div>
                        <span className="text-[#777777] block font-medium">Market Landscape</span>
                        <span className="font-bold text-[#526B50]">{path.demandLevel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 mt-6 border-t border-[#E8E5DE] flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={() => handleStartDiscovery(path)}
                      className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#FFE76B] hover:bg-[#FADB3D] text-[#171717] font-black text-xs border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center justify-center gap-2 transition-transform active:translate-y-0.5"
                    >
                      <span>Start Discovery</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>

                    <button
                      onClick={() => handlePreviewRoadmap(path)}
                      className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white hover:bg-[#F4F3EF] text-[#171717] font-bold text-xs border border-[#171717] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Preview Roadmap</span>
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border-2 border-[#171717] shadow-[4px_4px_0px_#171717] max-w-lg mx-auto space-y-4 my-8">
            <div className="w-14 h-14 rounded-2xl bg-[#FFE76B] border-2 border-[#171717] flex items-center justify-center mx-auto shadow-[2px_2px_0px_#171717]">
              <Filter className="w-7 h-7 text-[#171717]" />
            </div>
            <h3 className="text-xl font-black text-[#171717]">No Matching Directions Found</h3>
            <p className="text-xs text-[#555555] font-medium leading-relaxed">
              We couldn't find any career paths matching "{searchQuery}" in category "{selectedCategory}". Try clearing your search or browsing all directions.
            </p>
            <Button
              variant="dark"
              size="sm"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-2"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Discovery Callout */}
        <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-white border-2 border-[#171717] shadow-[4px_4px_0px_#171717] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#526B50]">
              Don't see your specific field?
            </span>
            <h3 className="text-2xl font-black text-[#171717] tracking-tight">
              FOYC works for any industry, degree or background.
            </h3>
            <p className="text-xs text-[#444444] font-medium leading-relaxed">
              Take the free 8-question discovery questionnaire to generate a custom prompt for ChatGPT tailored specifically to your unique goals.
            </p>
          </div>
          <Link to="/onboarding" className="w-full md:w-auto">
            <Button variant="primary" size="lg" className="w-full md:w-auto font-black text-sm bg-[#FFE76B] border-2 border-[#171717] shadow-[3px_3px_0px_#171717]">
              <span>Take Discovery Questionnaire</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};
