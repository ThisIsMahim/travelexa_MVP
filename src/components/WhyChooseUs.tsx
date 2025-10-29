import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { Shield, Clock, Globe, Headphones } from 'lucide-react';

const WhyChooseUs = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useInViewAnimation<HTMLElement>();
  const { ref: cardsRef, isVisible: cardsVisible } = useInViewAnimation<HTMLDivElement>();

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
    <section
      ref={sectionRef}
      className={`py-24 px-6 relative transition-all duration-700 ease-out ${
        sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Why Choose <span className="text-gradient">Travelexa</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Travel with trust, explore with ease
          </p>
        </div>

        <div
          ref={cardsRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 ease-out ${
            cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                style={{ transitionDelay: `${index * 120}ms` }}
                className={`feature-card glass-card p-8 text-center group hover:border-primary/50 smooth-transition hover-lift cursor-pointer transition-all duration-700 ${
                  cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
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
