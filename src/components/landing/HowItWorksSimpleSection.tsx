import React from 'react';

export const HowItWorksSimpleSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-12 sm:py-16 md:py-20 bg-[#FFFDF8] border-b border-[#E8E5DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FEFAF7] rounded-3xl border-2 border-[#171717] shadow-[4px_4px_0px_#171717] overflow-hidden transition-all hover:shadow-[6px_6px_0px_#171717]">
          <div className="w-full overflow-x-auto scrollbar-thin">
            <img
              src="/assets/foyc_how_it_works.jpg"
              alt="How FOYC Works — A simple process. A big impact."
              className="w-full min-w-[700px] md:min-w-0 h-auto block object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
