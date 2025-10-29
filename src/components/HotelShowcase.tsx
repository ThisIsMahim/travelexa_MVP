import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin } from 'lucide-react';

const HotelShowcase = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useInViewAnimation<HTMLElement>();
  const { ref: cardsRef, isVisible: cardsVisible } = useInViewAnimation<HTMLDivElement>();

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
    <section
      ref={sectionRef}
      className={`py-24 px-6 relative transition-all duration-700 ease-out ${
        sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
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
          ref={cardsRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ease-out ${
            cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {hotels.map((hotel, index) => (
            <Card
              key={index}
              style={{ transitionDelay: `${index * 120}ms` }}
              className={`hotel-card glass-card overflow-hidden group cursor-pointer hover-lift hover:border-primary/50 smooth-transition transition-all duration-700 ${
                cardsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
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
