/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Gift, Cake, Stars, Music, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const Rocket = () => (
  <div className="relative w-16 h-40 flex flex-col items-center">
    {/* Pointy Nose Cone */}
    <div className="w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-b-[60px] border-b-rose-700 drop-shadow-lg" />
    
    {/* Rocket Body */}
    <div className="w-16 h-32 bg-gradient-to-b from-rose-700 to-rose-900 relative flex items-center justify-center border-x-2 border-rose-800/50">
      {/* DCRS Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-black text-xl tracking-[0.2em] [writing-mode:vertical-rl] rotate-180 drop-shadow-md">
          DCRS
        </span>
      </div>
      
      {/* Fins */}
      <div className="absolute bottom-0 -left-6 w-8 h-16 bg-rose-950 rounded-bl-[20%] skew-y-[20deg] border-l-2 border-rose-800/30" />
      <div className="absolute bottom-0 -right-6 w-8 h-16 bg-rose-950 rounded-br-[20%] -skew-y-[20deg] border-r-2 border-rose-800/30" />
    </div>
    
    {/* Thruster Flame */}
    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-12 h-24">
      <div className="w-full h-full bg-gradient-to-t from-orange-600 via-yellow-400 to-transparent blur-md animate-pulse" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-16 bg-white/80 blur-sm rounded-full" />
    </div>
  </div>
);

const ModernCake = ({ isBlasted }: { isBlasted: boolean }) => (
  <div className={`relative transition-all duration-300 ${isBlasted ? 'scale-150 opacity-0 blur-3xl' : 'scale-100'}`}>
    {/* Cake Layers */}
    <div className="w-32 h-12 bg-rose-100 rounded-t-xl shadow-inner relative z-10">
      <div className="absolute top-0 left-0 w-full h-4 bg-white/50 rounded-t-xl" />
      <div className="absolute -bottom-2 left-0 w-full h-4 bg-rose-200/50 blur-[2px]" />
    </div>
    <div className="w-40 h-14 bg-rose-200 rounded-t-xl -mt-2 shadow-md relative z-0">
      <div className="absolute top-0 left-0 w-full h-4 bg-white/30 rounded-t-xl" />
    </div>
    {/* Candles */}
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="relative w-2 h-8 bg-gradient-to-b from-amber-200 to-amber-400 rounded-full">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.2 }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-5 bg-orange-500 rounded-full blur-[2px]" 
          />
        </div>
      ))}
    </div>
    {/* Plate */}
    <div className="w-48 h-4 bg-white/20 backdrop-blur-sm rounded-full -mt-1 mx-auto" />
  </div>
);

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [introStep, setIntroStep] = useState<'flying' | 'striking' | 'blast' | 'text'>('flying');
  const [isCelebrated, setIsCelebrated] = useState(false);
  const [poem, setPoem] = useState<string>("ଶୁଭ ଜନ୍ମଦିନ ସୌଭାଗ୍ୟା!\nଆପଣଙ୍କ ଜୀବନ ସୁଖ ଓ ଶାନ୍ତିରେ ଭରିଯାଉ।\nମହାପ୍ରଭୁ ଶ୍ରୀ ଜଗନ୍ନାଥ ଆପଣଙ୍କୁ ସବୁବେଳେ ରକ୍ଷା କରନ୍ତୁ,\nଆପଣଙ୍କର ସମସ୍ତ ମନସ୍କାମନା ପୂର୍ଣ୍ଣ ହେଉ।\nଆପଣଙ୍କର ଏହି ବିଶେଷ ଦିନଟି ବହୁତ ସ୍ମରଣୀୟ ହେଉ।");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Intro sequence - Slow flight then direct strike
    const timer1 = setTimeout(() => setIntroStep('striking'), 100);
    const timer2 = setTimeout(() => {
      setIntroStep('blast');
      confetti({
        particleCount: 500,
        spread: 200,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fbbf24', '#ffffff', '#ec4899', '#ff0000', '#ffd700'],
        ticks: 600,
        gravity: 0.4,
        scalar: 3
      });
    }, 3500); // Flight duration
    const timer3 = setTimeout(() => setIntroStep('text'), 3700);
    const timer4 = setTimeout(() => setShowIntro(false), 8000);

    const fetchPoem = async () => {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview", // Using flash for better availability
          contents: "Write a short, beautiful, and heartfelt birthday poem for a girl named Soubhagya in ODIA language. The tone should be very respectful and sweet. Mention her grace. Include a blessing like 'May Lord Jagannath protect you and fulfill all your wishes'. Keep it under 6 lines.",
        });
        if (response.text) {
          setPoem(response.text);
        }
      } catch (error) {
        console.error("Error fetching poem (using fallback):", error);
        // Fallback is already set in initial state
      } finally {
        setLoading(false);
      }
    };

    fetchPoem();
    handleCelebrate();

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const handleCelebrate = () => {
    setIsCelebrated(true);
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#0a0502] text-white font-sans overflow-x-hidden selection:bg-rose-500/30">
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            exit={{ opacity: 0, filter: 'blur(40px)' }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-[100] bg-[#050201] flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-900/40 via-transparent to-transparent" />
            
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              {/* Rocket Strike Animation */}
              <AnimatePresence>
                {(introStep === 'flying' || introStep === 'striking') && (
                  <motion.div
                    initial={{ x: 1000, y: -1000, rotate: 45, scale: 0.3 }}
                    animate={introStep === 'striking' ? { x: 0, y: 200, rotate: 0, scale: 1.2 } : {}}
                    exit={{ scale: 0, opacity: 0, filter: 'brightness(10) blur(30px)' }}
                    transition={{ 
                      duration: 3.5, // Slow flight then fast strike
                      ease: [0.45, 0, 0.55, 1], // Custom ease for a direct strike feel
                    }}
                    className="absolute z-20"
                  >
                    <Rocket />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cake */}
              <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="mt-60 relative"
              >
                <ModernCake isBlasted={introStep === 'blast'} />
                
                {introStep === 'blast' && (
                  <>
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 25, opacity: 0 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute inset-0 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-400 rounded-full blur-3xl"
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-[-100vw] bg-white z-50"
                    />
                  </>
                )}
              </motion.div>

              {/* Text Reveal */}
              <AnimatePresence>
                {(introStep === 'text' || introStep === 'blast') && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                    className="mt-16 text-center z-10"
                  >
                    <motion.h2 
                      animate={{ 
                        textShadow: [
                          "0 0 30px rgba(244,63,94,0.5)",
                          "0 0 60px rgba(244,63,94,1)",
                          "0 0 30px rgba(244,63,94,0.5)"
                        ] 
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-6xl md:text-8xl font-serif italic text-rose-400 leading-tight"
                    >
                      ଶୁଭ ଜନ୍ମଦିନ <br />
                      <span className="text-white not-italic font-light tracking-[0.2em] uppercase text-3xl md:text-5xl block mt-6">
                        ସୌଭାଗ୍ୟା
                      </span>
                    </motion.h2>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Immersive Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-900/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-900/10 blur-[150px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-900/10 blur-[100px] rounded-full animate-bounce-slow" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="space-y-6"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5 }}
            className="text-xs uppercase tracking-[0.4em] font-medium text-rose-300"
          >
            ଏକ ସ୍ୱତନ୍ତ୍ର ଆତ୍ମା ପାଇଁ ଏକ ସ୍ୱତନ୍ତ୍ର ଦିନ
          </motion.span>
          <h1 className="text-7xl md:text-9xl font-serif font-light tracking-tighter leading-none">
            ଶୁଭ ଜନ୍ମଦିନ <br />
            <span className="italic font-normal text-rose-400">ସୌଭାଗ୍ୟା</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-12 relative group cursor-pointer"
          onClick={handleCelebrate}
        >
          <div className="absolute -inset-4 bg-rose-500/20 blur-2xl rounded-full group-hover:bg-rose-500/30 transition-all duration-500" />
          <button className="relative bg-white/5 backdrop-blur-md border border-white/10 px-10 py-5 rounded-full flex items-center gap-3 text-xl font-medium hover:bg-white/10 transition-all">
            <Sparkles className="w-6 h-6 text-amber-400" />
            ଉତ୍ସବ ପାଳନ କରନ୍ତୁ
          </button>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30"
        >
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </section>

      {/* Message Section */}
      <section className="relative py-32 px-6 z-10 text-center bg-white/[0.02]">
        <div className="max-w-3xl mx-auto space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Cake className="w-16 h-16 text-rose-400 mx-auto mb-10" />
            <h3 className="text-4xl md:text-6xl font-serif italic mb-10">ଆପଣଙ୍କ ପାଇଁ ଏକ ବାର୍ତ୍ତା</h3>
            
            <div className="relative p-12 md:p-20 bg-white/5 backdrop-blur-xl rounded-[4rem] border border-white/10 overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-10"
                >
                  <p className="text-2xl md:text-3xl leading-relaxed font-serif whitespace-pre-line text-white/90">
                    {poem}
                  </p>
                  <div className="pt-12 border-t border-white/10 space-y-6">
                    <p className="text-xl md:text-2xl text-rose-300 font-serif italic leading-relaxed">
                      ମହାପ୍ରଭୁ ଶ୍ରୀ ଜଗନ୍ନାଥ ଆପଣଙ୍କୁ ସବୁବେଳେ ରକ୍ଷା କରନ୍ତୁ ଏବଂ ଆପଣଙ୍କର ସମସ୍ତ ମନସ୍କାମନା ପୂର୍ଣ୍ଣ କରନ୍ତୁ।
                    </p>
                    <p className="text-lg md:text-xl text-white/70 font-serif italic">
                      ଆପଣ ଜଣେ ବହୁତ ଭଲ ମଣିଷ। ଆପଣଙ୍କ ଜୀବନ ସୁଖ ଓ ସମୃଦ୍ଧିରେ ଭରିଯାଉ। ଆପଣଙ୍କର ଭବିଷ୍ୟତ ବହୁତ ଉଜ୍ଜ୍ୱଳ ହେଉ।
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-12"
          >
            <p className="text-lg font-serif italic text-rose-300">ସୌଭାଗ୍ୟା, ଆପଣଙ୍କ ଜୀବନ ସୁଖ ଓ ଶାନ୍ତିରେ ଭରିଯାଉ।</p>
          </motion.div>
        </div>
      </section>

      {/* Footer Decoration */}
      <footer className="relative py-20 px-6 z-10 text-center opacity-30">
        <div className="flex justify-center gap-10 mb-10">
          <Gift className="w-6 h-6" />
          <Music className="w-6 h-6" />
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-sm tracking-[0.5em] uppercase">ସୌଭାଗ୍ୟା • ୨୦୨୬ • ଶୁଭ ଜନ୍ମଦିନ</p>
      </footer>

      {/* Custom Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');
        
        :root {
          --font-serif: 'Cormorant Garamond', serif;
          --font-sans: 'Inter', sans-serif;
        }

        .font-serif { font-family: var(--font-serif); }
        .font-sans { font-family: var(--font-sans); }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
