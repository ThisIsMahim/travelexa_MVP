import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plane, Calendar, Users } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const FlightBooking = () => {
  const { t } = useLanguage();
  const { ref: sectionRef, isVisible: sectionVisible } = useInViewAnimation<HTMLElement>();
  const { ref: cardsRef, isVisible: cardsVisible } = useInViewAnimation<HTMLDivElement>();

  const sampleFlights = [
    { from: 'Dhaka', to: 'Dubai', price: '$450', duration: '5h 30m' },
    { from: 'Dhaka', to: 'Singapore', price: '$520', duration: '4h 15m' },
    { from: 'Dhaka', to: 'Bangkok', price: '$280', duration: '2h 45m' },
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
            {t('flight.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('flight.search')}
          </p>
        </div>

        {/* Search Form */}
        <Card className="glass-card p-6 md:p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 bg-secondary/50 rounded-lg px-4 py-3">
              <Plane className="w-5 h-5 text-primary" />
              <Input
                placeholder={t('flight.from')}
                className="border-0 bg-transparent focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center gap-3 bg-secondary/50 rounded-lg px-4 py-3">
              <Plane className="w-5 h-5 text-primary rotate-90" />
              <Input
                placeholder={t('flight.to')}
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
              {t('flight.search')}
            </Button>
          </div>
        </Card>

        {/* Flight Results */}
        <div
          ref={cardsRef}
          className={`space-y-4 transition-all duration-700 ease-out ${
            cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {sampleFlights.map((flight, index) => (
            <Card
              key={index}
              style={{ transitionDelay: `${index * 120}ms` }}
              className={`glass-card p-6 hover:border-primary/50 smooth-transition cursor-pointer hover-lift group transition-all duration-700 transform ${
                cardsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-2xl font-bold">{flight.from}</span>
                    <Plane className="w-5 h-5 text-primary" />
                    <span className="text-2xl font-bold">{flight.to}</span>
                  </div>
                  <p className="text-muted-foreground">{t('tour.duration')}: {flight.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 smooth-transition">{flight.price}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-primary/30 hover:bg-primary hover:text-primary-foreground font-semibold smooth-transition"
                  >
                    {t('hotel.bookNow')}
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
