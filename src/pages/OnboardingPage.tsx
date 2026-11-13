import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCareer } from '../context/CareerContext';
import { Navbar } from '../components/common/Navbar';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Highlight } from '../components/common/Highlight';
import { ArrowLeft, ArrowRight, Sparkles, Check, Globe, Clock, User, BookOpen } from 'lucide-react';
import { AgeRange, EducationStatus, CareerStage } from '../types/career';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useCareer();
  const [step, setStep] = useState(1);

  // Form local state
  const [name, setName] = useState(profile.preferredName || '');
  const [ageRange, setAgeRange] = useState<AgeRange>(profile.ageRange || '18-22');
  const [country, setCountry] = useState(profile.country || '');
  const [status, setStatus] = useState<EducationStatus>(profile.educationStatus || 'college-student');
  const [currentField, setCurrentField] = useState(profile.currentField || 'Computer Science & Software');
  const [stage, setStage] = useState<CareerStage>(profile.careerStage || 'exploring');
  const [availableHours, setAvailableHours] = useState<number>(profile.availableHoursPerWeek || 15);

  const totalSteps = 3;

  const handleNext = () => {
    updateProfile({
      preferredName: name,
      ageRange,
      country,
      educationStatus: status,
      currentField,
      careerStage: stage,
      availableHoursPerWeek: availableHours,
    });

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate('/reflection');
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  return (
    <div className="min-h-screen bg-[#FCEEE9] flex flex-col text-[#17172B]">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Progress Bar & Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#17172B]/60 mb-2">
            <span>Step 0{step} of 0{totalSteps}</span>
            <span>{step === 1 ? 'About You' : step === 2 ? 'Current Background' : 'Learning Availability'}</span>
          </div>
          <div className="w-full bg-white h-3.5 rounded-full border-2 border-[#17172B] overflow-hidden p-0.5 shadow-[2px_2px_0px_#17172B]">
            <div
              className="bg-[#FFE76B] h-full rounded-full border-r border-[#17172B] transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Basic Identity */}
        {step === 1 && (
          <Card variant="white" shadowSize="lg" className="p-6 sm:p-10">
            <div className="mb-8">
              <span className="text-xs font-black uppercase tracking-widest text-[#17172B]/60 bg-[#FFE76B] px-3 py-1 rounded-full border border-[#17172B] inline-block mb-3">
                Phase 1: Getting to Know You
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#17172B] tracking-tight">
                Let's set up your <Highlight color="#FFE76B">profile basics.</Highlight>
              </h1>
              <p className="text-sm sm:text-base text-[#17172B]/75 font-medium mt-2">
                No phone number, no address, no private ID. Just enough context to make your career recommendations realistic.
              </p>
            </div>

            <div className="space-y-6">
              {/* Preferred Name */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-2">
                  What should we call you? <span className="text-xs font-normal text-[#17172B]/50">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex, Maya, Dev..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#FFE76B] shadow-[2px_2px_0px_#17172B]"
                  />
                  <User className="absolute right-4 top-3.5 w-5 h-5 text-[#17172B]/40 pointer-events-none" />
                </div>
              </div>

              {/* Age Range */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-2">
                  What is your age bracket?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {(
                    [
                      { id: 'under-18', label: 'Under 18' },
                      { id: '18-22', label: '18 - 22' },
                      { id: '23-27', label: '23 - 27' },
                      { id: '28-35', label: '28 - 35' },
                      { id: '36+', label: '36+' },
                    ] as { id: AgeRange; label: string }[]
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAgeRange(item.id)}
                      className={`py-3 px-2 text-xs sm:text-sm font-bold rounded-xl border-2 border-[#17172B] text-center transition-all ${
                        ageRange === item.id
                          ? 'bg-[#FFE76B] shadow-[3px_3px_0px_#17172B] translate-x-0.5 translate-y-0.5'
                          : 'bg-[#FFFDF7] hover:bg-[#DDF5C5] text-[#17172B]/75 shadow-[1.5px_1.5px_0px_#17172B]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Country / Region */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-2">
                  Country or Geographic Region <span className="text-xs font-normal text-[#17172B]/50">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. India, United States, Germany, Nigeria, Brazil..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#FFE76B] shadow-[2px_2px_0px_#17172B]"
                  />
                  <Globe className="absolute right-4 top-3.5 w-5 h-5 text-[#17172B]/40 pointer-events-none" />
                </div>
                <p className="text-[11px] text-[#17172B]/60 mt-1">
                  Helps tailor salary benchmarks and market realities to your location.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Current Status & Background */}
        {step === 2 && (
          <Card variant="white" shadowSize="lg" className="p-6 sm:p-10">
            <div className="mb-8">
              <span className="text-xs font-black uppercase tracking-widest text-[#17172B]/60 bg-[#D7EAFE] px-3 py-1 rounded-full border border-[#17172B] inline-block mb-3">
                Phase 2: Academic & Professional Status
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#17172B] tracking-tight">
                Where are you <Highlight color="#D7EAFE">starting from?</Highlight>
              </h1>
              <p className="text-sm sm:text-base text-[#17172B]/75 font-medium mt-2">
                FOYC works whether you attend a top university or are 100% self-taught.
              </p>
            </div>

            <div className="space-y-6">
              {/* Education / Professional Status Cards */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-2">
                  Current Status
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'college-student' as EducationStatus, label: 'College / University Student', sub: 'Pursuing undergrad or postgrad degree' },
                    { id: 'recent-graduate' as EducationStatus, label: 'Recent Graduate', sub: 'Completed studies within the last 12 months' },
                    { id: 'working-professional' as EducationStatus, label: 'Working Professional', sub: 'Employed, exploring advancement' },
                    { id: 'career-switcher' as EducationStatus, label: 'Career Switcher', sub: 'Looking to pivot into a new field' },
                    { id: 'self-taught' as EducationStatus, label: 'Self-Taught Learner', sub: 'Learning independently without formal degree' },
                    { id: 'high-school' as EducationStatus, label: 'High School / Pre-College', sub: 'Exploring early options before college' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setStatus(item.id)}
                      className={`p-3.5 text-left rounded-xl border-2 border-[#17172B] transition-all flex items-start justify-between ${
                        status === item.id
                          ? 'bg-[#FFE76B] shadow-[3px_3px_0px_#17172B]'
                          : 'bg-[#FFFDF7] hover:bg-[#DDF5C5] shadow-[1.5px_1.5px_0px_#17172B]'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm text-[#17172B]">{item.label}</div>
                        <div className="text-[11px] text-[#17172B]/70 font-medium">{item.sub}</div>
                      </div>
                      {status === item.id && (
                        <div className="w-5 h-5 rounded-full bg-white border border-[#17172B] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-[#17172B]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Field */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-2">
                  Current Area of Study or Industry
                </label>
                <input
                  type="text"
                  value={currentField}
                  onChange={(e) => setCurrentField(e.target.value)}
                  placeholder="e.g. Computer Science, Mechanical Engineering, Commerce, Graphic Design..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#FFE76B] shadow-[2px_2px_0px_#17172B]"
                />
              </div>

              {/* Career Stage */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-2">
                  How would you describe your current career clarity?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'exploring' as CareerStage, label: 'Totally Exploring', desc: 'No clear idea yet' },
                    { id: 'beginner' as CareerStage, label: 'Early Beginner', desc: 'Have 2-3 vague ideas' },
                    { id: 'intermediate' as CareerStage, label: 'Focused', desc: 'Know role, need roadmap' },
                    { id: 'pivoting' as CareerStage, label: 'Pivoting', desc: 'Changing direction' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setStage(item.id)}
                      className={`p-3 rounded-xl border-2 border-[#17172B] text-center transition-all ${
                        stage === item.id
                          ? 'bg-[#DDF5C9] shadow-[3px_3px_0px_#17172B]'
                          : 'bg-[#FFFDF7] hover:bg-[#DDF5C5] shadow-[1.5px_1.5px_0px_#17172B]'
                      }`}
                    >
                      <div className="font-bold text-xs text-[#17172B]">{item.label}</div>
                      <div className="text-[10px] text-[#17172B]/60">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Available Time & Commitment */}
        {step === 3 && (
          <Card variant="white" shadowSize="lg" className="p-6 sm:p-10">
            <div className="mb-8">
              <span className="text-xs font-black uppercase tracking-widest text-[#17172B]/60 bg-[#DDF5C9] px-3 py-1 rounded-full border border-[#17172B] inline-block mb-3">
                Phase 3: Real Life Bandwidth
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#17172B] tracking-tight">
                How much time can you <Highlight color="#DDF5C9">honestly commit?</Highlight>
              </h1>
              <p className="text-sm sm:text-base text-[#17172B]/75 font-medium mt-2">
                We design roadmaps around your real life, not an impossible 14-hour grind fantasy.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black uppercase tracking-wider text-[#17172B]">
                    Dedicated Learning Time per Week
                  </label>
                  <span className="font-extrabold text-lg text-[#17172B] px-3 py-0.5 rounded-lg bg-[#FFE76B] border border-[#17172B]">
                    {availableHours} Hours / Week
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="40"
                  step="2"
                  value={availableHours}
                  onChange={(e) => setAvailableHours(Number(e.target.value))}
                  className="w-full h-3 bg-white rounded-lg border-2 border-[#17172B] cursor-pointer accent-[#17172B]"
                />
                <div className="flex justify-between text-[11px] font-bold text-[#17172B]/50 mt-1">
                  <span>Casual (4-6 hrs)</span>
                  <span>Part-time (12-16 hrs)</span>
                  <span>Full-time immersion (30-40 hrs)</span>
                </div>
              </div>

              {/* Summary note box */}
              <div className="bg-[#DDF5C5] p-5 rounded-2xl border-2 border-[#17172B] flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#17172B] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm font-semibold text-[#17172B]/90 leading-relaxed">
                  At <strong>{availableHours} hours/week</strong>, a typical learner can comfortably build a defensible capstone portfolio and master foundational competencies in approximately <strong>{Math.ceil(180 / availableHours)} weeks</strong>.
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Footer Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between gap-4">
          {step > 1 ? (
            <Button
              variant="secondary"
              size="md"
              onClick={() => setStep(step - 1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          ) : (
            <Link to="/">
              <Button variant="secondary" size="md" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Exit to Home
              </Button>
            </Link>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleSkip}
              className="text-xs font-bold text-[#17172B]/60 hover:text-[#17172B] underline"
            >
              Skip optional
            </button>
            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              className="gap-2 px-6"
            >
              <span>{step === totalSteps ? "Continue to What's On Your Mind" : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
