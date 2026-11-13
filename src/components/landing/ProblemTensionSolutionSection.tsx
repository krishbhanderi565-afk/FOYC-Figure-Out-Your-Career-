import React from 'react';

export const ProblemTensionSolutionSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#FCEEE9] border-y-3 border-[#17172B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FEFAF7] rounded-3xl border-3 border-[#17172B] shadow-[6px_6px_0px_#17172B] overflow-hidden transition-all hover:shadow-[8px_8px_0px_#17172B]">
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
