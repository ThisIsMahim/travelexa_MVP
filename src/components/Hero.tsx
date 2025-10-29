import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title split reveal animation
      if (titleRef.current) {
        const chars = titleRef.current.textContent?.split('') || [];
        titleRef.current.innerHTML = chars
          .map((char) => `<span class="inline-block opacity-0">${char === ' ' ? '&nbsp;' : char}</span>`)
          .join('');
        
        gsap.to(titleRef.current.children, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: 'power3.out',
          delay: 0.3,
        });
      }

      // Subtitle fade in
      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 1,
        ease: 'power3.out',
      });

      // Orb floating animation
      gsap.to(orbRef.current, {
        y: 30,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Parallax scroll effect
      gsap.to(orbRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: 200,
        scale: 0.8,
        opacity: 0.3,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated gradient orb */}
      <div
        ref={orbRef}
        className="absolute w-[500px] h-[500px] rounded-full opacity-40 blur-3xl"
        style={{
          background: 'var(--gradient-glow)',
        }}
      />

      {/* Hero content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
        >
          Travel with Trust
        </h1>
        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto"
        >
          Explore the world with ease. Book flights and hotels reliably with Travelexa.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground glow-effect hover:scale-105 smooth-transition font-bold"
            onClick={() => document.getElementById('flights')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Book a Flight
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-primary/30 hover:bg-primary/10 hover:border-primary hover:scale-105 smooth-transition font-semibold"
            onClick={() => document.getElementById('hotels')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Hotels
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-sm text-muted-foreground">Scroll</span>
        <ChevronDown className="w-5 h-5 text-primary" />
      </div>
    </section>
  );
};

export default Hero;
