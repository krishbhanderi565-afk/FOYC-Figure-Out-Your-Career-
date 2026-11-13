import React from 'react';

export const ProblemTensionSolutionSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#FFFDF8] border-y border-[#E8E5DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FEFAF7] rounded-3xl border-2 border-[#171717] shadow-[4px_4px_0px_#171717] overflow-hidden transition-all hover:shadow-[6px_6px_0px_#171717]">
          <div className="w-full overflow-x-auto scrollbar-thin">
            <img
              src="/assets/foyc_confusion_to_momentum.jpg"
              alt="From Career Confusion to Clear Momentum — Get the right guidance. Build real skills. Move forward with confidence."
              className="w-full min-w-[700px] md:min-w-0 h-auto block object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
