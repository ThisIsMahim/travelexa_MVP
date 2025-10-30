import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Loader from '@/components/Loader';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const { t } = useLanguage();
  const heroRef = useRef(null);
  const orbRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const videoContainerRef = useRef(null);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  const videos = [
    {
      webm: '/videos/travel-bg-1-optimized.webm',
      mp4: '/videos/travel-bg-1-optimized.mp4',
    },
    {
      webm: '/videos/travel-bg-2-optimized.webm',
      mp4: '/videos/travel-bg-2-optimized.mp4',
    },
    {
      webm: '/videos/travel-bg-3-optimized.webm',
      mp4: '/videos/travel-bg-3-optimized.mp4',
    },
    {
      webm: '/videos/travel-bg-4-optimized.webm',
      mp4: '/videos/travel-bg-4-optimized.mp4',
    },
  ];

  // Rotate videos every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [videos.length]);

  // Handle video loading
  useEffect(() => {
    if (loadedVideos >= videos.length) {
      const timeout = setTimeout(() => setAllLoaded(true), 500);
      return () => clearTimeout(timeout);
    }
  }, [loadedVideos, videos.length]);

  // GSAP animations (after everything is loaded)
  useEffect(() => {
    if (!allLoaded) return;

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        const isBengali = t('hero.titleLine1').match(/[\u0980-\u09FF]/);
        const lines = titleRef.current.querySelectorAll('div');

        lines.forEach((line) => {
          const text = line.textContent || '';
          let elements;
          if (isBengali) {
            elements = text.split(/\s+/);
            line.innerHTML = elements
              .map((word) => `<span class="inline-block opacity-0 mr-2">${word}</span>`)
              .join('');
          } else {
            const chars = text.split('');
            line.innerHTML = chars
              .map(
                (char) =>
                  `<span class="inline-block opacity-0">${char === ' ' ? '&nbsp;' : char
                  }</span>`
              )
              .join('');
          }
        });

        gsap.to(titleRef.current.querySelectorAll('span'), {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: isBengali ? 0.1 : 0.03,
          ease: 'power3.out',
          delay: 0.3,
        });
      }

      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 1,
        ease: 'power3.out',
      });

      gsap.to(orbRef.current, {
        y: 30,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

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
  }, [allLoaded, t]);

  return (
    <>
      {!allLoaded && (
        <Loader
          progress={loadedVideos}
          total={videos.length}
          onLoaded={() => setAllLoaded(true)}
        />
      )}

      <section
        ref={heroRef}
        className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-black transition-opacity duration-1000 ${allLoaded ? 'opacity-100' : 'opacity-0'
          }`}
      >
        {/* --- Background Videos --- */}
        <div ref={videoContainerRef} className="absolute inset-0 z-0 overflow-hidden">
          {videos.map((video, index) => (
            <video
              key={index}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onLoadedData={() =>
                setLoadedVideos((count) => Math.min(count + 1, videos.length))
              }
              className={`absolute w-full h-full object-cover transition-opacity duration-[2500ms] ease-in-out ${index === currentVideoIndex ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <source src={video.webm} type="video/webm" />
              <source src={video.mp4} type="video/mp4" />
            </video>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70"></div>
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
            }}
          ></div>
        </div>

        {/* --- Floating Glow Orb --- */}
        <div
          ref={orbRef}
          className="absolute w-[600px] h-[600px] rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at center, rgba(59, 130, 246, 0.4), transparent 70%)',
          }}
        />

        {/* --- Hero Content --- */}
        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
          <h1
            ref={titleRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 leading-tight text-white drop-shadow-lg max-w-full md:max-w-3xl mx-auto px-2"
          >
            <div>{t('hero.titleLine1')}</div>
            <div>{t('hero.titleLine2')}</div>
          </h1>
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto drop-shadow-md"
          >
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground glow-effect hover:scale-105 smooth-transition font-bold"
              onClick={() =>
                document.getElementById('flights')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              {t('hero.cta')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/30 hover:bg-primary/10 hover:border-primary hover:text-primary hover:scale-105 smooth-transition font-semibold"
              onClick={() =>
                document.getElementById('hotels')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              {t('hotel.title')}
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-sm text-muted-foreground">Scroll</span>
            <ChevronDown className="w-5 h-5 text-primary" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
