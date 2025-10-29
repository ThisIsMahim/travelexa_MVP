import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users } from 'lucide-react';

const TourPackages = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useInViewAnimation<HTMLElement>();
  const { ref: cardsRef, isVisible: cardsVisible } = useInViewAnimation<HTMLDivElement>();

  const packages = [
    {
      title: 'Dubai Explorer',
      location: 'Dubai, UAE',
      duration: '5 Days / 4 Nights',
      people: '2-8 People',
      price: '$1,299',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
      badge: 'Popular',
      features: ['Hotel Stay', 'City Tour', 'Desert Safari'],
    },
    {
      title: 'Maldives Paradise',
      location: 'Maldives',
      duration: '7 Days / 6 Nights',
      people: '2 People',
      price: '$2,499',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
      badge: 'Luxury',
      features: ['Beach Resort', 'Water Sports', 'Spa Treatment'],
    },
    {
      title: 'Bangkok & Pattaya',
      location: 'Thailand',
      duration: '4 Days / 3 Nights',
      people: '2-6 People',
      price: '$899',
      image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80',
      badge: 'Best Value',
      features: ['City Tour', 'Beach Visit', 'Cultural Sites'],
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
            Exclusive <span className="text-gradient">Tour Packages</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Curated experiences for unforgettable journeys
          </p>
        </div>

        <div
          ref={cardsRef}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ease-out ${
            cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {packages.map((pkg, index) => (
            <Card
              key={index}
              style={{ transitionDelay: `${index * 120}ms` }}
              className={`tour-card glass-card overflow-hidden group cursor-pointer hover-lift hover:border-primary/50 smooth-transition transition-all duration-700 ${
                cardsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover smooth-transition group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground font-semibold animate-pulse-glow">
                  {pkg.badge}
                </Badge>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">{pkg.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">{pkg.duration}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">{pkg.people}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="border-primary/30 text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Starting from</p>
                    <p className="text-3xl font-bold text-primary">{pkg.price}</p>
                  </div>
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold group-hover:scale-105 smooth-transition"
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

export default TourPackages;
