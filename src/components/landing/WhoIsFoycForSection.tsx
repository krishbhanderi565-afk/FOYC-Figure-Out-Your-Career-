import React from 'react';
import { Compass, Users, ArrowRight } from 'lucide-react';
import { Highlight } from '../common/Highlight';
import { Link } from 'react-router-dom';

interface AudienceCardData {
  id: string;
  label: string;
  tagline: string;
  imageSrc: string;
  badge: string;
}

const ROW_ONE_AUDIENCE: AudienceCardData[] = [
  {
    id: 'school-students',
    label: 'School Students',
    tagline: 'Stream & Subject Clarity',
    imageSrc: '/assets/audience/school-students.png',
    badge: 'Class 8–12',
  },
  {
    id: 'college-students',
    label: 'College Students',
    tagline: 'Internships & First Roles',
    imageSrc: '/assets/audience/college-students.png',
    badge: 'Any Degree',
  },
  {
    id: 'working-professionals',
    label: 'Working Professionals',
    tagline: 'Up-Skilling & Promotions',
    imageSrc: '/assets/audience/working-professionals.png',
    badge: '1–10+ Years',
  },
  {
    id: 'housewives',
    label: 'Housewives',
    tagline: 'Career Re-Entry & Flexibility',
    imageSrc: '/assets/audience/housewives.png',
    badge: 'Return to Work',
  },
  {
    id: 'entrepreneurs',
    label: 'Entrepreneurs',
    tagline: 'Founding & Execution Skills',
    imageSrc: '/assets/audience/entrepreneurs.png',
    badge: 'Building MVPs',
  },
  {
    id: 'job-seekers',
    label: 'Job Seekers',
    tagline: 'Proof of Work & Direction',
    imageSrc: '/assets/audience/job-seekers.png',
    badge: 'Actively Applying',
  },
];

const ROW_TWO_AUDIENCE: AudienceCardData[] = [
  {
    id: 'career-switchers',
    label: 'Career Switchers',
    tagline: 'Pivoting to High-Demand Tech',
    imageSrc: '/assets/audience/career-switchers.png',
    badge: 'Field Change',
  },
  {
    id: 'tenth-twelfth-pass',
    label: '10th / 12th Pass',
    tagline: 'Choosing the Next Foundation',
    imageSrc: '/assets/audience/tenth-twelfth-pass.png',
    badge: 'Early Crossroads',
  },
  {
    id: 'parents',
    label: 'Parents',
    tagline: 'Objective Guidance for Kids',
    imageSrc: '/assets/audience/parents.png',
    badge: 'Family Support',
  },
  {
    id: 'freelancers',
    label: 'Freelancers',
    tagline: 'High-Ticket Niche Specialization',
    imageSrc: '/assets/audience/freelancers.png',
    badge: 'Independent Work',
  },
  {
    id: 'lifelong-learners',
    label: 'Lifelong Learners',
    tagline: 'Curiosity & Continuous Mastery',
    imageSrc: '/assets/audience/lifelong-learners.png',
    badge: 'Evergreen Growth',
  },
  {
    id: 'anyone-curious',
    label: 'Anyone Curious',
    tagline: 'Unpacking What You Really Want',
    imageSrc: '/assets/audience/anyone-curious.png',
    badge: 'Zero Judgment',
  },
];

// Duplicate items for a seamless, jump-free loop
const duplicatedRowOne = [...ROW_ONE_AUDIENCE, ...ROW_ONE_AUDIENCE, ...ROW_ONE_AUDIENCE];
const duplicatedRowTwo = [...ROW_TWO_AUDIENCE, ...ROW_TWO_AUDIENCE, ...ROW_TWO_AUDIENCE];

export const WhoIsFoycForSection: React.FC = () => {
  return (
    <section className="relative py-14 sm:py-20 bg-[#FDF5EB] border-b border-[#E8E5DE] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center space-y-4">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 border-[#171717] bg-white shadow-[2px_2px_0px_#171717]">
          <Users className="w-3.5 h-3.5 text-[#526B50]" />
          <span className="text-xs font-black uppercase tracking-wider text-[#171717]">
            Universal Career Discovery
          </span>
        </div>

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-5xl font-black text-[#171717] tracking-tight leading-tight">
          FOYC is for <Highlight color="#FFE76B">everyone.</Highlight>
        </h2>

        {/* Supporting Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-[#333333] font-medium max-w-2xl mx-auto leading-relaxed">
          Whatever your background, wherever you are in your journey, FOYC helps you find clarity and take your next step.
        </p>
      </div>

      {/* Animated Marquee Rows Container */}
      <div className="relative w-full space-y-4 sm:space-y-6">
        {/* Soft edge fade masks on large screens for seamless entry & exit */}
        <div className="hidden md:block pointer-events-none absolute inset-y-0 left-0 w-24 z-20 bg-gradient-to-r from-[#FDF5EB] to-transparent" />
        <div className="hidden md:block pointer-events-none absolute inset-y-0 right-0 w-24 z-20 bg-gradient-to-l from-[#FDF5EB] to-transparent" />

        {/* ROW 1: Right to Left */}
        <div className="marquee-row overflow-x-hidden w-full flex">
          <div className="animate-marquee-left flex gap-4 sm:gap-6 py-2 px-2">
            {duplicatedRowOne.map((card, idx) => (
              <div
                key={`${card.id}-r1-${idx}`}
                className="group relative w-[170px] sm:w-[220px] md:w-[270px] shrink-0 bg-white rounded-2xl border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[5px_5px_0px_#171717]"
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full bg-[#EDF2E9] text-[#526B50] border border-[#A8B99A]">
                    {card.badge}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#526B50]" />
                </div>

                {/* Character Illustration */}
                <div className="w-full h-28 sm:h-36 md:h-44 flex items-center justify-center overflow-hidden my-1">
                  <img
                    src={card.imageSrc}
                    alt={`${card.label} — FOYC career discovery for ${card.label}`}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
                  />
                </div>

                {/* Category Label & Tagline */}
                <div className="pt-2 sm:pt-3 border-t border-[#E8E5DE] text-left">
                  <h3 className="font-black text-xs sm:text-base text-[#171717] tracking-tight group-hover:text-[#526B50] transition-colors truncate">
                    {card.label}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] font-bold text-[#666666] truncate mt-0.5">
                    {card.tagline}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 2: Left to Right */}
        <div className="marquee-row overflow-x-hidden w-full flex">
          <div className="animate-marquee-right flex gap-4 sm:gap-6 py-2 px-2">
            {duplicatedRowTwo.map((card, idx) => (
              <div
                key={`${card.id}-r2-${idx}`}
                className="group relative w-[170px] sm:w-[220px] md:w-[270px] shrink-0 bg-white rounded-2xl border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[5px_5px_0px_#171717]"
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full bg-[#EDF2E9] text-[#526B50] border border-[#A8B99A]">
                    {card.badge}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#d97706]" />
                </div>

                {/* Character Illustration */}
                <div className="w-full h-28 sm:h-36 md:h-44 flex items-center justify-center overflow-hidden my-1">
                  <img
                    src={card.imageSrc}
                    alt={`${card.label} — FOYC career discovery for ${card.label}`}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
                  />
                </div>

                {/* Category Label & Tagline */}
                <div className="pt-2 sm:pt-3 border-t border-[#E8E5DE] text-left">
                  <h3 className="font-black text-xs sm:text-base text-[#171717] tracking-tight group-hover:text-[#526B50] transition-colors truncate">
                    {card.label}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] font-bold text-[#666666] truncate mt-0.5">
                    {card.tagline}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sub-CTA */}
      <div className="mt-8 text-center">
        <Link
          to="/onboarding"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#171717] hover:text-[#526B50] transition-colors group"
        >
          <span>Figure Out Your Career — Start with 8 Questions</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};
