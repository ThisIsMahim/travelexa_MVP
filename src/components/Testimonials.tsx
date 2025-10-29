import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { Card } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useInViewAnimation<HTMLElement>();
  const { ref: cardsRef, isVisible: cardsVisible } = useInViewAnimation<HTMLDivElement>();

  const testimonials = [
    {
      name: 'Ahmed Hassan',
      location: 'Dhaka, Bangladesh',
      rating: 5,
      text: 'Travelexa made my Dubai trip seamless! The booking process was incredibly easy and customer support was available 24/7.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    },
    {
      name: 'Sarah Rahman',
      location: 'Chittagong, Bangladesh',
      rating: 5,
      text: 'Best travel agency I have ever used. Hotels were exactly as described and flight bookings were handled professionally.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    },
    {
      name: 'Karim Uddin',
      location: 'Sylhet, Bangladesh',
      rating: 5,
      text: 'Highly recommend Travelexa for anyone planning international travel. Trustworthy, reliable, and affordable!',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className={`py-24 px-6 relative overflow-hidden transition-all duration-700 ease-out ${
        sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl" 
          style={{ background: 'var(--gradient-ambient)' }} 
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            What Our <span className="text-gradient">Travelers Say</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Real experiences from real travelers
          </p>
        </div>

        <div
          ref={cardsRef}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ease-out ${
            cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              style={{ transitionDelay: `${index * 120}ms` }}
              className={`testimonial-card glass-card p-8 hover:border-primary/50 smooth-transition hover-lift cursor-pointer group transition-all duration-700 ${
                cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <Quote className="w-10 h-10 text-primary/30 mb-4 group-hover:text-primary/50 smooth-transition" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                ))}
              </div>

              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary/50 smooth-transition"
                />
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
