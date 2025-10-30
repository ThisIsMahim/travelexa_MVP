import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const Motto = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const stayRef = useRef<HTMLDivElement>(null);
  const travelRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create timeline for the entire animation sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          pin: false,
        },
      });

      // Plane animation path
      // Starting from center bottom, move to left, then right, then left and vanish
      tl.fromTo(
        planeRef.current,
        {
          x: '0%',
          y: '-20vh',
          scale: 0.5,
          opacity: 0,
          rotation: 0,
        },
        {
          x: '0%',
          y: '10vh',
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.15,
        },
        0
      )
        // Move to left (Stay section)
        .to(
          planeRef.current,
          {
            x: '-40%',
            y: '30vh',
            rotation: -15,
            scale: 1.2,
            duration: 0.25,
          },
          0.15
        )
        // Move to right (Travel section)
        .to(
          planeRef.current,
          {
            x: '40%',
            y: '60vh',
            rotation: 15,
            scale: 1.2,
            duration: 0.3,
          },
          0.4
        )
        // Move to left (Explore section)
        .to(
          planeRef.current,
          {
            x: '-45%',
            y: '90vh',
            rotation: -20,
            scale: 1,
            duration: 0.2,
          },
          0.7
        )
        // Vanish at the edge
        .to(
          planeRef.current,
          {
            x: '-60%',
            y: '100vh',
            opacity: 0,
            scale: 0.5,
            rotation: -30,
            duration: 0.1,
          },
          0.9
        );

      // Title animation (appears first)
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 50,
          filter: 'blur(20px)',
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
          },
        }
      );

      // Stay section - Dissolve in
      gsap.fromTo(
        stayRef.current,
        {
          opacity: 0,
          scale: 0.8,
          filter: 'blur(30px)',
          y: 100,
        },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 1.5,
          scrollTrigger: {
            trigger: stayRef.current,
            start: 'top 85%',
            end: 'top 60%',
            scrub: 1,
          },
        }
      );

      // Travel section - Dissolve in
      gsap.fromTo(
        travelRef.current,
        {
          opacity: 0,
          scale: 0.8,
          filter: 'blur(30px)',
          y: 100,
        },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 1.5,
          scrollTrigger: {
            trigger: travelRef.current,
            start: 'top 85%',
            end: 'top 60%',
            scrub: 1,
          },
        }
      );

      // Explore section - Dissolve in
      gsap.fromTo(
        exploreRef.current,
        {
          opacity: 0,
          scale: 0.8,
          filter: 'blur(30px)',
          y: 100,
        },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 1.5,
          scrollTrigger: {
            trigger: exploreRef.current,
            start: 'top 85%',
            end: 'top 60%',
            scrub: 1,
          },
        }
      );

      // Parallax effect for content blocks
      gsap.to(stayRef.current, {
        y: -50,
        scrollTrigger: {
          trigger: stayRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      });

      gsap.to(travelRef.current, {
        y: -80,
        scrollTrigger: {
          trigger: travelRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      });

      gsap.to(exploreRef.current, {
        y: -50,
        scrollTrigger: {
          trigger: exploreRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[300vh] bg-gradient-to-b from-black via-slate-950 to-black overflow-hidden"
    >
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      </div>

      {/* Flying Plane - White Airplane facing down */}
      <div
        ref={planeRef}
        className="fixed left-1/2 top-0 z-50 pointer-events-none transform -translate-x-1/2"
        style={{
          filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.4))',
        //   top: '100vh', // Start from below the hero section
        }}
      >
        {/* Dotted trail - ABOVE the plane (behind it as it flies down) */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 flex flex-col-reverse items-center gap-3 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
          <div className="w-1 h-1 rounded-full bg-white/30" />
          <div className="w-1 h-1 rounded-full bg-white/15" />
        </div>
        
        {/* Simple clean airplane - top view, nose pointing down */}
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 md:w-16 md:h-16"
        >
          {/* Main body/fuselage */}
          <path
            d="M24 4 L22 42 L24 44 L26 42 L24 4Z"
            fill="white"
          />
          
          {/* Main wings */}
          <path
            d="M4 20 L8 22 L24 24 L40 22 L44 20 L42 18 L24 20 L6 18 L4 20Z"
            fill="white"
          />
          
          {/* Tail wings */}
          <path
            d="M16 38 L24 40 L32 38 L30 36 L24 37 L18 36 L16 38Z"
            fill="white"
          />
          
          {/* Nose tip */}
          <circle cx="24" cy="4" r="2" fill="white" />
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 py-32">
        {/* Title - "With Travelexa" */}
        <div
          ref={titleRef}
          className="text-center mb-32 pt-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wider text-white/90">
            {t('motto.title')}
          </h2>
          <div className="w-24 h-px bg-primary/50 mx-auto mt-6" />
        </div>

        {/* Stay Section - Left */}
        <div
          ref={stayRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-64"
        >
          <div className="flex flex-col items-start">
            <div className="relative mb-8">
              <h3 className="text-7xl md:text-8xl lg:text-9xl font-light text-white/95 leading-none tracking-tight">
                {t('motto.stay.title')}
              </h3>
            </div>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-400 max-w-2xl leading-relaxed font-light">
              {t('motto.stay.description')}
            </p>
            {/* Minimal accent line */}
            <div className="w-16 h-px bg-primary/60 mt-6" />
          </div>
          {/* Hotel Image with curved design */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
            <div className="relative overflow-hidden rounded-3xl border border-primary/10">
              <img
                src="/hotels.png"
                alt="Hotels"
                className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          </div>
        </div>

        {/* Travel Section - Right */}
        <div
          ref={travelRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-64"
        >
          {/* Flight Image with curved design - Left side */}
          <div className="relative group order-2 lg:order-1">
            <div className="absolute -inset-1 bg-gradient-to-l from-primary/20 to-primary/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
            <div className="relative overflow-hidden rounded-3xl border border-primary/10">
              <img
                src="/flights.png"
                alt="Flights"
                className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          </div>
          {/* Text - Right side */}
          <div className="flex flex-col items-start lg:items-end order-1 lg:order-2">
            <div className="relative mb-8">
              <h3 className="text-7xl md:text-8xl lg:text-9xl font-light text-white/95 leading-none tracking-tight">
                {t('motto.travel.title')}
              </h3>
            </div>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-400 max-w-2xl leading-relaxed lg:text-right font-light">
              {t('motto.travel.description')}
            </p>
            {/* Minimal accent line */}
            <div className="w-16 h-px bg-primary/60 mt-6" />
          </div>
        </div>

        {/* Explore Section - Left */}
        <div
          ref={exploreRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32"
        >
          <div className="flex flex-col items-start">
            <div className="relative mb-8">
              <h3 className="text-7xl md:text-8xl lg:text-9xl font-light text-white/95 leading-none tracking-tight">
                {t('motto.explore.title')}
              </h3>
            </div>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-400 max-w-2xl leading-relaxed font-light">
              {t('motto.explore.description')}
            </p>
            {/* Minimal accent line */}
            <div className="w-16 h-px bg-primary/60 mt-6" />
          </div>
          {/* Tours Image with curved design */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
            <div className="relative overflow-hidden rounded-3xl border border-primary/10">
              <img
                src="/tours.png"
                alt="Tours"
                className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
};

export default Motto;
