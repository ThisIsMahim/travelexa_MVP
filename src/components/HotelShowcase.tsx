import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const HotelShowcase = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 100,
        duration: 1,
        ease: 'power3.out',
      });

      // Horizontal scroll animation
      if (scrollRef.current) {
        const cards = scrollRef.current.querySelectorAll('.hotel-card');
        gsap.from(cards, {
          scrollTrigger: {
            trigger: scrollRef.current,
            start: 'top 70%',
          },
          opacity: 0,
          scale: 0.9,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const hotels = [
    {
      name: 'Grand Plaza Hotel',
      location: 'Dubai, UAE',
      rating: 4.8,
      price: '$180',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    },
    {
      name: 'Ocean View Resort',
      location: 'Maldives',
      rating: 4.9,
      price: '$320',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    },
    {
      name: 'City Lights Suites',
      location: 'Singapore',
      rating: 4.7,
      price: '$220',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Discover <span className="text-gradient">Hotels</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Handpicked stays for your perfect getaway
          </p>
        </div>

        <div
          ref={scrollRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {hotels.map((hotel, index) => (
            <Card
              key={index}
              className="hotel-card glass-card overflow-hidden group cursor-pointer hover-lift hover:border-primary/50 smooth-transition"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover smooth-transition group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold mb-1">{hotel.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{hotel.location}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span className="font-semibold">{hotel.rating}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{hotel.price}</p>
                    <p className="text-xs text-muted-foreground">per night</p>
                  </div>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold group-hover:scale-105 smooth-transition glow-effect">
                  Book Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotelShowcase;
