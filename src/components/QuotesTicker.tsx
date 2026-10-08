import React, { useState, useEffect } from 'react';
import { Quote, Sparkles, ChevronLeft, ChevronRight, HeartPulse } from 'lucide-react';
import { HOSPITAL_QUOTES, HealthQuote } from '../data/quotes';

export const QuotesTicker: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HOSPITAL_QUOTES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const currentQuote = HOSPITAL_QUOTES[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? HOSPITAL_QUOTES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HOSPITAL_QUOTES.length);
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-emerald-100/70 border border-emerald-200/90 p-4 shadow-sm transition-all ${className}`}>
      {/* Decorative pulse line in background */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
        <HeartPulse className="w-32 h-32 text-emerald-800" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-700/20 mt-0.5">
            <Quote className="w-4 h-4 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300">
                HEALTHCARE MOTTO & CLINICAL WISDOM
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentIndex + 1} of {HOSPITAL_QUOTES.length}
              </span>
            </div>
            <p className="text-xs md:text-sm font-serif italic text-slate-800 font-medium leading-relaxed">
              “{currentQuote.quote}”
            </p>
            <div className="text-[11px] text-emerald-800 font-mono font-bold mt-1">
              — {currentQuote.author}, <span className="text-slate-500 font-normal">{currentQuote.title}</span>
            </div>
          </div>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg bg-white hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 border border-emerald-200 transition-colors shadow-sm"
            title="Previous Quote"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg bg-white hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 border border-emerald-200 transition-colors shadow-sm"
            title="Next Quote"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
