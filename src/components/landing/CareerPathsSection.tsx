import React from 'react';
import { Highlight } from '../common/Highlight';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Terminal, BrainCircuit, Palette, Rocket, ShieldCheck, Database, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CareerPathsSection: React.FC = () => {
  const paths = [
    {
      title: 'Full-Stack Software Engineer',
      domain: 'Engineering & Code',
      icon: Terminal,
      color: 'blue' as const,
      salary: '$85k - $160k',
      timeframe: '4 - 6 Months',
      demand: 'High',
      tagline: 'Architect end-to-end web apps with modern frameworks and robust database services.',
      keySkills: ['TypeScript', 'React 19', 'PostgreSQL', 'Docker', 'REST/GraphQL'],
    },
    {
      title: 'Applied AI & LLM Systems Engineer',
      domain: 'Artificial Intelligence',
      icon: BrainCircuit,
      color: 'yellow' as const,
      salary: '$110k - $190k',
      timeframe: '3 - 5 Months',
      demand: 'Extremely High',
      tagline: 'Build agentic systems, enterprise RAG, vector pipelines, and fine-tuned models.',
      keySkills: ['Python', 'Vector DBs', 'LangGraph', 'Eval Benchmarks', 'PyTorch'],
    },
    {
      title: 'Senior Product & UX/UI Designer',
      domain: 'Product & Design',
      icon: Palette,
      color: 'pink' as const,
      salary: '$80k - $150k',
      timeframe: '3 - 6 Months',
      demand: 'Steady',
      tagline: 'Transform ambiguous customer pain points into intuitive, accessible digital experiences.',
      keySkills: ['Figma Systems', 'User Research', 'Prototyping', 'Usability Audits'],
    },
    {
      title: 'Tech Founder / Micro-SaaS Builder',
      domain: 'Entrepreneurship',
      icon: Rocket,
      color: 'green' as const,
      salary: 'Equity / Revenue',
      timeframe: '90-Day Sprint',
      demand: 'Autonomous',
      tagline: 'Find profitable niche problems, ship minimum lovable products, and scale organic distribution.',
      keySkills: ['Customer Discovery', 'Stripe Billing', 'Programmatic SEO', 'Rapid MVP'],
    },
    {
      title: 'Cloud Architect & DevOps Engineer',
      domain: 'Infrastructure',
      icon: Database,
      color: 'lavender' as const,
      salary: '$95k - $175k',
      timeframe: '5 - 7 Months',
      demand: 'High',
      tagline: 'Automate CI/CD pipelines, ensure 99.99% uptime, and manage cloud scalability.',
      keySkills: ['AWS/GCP', 'Kubernetes', 'Terraform', 'CI/CD Pipelines', 'Linux'],
    },
    {
      title: 'Cybersecurity & AppSec Specialist',
      domain: 'Security & Trust',
      icon: ShieldCheck,
      color: 'cream' as const,
      salary: '$90k - $165k',
      timeframe: '4 - 6 Months',
      demand: 'Critical',
      tagline: 'Protect modern web applications, identify vulnerabilities, and design secure authentication.',
      keySkills: ['Penetration Testing', 'OWASP Top 10', 'Auth & IAM', 'Network Security'],
    },
  ];

  return (
    <section id="explore" className="py-20 md:py-28 bg-[#FFF8E9] border-t-3 border-[#17172B] scroll-mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <Badge variant="blue" className="mb-4">
              Explore Modern Horizons
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#17172B] tracking-tight leading-[1.15]">
              Real paths for the <Highlight color="#FFE76B">modern economy.</Highlight>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#17172B]/80 font-medium">
              Not hypothetical job titles. These are high-leverage roles where demonstrable proof of work beats credentials.
            </p>
          </div>
          <Link to="/onboarding">
            <Button variant="primary" size="md" className="gap-2 shrink-0">
              Personalize My Roadmap
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* 6 Career Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((p, i) => {
            const Icon = p.icon;
            return (
              <Card
                key={i}
                variant={p.color}
                shadowSize="md"
                interactive
                className="p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-[#17172B]">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-white border-2 border-[#17172B] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#17172B]" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#17172B]/70">
                        {p.domain}
                      </span>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 bg-white rounded-md border border-[#17172B]">
                      {p.demand}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-[#17172B] mb-2 leading-snug">
                    {p.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#17172B]/80 font-medium mb-6 leading-relaxed">
                    {p.tagline}
                  </p>

                  {/* Skills tags */}
                  <div className="mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#17172B]/60 block mb-2">
                      Core Stack
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {p.keySkills.map((sk) => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 bg-white text-[11px] font-bold text-[#17172B] rounded-md border border-[#17172B]"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-[#17172B] flex items-center justify-between text-xs font-bold text-[#17172B]">
                  <span>Timeline: {p.timeframe}</span>
                  <Link to="/onboarding" className="text-[#17172B] hover:underline flex items-center gap-1">
                    Select Path <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
