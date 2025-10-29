import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plane, Calendar, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FlightBooking = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section reveal
      gsap.from(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1,
        },
        opacity: 0,
        y: 100,
      });

      // Staggered card animations
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.flight-card');
        gsap.from(cards, {
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 70%',
          },
          opacity: 0,
          x: -100,
          stagger: 0.2,
          duration: 0.8,
          ease: 'power3.out',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const sampleFlights = [
    { from: 'Dhaka', to: 'Dubai', price: '$450', duration: '5h 30m' },
    { from: 'Dhaka', to: 'Singapore', price: '$520', duration: '4h 15m' },
    { from: 'Dhaka', to: 'Bangkok', price: '$280', duration: '2h 45m' },
  ];

  return (
    <section ref={sectionRef} className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Book Your <span className="text-gradient">Flight</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Fast, reliable, and hassle-free flight bookings
          </p>
        </div>

        {/* Search Form */}
        <Card className="glass-card p-6 md:p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 bg-secondary/50 rounded-lg px-4 py-3">
              <Plane className="w-5 h-5 text-primary" />
              <Input
                placeholder="From"
                className="border-0 bg-transparent focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center gap-3 bg-secondary/50 rounded-lg px-4 py-3">
              <Plane className="w-5 h-5 text-primary rotate-90" />
              <Input
                placeholder="To"
                className="border-0 bg-transparent focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center gap-3 bg-secondary/50 rounded-lg px-4 py-3">
              <Calendar className="w-5 h-5 text-primary" />
              <Input
                type="date"
                className="border-0 bg-transparent focus-visible:ring-0"
              />
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold glow-effect hover:scale-105 smooth-transition">
              Search Flights
            </Button>
          </div>
        </Card>

        {/* Flight Results */}
        <div ref={cardsRef} className="space-y-4">
          {sampleFlights.map((flight, index) => (
            <Card
              key={index}
              className="flight-card glass-card p-6 hover:border-primary/50 smooth-transition cursor-pointer hover-lift group"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-2xl font-bold">{flight.from}</span>
                    <Plane className="w-5 h-5 text-primary" />
                    <span className="text-2xl font-bold">{flight.to}</span>
                  </div>
                  <p className="text-muted-foreground">Duration: {flight.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 smooth-transition">{flight.price}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-primary/30 hover:bg-primary hover:text-primary-foreground font-semibold smooth-transition"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlightBooking;
