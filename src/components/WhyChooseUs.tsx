import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Clock, Globe, Headphones } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const WhyChooseUs = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.feature-card');
        gsap.from(cards, {
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 70%',
          },
          opacity: 0,
          y: 60,
          stagger: 0.2,
          duration: 0.8,
          ease: 'power3.out',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Shield,
      title: 'Trusted & Reliable',
      description: 'Your safety and satisfaction are our top priorities',
    },
    {
      icon: Clock,
      title: 'Quick Booking',
      description: 'Book flights and hotels in minutes, not hours',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Access destinations worldwide with ease',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Our team is always here to help you',
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Why Choose <span className="text-gradient">Travelexa</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Travel with trust, explore with ease
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="feature-card glass-card p-8 text-center group hover:border-primary/50 smooth-transition hover-lift cursor-pointer"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 smooth-transition animate-pulse-glow">
                  <Icon className="w-8 h-8 text-primary group-hover:scale-110 smooth-transition" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
