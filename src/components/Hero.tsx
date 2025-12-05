'use client';

import { useEffect, useState } from "react";
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";

const EVENT_DATE = new Date("2025-12-06T09:00:00+07:00");

function getCountdown() {
  const now = new Date();
  const diff = EVENT_DATE.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

const Hero = () => {
  const [countdown, setCountdown] = useState(getCountdown());

  useEffect(() => {
    const timer = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#E8F4FF] via-[#EAF6FF] to-[#F0F9FF]">
      {/* Grid Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(176, 190, 197, .05) 25%, rgba(176, 190, 197, .05) 26%, transparent 27%, transparent 74%, rgba(176, 190, 197, .05) 75%, rgba(176, 190, 197, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(176, 190, 197, .05) 25%, rgba(176, 190, 197, .05) 26%, transparent 27%, transparent 74%, rgba(176, 190, 197, .05) 75%, rgba(176, 190, 197, .05) 76%, transparent 77%, transparent)`,
          backgroundSize: '50px 50px'
        }}></div>

        {/* Decorative Shapes */}
        {/* Yellow star top left */}
        <div className="absolute top-20 left-10 w-20 h-20 opacity-60">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,10 L61,39 L90,39 L67,57 L78,86 L50,68 L22,86 L33,57 L10,39 L39,39 Z" fill="#FFD600" />
          </svg>
        </div>

        {/* Yellow star top center */}
        <div className="absolute top-32 right-1/4 w-16 h-16 opacity-50">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,10 L61,39 L90,39 L67,57 L78,86 L50,68 L22,86 L33,57 L10,39 L39,39 Z" fill="#FFD600" />
          </svg>
        </div>

        {/* Yellow star left middle */}
        <div className="absolute top-1/2 left-5 w-24 h-24 opacity-40">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,10 L61,39 L90,39 L67,57 L78,86 L50,68 L22,86 L33,57 L10,39 L39,39 Z" fill="#FFD600" />
          </svg>
        </div>

        {/* Yellow star right */}
        <div className="absolute top-1/3 right-8 w-20 h-20 opacity-45">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,10 L61,39 L90,39 L67,57 L78,86 L50,68 L22,86 L33,57 L10,39 L39,39 Z" fill="#FFD600" />
          </svg>
        </div>

        {/* Pink circle top right */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFB3C6] rounded-full opacity-20 -translate-y-1/2 translate-x-1/3"></div>

        {/* Green circle left middle */}
        <div className="absolute top-1/2 -left-20 w-48 h-48 bg-[#B5EAD7] rounded-full opacity-15"></div>

        {/* Pink hearts bottom left */}
        <div className="absolute bottom-32 left-1/4 w-12 h-12 opacity-30">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,90 C20,70 5,55 5,40 C5,25 15,15 27,15 C35,15 43,20 50,28 C57,20 65,15 73,15 C85,15 95,25 95,40 C95,55 80,70 50,90 Z" fill="#FFB3C6" />
          </svg>
        </div>

        {/* Purple circle bottom right */}
        <div className="absolute bottom-0 -right-16 w-80 h-80 bg-[#C3B1E1] rounded-full opacity-10"></div>

        {/* Puzzle piece top left */}
        <div className="absolute top-1/4 left-1/3 w-32 h-32 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="10" y="10" width="30" height="30" fill="#34A853" />
            <rect x="60" y="10" width="30" height="30" fill="#EA4335" />
            <rect x="10" y="60" width="30" height="30" fill="#FBBC05" />
            <rect x="60" y="60" width="30" height="30" fill="#4285F4" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-3 md:px-4 relative z-10 max-w-sm md:max-w-3xl">
        {/* Icon Bandung Header */}
        <div className="flex justify-center mb-0">
          <img src="/icon-bandung.jpg" alt="DevFest Cloud Bandung 2025" className="w-32 md:w-64 h-auto" />
        </div>

        {/* Main Event Card */}
        <div className="mx-auto max-w-full md:max-w-2xl mb-6 md:mb-10 -mt-1">
          <div className="bg-white rounded-3xl shadow-2xl border-3 md:border-4 border-[#4285F4] px-4 pt-4 pb-6 md:px-10 md:pt-8 md:pb-12 relative overflow-hidden">
            {/* Top decoration - Building */}
            <div className="absolute -top-10 md:-top-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
              {/* Building base - Yellow */}
              <div className="w-14 md:w-20 h-3 md:h-4 bg-[#FFD600] rounded-t-lg shadow-lg"></div>
              {/* Building middle - Pink */}
              <div className="w-12 md:w-16 h-2 md:h-3 bg-[#E91E63] rounded-t-lg -mt-1 shadow-lg"></div>
              {/* Building tower - Blue */}
              <div className="w-1.5 md:w-2 h-7 md:h-10 bg-[#2196F3] rounded-full mt-1 shadow-lg"></div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center gap-2 md:gap-4">
              {/* Title with brackets */}
              <div className="flex items-center gap-1 md:gap-2 justify-center">
                <span className="text-2xl md:text-5xl font-black text-[#4285F4]">{'{'}</span>
                <h1 className="text-2xl md:text-5xl font-black text-[#1a1a1a] tracking-tight">Cloud</h1>
                <span className="text-2xl md:text-5xl font-black text-[#4285F4]">{'}'}</span>
              </div>

              {/* Subtitle badge */}
              <div className="bg-[#4285F4] text-white px-3 py-1 md:px-6 md:py-2 rounded-full font-bold text-xs md:text-xl shadow">
                DevFest · Bandung
              </div>

              {/* Year and branding */}
              <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-center">
                <span className="bg-[#4285F4] text-white px-2 py-1 md:px-4 md:py-2 rounded-full font-bold text-xs md:text-lg">2025</span>
                <img src="/gdg-cloud.jpg" alt="Google Developer Groups Cloud" className="h-8 md:h-12 w-auto" />
              </div>

              {/* Subtitle / Tagline - inside card */}
              <div className="text-center mt-1 md:mt-2">
                <p className="text-[11px] md:text-base font-semibold text-[#222] leading-relaxed">
                  Building Safe, Secure and Scalable Solutions with AI and Cloud
                </p>
              </div>

              {/* Event Details - inside card */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-2 md:mt-4 px-2">
                <div className="inline-flex items-center gap-1 px-2 py-1 md:px-3 md:py-2 rounded-full bg-[#EAF6FF] border border-[#4285F4]">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4 text-[#4285F4]" />
                  <span className="font-semibold text-[10px] md:text-sm text-[#1a1a1a] whitespace-nowrap">Saturday, Dec 6th, 2025</span>
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-1 md:px-3 md:py-2 rounded-full bg-[#FFF9E6] border border-[#FBBC05]">
                  <Clock className="w-3 h-3 md:w-4 md:h-4 text-[#FBBC05]" />
                  <span className="font-semibold text-[10px] md:text-sm text-[#1a1a1a] whitespace-nowrap">09.00 AM – 04.00 PM</span>
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-1 md:px-3 md:py-2 rounded-full bg-[#E8F5E9] border border-[#34A853]">
                  <MapPin className="w-3 h-3 md:w-4 md:h-4 text-[#34A853]" />
                  <span className="font-semibold text-[10px] md:text-sm text-[#1a1a1a] whitespace-nowrap">Selah Hall, Piset Square, Bandung</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Countdown Section - outside card */}
        <div className="flex flex-col items-center mb-6 md:mb-10">
          <h2 className="text-lg md:text-3xl font-black text-[#4285F4] mb-3 md:mb-6">Countdown to Event</h2>
          <div className="grid grid-cols-4 gap-1.5 md:gap-4 max-w-xs md:max-w-lg w-full">
            <div className="flex flex-col items-center bg-white rounded-xl p-2 md:p-4 shadow-lg border-2 border-[#4285F4]">
              <span className="text-xl md:text-4xl font-black text-[#4285F4]">{String(countdown.days).padStart(2, '0')}</span>
              <span className="text-[10px] md:text-sm font-bold text-[#1a1a1a] mt-0.5 md:mt-1">Days</span>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl p-2 md:p-4 shadow-lg border-2 border-[#EA4335]">
              <span className="text-xl md:text-4xl font-black text-[#EA4335]">{String(countdown.hours).padStart(2, '0')}</span>
              <span className="text-[10px] md:text-sm font-bold text-[#1a1a1a] mt-0.5 md:mt-1">Hours</span>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl p-2 md:p-4 shadow-lg border-2 border-[#FBBC05]">
              <span className="text-xl md:text-4xl font-black text-[#FBBC05]">{String(countdown.minutes).padStart(2, '0')}</span>
              <span className="text-[10px] md:text-sm font-bold text-[#1a1a1a] mt-0.5 md:mt-1">Minutes</span>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl p-2 md:p-4 shadow-lg border-2 border-[#34A853]">
              <span className="text-xl md:text-4xl font-black text-[#34A853]">{String(countdown.seconds).padStart(2, '0')}</span>
              <span className="text-[10px] md:text-sm font-bold text-[#1a1a1a] mt-0.5 md:mt-1">Seconds</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 pb-6 md:pb-8">
          <a
            href="https://www.goersapp.com/events/indonesia-premier-cloud-and-ai-festival-dev-fest-cloud-bandung-2025--devfestcloudbdg25"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button 
              size="lg" 
              className="text-sm md:text-lg px-6 md:px-10 py-3 md:py-6 rounded-full bg-[#4285F4] hover:bg-[#1a73e8] text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-black"
            >
              Register Now
            </Button>
          </a>
          <a href="/auth">
            <Button 
              size="lg" 
              variant="outline"
              className="text-sm md:text-lg px-6 md:px-10 py-3 md:py-6 rounded-full border-2 border-[#4285F4] text-[#4285F4] hover:bg-[#4285F4]/10 shadow-lg hover:shadow-xl transition-all hover:scale-105 font-bold"
            >
              Login
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
