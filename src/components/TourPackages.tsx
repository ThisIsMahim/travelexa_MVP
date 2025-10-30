import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Calendar, Users, PhoneCall, CheckCircle2, X, Mail, User } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const packages = [
  {
    title: 'Cox’s Bazar Beach Escape',
    location: 'Cox’s Bazar, Bangladesh',
    duration: '4 Days / 3 Nights',
    people: '2-6 People',
    price: '৳48,500',
    image:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUSEhMVFRUVFRUQFRUVGBUVFRUVFRUWFhUVFRUYHSggGBolHRUVITEhJSkrMC4uFx8zODMtNygtLisBCgoKDg0OGhAQGyslHyUtKy0tLSstLS0tLS0tKy0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0tLf/AABEIAKgBLAMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAACAQMEBQYABwj/xABFEAABAwIDBAcFBAgEBgMAAAABAAIRAyEEEjETQVFhBRQiUnGRoQaBscHRMkJTYiNygpKisuHwFXPC8RYkM0OD4gc0Y//EABoBAAMBAQEBAAAAAAAAAAAAAAECAwAEBQb/xAAxEQACAQMDAwIEBgEFAAAAAAAAAQIDERIEIVETMUEUYQUikfAyUnGBodFCIzNiseH/2gAMAwEAAhEDEQA/AKg0gh2SnHCFc7DkBfd5o+F+ZEHZJMim7E8Emx5I5IGTIeRKKYUks5LhTRubMjGlzSbIqTsyuDUbmzZG2ZRCVJDJSmlyQyBmRSEhphS20JRDDcbLZIKkyuNFDsFaPw0aXQCgeCKmNnJFbsUmzVq3CkrjgTwW6iGU5cFSWpMqsn4Nw3FN9WTKaN1LdyDlSQppohCaSOQeoiJCXKpBpJNmtcOaGMqXKnsiXItc2YxkShifyFKKRWuBzGciUNUgUU42ilyEdREZrE42ieCe00XElC4ubYIpo2wEgCUBARskU8TGjQudXcd8eCGjTB1MKZTpQpSxRSKnJd9iHkJRCgVYtHgnmNSOqysdMn5KxuEK3HsXQy0HA/ik/wADFRUmjetX7MxsnR3z/K1efrqrdOx6Wh08YVLmH6sd6NuHU9tNPMpqjqsRUUVfVuSA4U8FdBiNlIFDrtDenTM5XwTjEBNig4blqerhA7BgplqfDJy0SvdGcpUjwRtwjZuFfjABN1MEj6hMPpbLcpamHg2SZeStK2BJ3eSGngbHimVVW7iOg77IgCOC7VSX4QhN7LkU2SYHFruA2gNyQ4S8qTTYpGzSubQypJrsQW0EjWclOFFEKSGY3SIUckxiaOexEeAVqWTuSsw/JBVLbmdHLYoP8LO4+iZf0e4aXWnypp4VFqJEpaOFjMuwru6ULsK7gfIrTbKUWw4jzTeqE9F7mUdhzwPklbhXHcVq3UhwCU4edy3q/YPonyZfqju6uGGd3StPsEowsoeqN6H3Mv1d3A+SE0jwK1www4Iupjgt6v2N6B+GY8USdAuNEjcta/o8cFHqYJMtUmK9DJeTM5UTKRKv3YTkhbg7zCb1CJ+jlfuQ8LhwNynbPlCNrY3Io4KEpNu52QpqKsNikEoaERYdbI2jiEtx0gNmtR7Lt/RO/XP8rVnmuG8LS+zZGzdHfP8AK1cmrb6Z1aVLMoWtTgaiASws2FI4NRtCFECgEcARtaEDUYCVjoMU0uySNTrZSXGsNHDpNgn0TVsmbFEKphAmXYKdytYSEBFVGgOmmU7sFG5AcMRuVyWSkFFMqzFdFFRsUrcOrfYITQR6xukV7KARbFTNlCNtFK6gVTIYoJt+EVkGJTRQ6gemiq2EJdmrB1Apo0CmzuLhYgupJRSUzYIm00cwYEMUOScFBS8iVtMpXMZQI7aKNtFT6NC2qdcN0KTqlFTIDcPO5A/BEblPDTw9UbQUOow4JlT1PkhdhVdBgXGkEeswdJGdfhUIw3JXdTDpl9FVVYm6RUOock3sDzVo+kmnNVFUJumiCAtB7Pf9N1vvn+VqqTTB3K96EZDD+sfg1R1MvkK0I/OYrrqJuPUHO1JZej048Hm9SXJZtxycbi1T5QjCDpRGVaRdMxKebiFRtqFPMrqbpFY1i7bXTzKqpWYlOtxKk6RVVS6bURioqcYpONxam6TKKqi3D0sqsbiwjGMCR02OqiL...[7244 bytes truncated]',
    badge: 'Popular',
    features: ['Luxury Resort Stay', 'Inani Beach Sunset', 'Seafood Dinner Cruise'],
    highlights: ['Private beach bonfire & live music', 'Sunrise tour to Himchari hilltop', 'Dedicated Bengali-speaking guide'],
    inclusions: ['3-night premium resort stay with breakfast', 'AC transport from Dhaka to Cox’s Bazar and back', 'Full-time local concierge support'],
  },
  {
    title: 'Sylhet Tea Valley Retreat',
    location: 'Sylhet, Bangladesh',
    duration: '5 Days / 4 Nights',
    people: '2-5 People',
    price: '৳42,000',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRun_6P1jzZ6JjMU3_q5QLbtlLQkflTR32Mdw&s',
    badge: 'Luxury',
    features: ['Tea Garden Tour', 'Ratargul Swamp Forest', 'Traditional Sylheti Cuisine'],
    highlights: ['Sunrise photography at Lakkatura tea estate', 'Private boat ride through Lalakhal', 'Live folk music night with local artists'],
    inclusions: ['Boutique eco-resort stay with meals', 'Private vehicle & driver from Dhaka', 'Licensed tour coordinator & guide'],
  },
  {
    title: 'Sundarbans Wildlife Adventure',
    location: 'Mongla & Sundarbans, Bangladesh',
    duration: '3 Days / 2 Nights',
    people: '4-10 People',
    price: '৳36,500',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2t-uY2iB6yJU0LJzeESTEOqAkzDivP13YtQ&s',
    badge: 'Best Value',
    features: ['Guided Forest Safari', 'Boat Cruise', 'Local Cultural Evening'],
    highlights: ['Early-morning tiger tracking expedition', 'Visit to Karamjal wildlife centre', 'Traditional Bonbibi cultural performance'],
    inclusions: ['Overnight deluxe launch accommodation', 'Forest permits & armed forest guard escort', 'Freshly cooked Bengali meals onboard'],
  },
];

const TourPackages = () => {
  const { t } = useLanguage();
  const { ref: sectionRef, isVisible: sectionVisible } = useInViewAnimation<HTMLElement>();
  const { ref: cardsRef, isVisible: cardsVisible } = useInViewAnimation<HTMLDivElement>();
  const navigate = useNavigate();

  const [selectedPackage, setSelectedPackage] = useState<(typeof packages)[number] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [travelers, setTravelers] = useState('2');
  const { toast } = useToast();

  const handleConfirmBooking = () => {
    if (!fullName || !email || !phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "🎒 Tour Package Booked Successfully!",
      description: "Your tour package has been confirmed. You will be contacted shortly with itinerary details.",
    });

    setIsDialogOpen(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setTravelers('2');
  };

  const packages = [
    {
      title: 'Cox’s Bazar Beach Escape',
      location: 'Cox’s Bazar, Bangladesh',
      duration: '4 Days / 3 Nights',
      people: '2-6 People',
      price: '৳48,500',
      image: 'data:image/jpeg;base64,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',
      badge: 'Popular',
      features: ['Luxury Resort Stay', 'Inani Beach Sunset', 'Seafood Dinner Cruise'],
      highlights: ['Private beach bonfire & live music', 'Sunrise tour to Himchari hilltop', 'Dedicated Bengali-speaking guide'],
      inclusions: ['3-night premium resort stay with breakfast', 'AC transport from Dhaka to Cox’s Bazar and back', 'Full-time local concierge support'],
    },
    {
      title: 'Sylhet Tea Valley Retreat',
      location: 'Sylhet, Bangladesh',
      duration: '5 Days / 4 Nights',
      people: '2-5 People',
      price: '৳42,000',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRun_6P1jzZ6JjMU3_q5QLbtlLQkflTR32Mdw&s',
      badge: 'Luxury',
      features: ['Tea Garden Tour', 'Ratargul Swamp Forest', 'Traditional Sylheti Cuisine'],
      highlights: ['Sunrise photography at Lakkatura tea estate', 'Private boat ride through Lalakhal', 'Live folk music night with local artists'],
      inclusions: ['Boutique eco-resort stay with meals', 'Private vehicle & driver from Dhaka', 'Licensed tour coordinator & guide'],
    },
    {
      title: 'Sundarbans Wildlife Adventure',
      location: 'Mongla & Sundarbans, Bangladesh',
      duration: '3 Days / 2 Nights',
      people: '4-10 People',
      price: '৳36,500',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2t-uY2iB6yJU0LJzeESTEOqAkzDivP13YtQ&s',
      badge: 'Best Value',
      features: ['Guided Forest Safari', 'Boat Cruise', 'Local Cultural Evening'],
      highlights: ['Early-morning tiger tracking expedition', 'Visit to Karamjal wildlife centre', 'Traditional Bonbibi cultural performance'],
      inclusions: ['Overnight deluxe launch accommodation', 'Forest permits & armed forest guard escort', 'Freshly cooked Bengali meals onboard'],
    },
  ];

  const displayedPackages = packages.slice(0, 3);
  const hasMorePackages = packages.length > displayedPackages.length;

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
            {t('tour.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('tour.subtitle')}
          </p>
        </div>

        <div
          ref={cardsRef}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ease-out ${
            cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {displayedPackages.map((pkg, index) => (
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
                    <span className="text-muted-foreground">{t('tour.duration')}: {pkg.duration}</span>
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
                    <p className="text-sm text-muted-foreground">{t('tour.price')}</p>
                    <p className="text-3xl font-bold text-primary">{pkg.price}</p>
                  </div>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold group-hover:scale-105 smooth-transition"
                    onClick={() => {
                      setSelectedPackage(pkg);
                      setIsDialogOpen(true);
                    }}
                  >
                    {t('tour.viewPackage')}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {hasMorePackages && (
          <div className="mt-10 text-center">
            <Button
              variant="outline"
              className="border-primary/40 hover:bg-primary hover:text-primary-foreground font-semibold smooth-transition"
              onClick={() => navigate('/tours')}
            >
              {t('tour.showAll')}
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent hideClose className="m-0 h-[100dvh] w-[100dvw] max-w-[100dvw] rounded-none border-0 bg-background/98 backdrop-blur-xl p-0 shadow-2xl">
          {selectedPackage && (
            <div className="flex h-full min-h-0 flex-col relative">
              {/* Custom Close Button */}
              <button
                onClick={() => setIsDialogOpen(false)}
                className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50 group"
                aria-label="Close dialog"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-300 group-hover:scale-150" />
                  <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-background border-2 border-primary/30 shadow-lg group-hover:border-primary group-hover:shadow-primary/50 group-hover:scale-110 group-active:scale-95 transition-all duration-300 ease-out">
                    <X className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground group-hover:text-primary group-hover:rotate-90 transition-all duration-300" />
                  </div>
                </div>
              </button>

              <ScrollArea type="auto" className="flex-1 min-h-0 bg-gradient-to-b from-primary/5 via-background to-background">
                <div className="px-6 py-10 sm:px-16 sm:py-14 pt-20">
                  <div className="mx-auto w-full max-w-4xl space-y-8">
                    <DialogHeader className="space-y-3 text-left">
                      <DialogTitle className="flex items-center gap-3 text-3xl sm:text-4xl font-bold text-primary animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-primary animate-pulse" /> {t('tour.modalTitle')}
                      </DialogTitle>
                      <DialogDescription className="text-base sm:text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                        {t('tour.modalSubtitle')}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6">
                      <div className="flex flex-col gap-5 rounded-2xl border border-primary/20 bg-background/80 p-6 shadow-lg sm:flex-row sm:items-center">
                        <img
                          src={selectedPackage.image}
                          alt={selectedPackage.title}
                          className="h-36 w-full rounded-xl object-cover shadow-md sm:h-40 sm:w-48"
                        />
                        <div className="space-y-3">
                          <Badge className="w-fit bg-primary/10 text-primary">
                            {selectedPackage.badge}
                          </Badge>
                          <h3 className="text-2xl font-semibold leading-snug text-foreground">
                            {selectedPackage.title}
                          </h3>
                          <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>
                              {t('tour.modalLocation')}: {selectedPackage.location}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border border-border/40 bg-background/70 p-5 shadow-sm">
                          <p className="text-sm text-muted-foreground">{t('tour.modalDuration')}</p>
                          <p className="mt-2 text-xl font-semibold text-primary">{selectedPackage.duration}</p>
                        </div>
                        <div className="rounded-xl border border-border/40 bg-background/70 p-5 shadow-sm">
                          <p className="text-sm text-muted-foreground">{t('tour.modalGroupSize')}</p>
                          <p className="mt-2 text-xl font-semibold text-primary">{selectedPackage.people}</p>
                        </div>
                        <div className="rounded-xl border border-border/40 bg-background/70 p-5 shadow-sm">
                          <p className="text-sm text-muted-foreground">{t('tour.modalPrice')}</p>
                          <p className="mt-2 text-xl font-semibold text-primary">{selectedPackage.price}</p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-primary/15 bg-background/80 p-6 shadow-sm">
                        <h4 className="text-lg font-semibold text-primary">{t('tour.modalHighlights')}</h4>
                        <Separator className="my-4 bg-border/60" />
                        <ul className="space-y-3">
                          {selectedPackage.highlights.map((highlight, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-primary/15 bg-background/80 p-6 shadow-sm">
                        <h4 className="text-lg font-semibold text-primary">{t('tour.modalIncludes')}</h4>
                        <Separator className="my-4 bg-border/60" />
                        <ul className="space-y-3">
                          {selectedPackage.inclusions.map((includeItem, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                              <span>{includeItem}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Separator className="my-6" />

                      {/* Booking Form */}
                      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-background p-6 shadow-lg">
                        <h4 className="text-xl font-semibold text-primary mb-6 flex items-center gap-2">
                          <User className="w-5 h-5" /> Traveler Details
                        </h4>
                        <div className="grid gap-5">
                          <div className="grid gap-2">
                            <Label htmlFor="tourFullName" className="text-sm font-medium">Full Name *</Label>
                            <Input
                              id="tourFullName"
                              placeholder="Enter your full name"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="bg-background"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="tourEmail" className="text-sm font-medium">Email Address *</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="tourEmail"
                                type="email"
                                placeholder="your.email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-background pl-10"
                              />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="tourPhone" className="text-sm font-medium">Phone Number *</Label>
                            <Input
                              id="tourPhone"
                              type="tel"
                              placeholder="+880 1XXX-XXXXXX"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="bg-background"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="travelers" className="text-sm font-medium">Number of Travelers</Label>
                            <Input
                              id="travelers"
                              type="number"
                              min="1"
                              max="10"
                              value={travelers}
                              onChange={(e) => setTravelers(e.target.value)}
                              className="bg-background"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-background/80 p-6 text-sm leading-relaxed text-muted-foreground">
                        <PhoneCall className="h-5 w-5 flex-shrink-0 text-primary" />
                        <p>{t('tour.modalContact')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="flex flex-col gap-3 border-t border-border/60 bg-background/95 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-16">
                <p className="text-sm text-muted-foreground">{selectedPackage.title}</p>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <Button size="lg" className="w-full sm:w-auto" onClick={handleConfirmBooking}>
                    {t('tour.modalPrimary')}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    {t('tour.modalSecondary')}
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default TourPackages;
