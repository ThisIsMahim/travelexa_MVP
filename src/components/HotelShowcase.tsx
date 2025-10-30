import { useState } from 'react';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, PhoneCall, CheckCircle2, Building2, CalendarCheck, Calendar as CalendarIcon, Users, Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from 'react-day-picker';

type HotelInfo = {
  name: string;
  location: string;
  rating: number;
  price: string;
  availableRooms: number;
  weeklyBookings: number;
  image: string;
};

const hotels: HotelInfo[] = [
  {
    name: 'Dhaka Regency Hotel & Resort',
    location: 'Dhaka, Bangladesh',
    rating: 4.6,
    price: '৳9,800',
    availableRooms: 18,
    weeklyBookings: 42,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2xQej2kiEgjXRVYfSnVwuaZexOalgvjiNSr5jqwXuAKsNza56JF6Tu98cdZVBClmHZ1I&usqp=CAU',
  },
  {
    name: 'Royal Tulip Sea Pearl Beach Resort',
    location: "Cox's Bazar, Bangladesh",
    rating: 4.8,
    price: '৳14,500',
    availableRooms: 12,
    weeklyBookings: 56,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxLzaayjgRqzM_5xLd7N6EuyDM1qhsQgQ3EQ&s',
  },
  {
    name: 'The Palace Luxury Resort',
    location: 'Habiganj, Sylhet, Bangladesh',
    rating: 4.7,
    price: '৳12,200',
    availableRooms: 9,
    weeklyBookings: 34,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ40DnGSiBFM4TqQx39q-m8qjqQFYpyiwtLcw&s',
  },
  {
    name: 'Grand Sultan Tea Resort & Golf',
    location: 'Sreemangal, Bangladesh',
    rating: 4.9,
    price: '৳11,400',
    availableRooms: 6,
    weeklyBookings: 27,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZlRUVMhhZWsX6pp4cTzmgITnI6z6YlRvJ6A&s',
  },
];

const HotelShowcase = () => {
  const { t } = useLanguage();
  const { ref: sectionRef, isVisible: sectionVisible } = useInViewAnimation<HTMLElement>();
  const { ref: cardsRef, isVisible: cardsVisible } = useInViewAnimation<HTMLDivElement>();
  const [selectedHotel, setSelectedHotel] = useState<HotelInfo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [destination, setDestination] = useState('Dhaka');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 2)),
  });
  const [guests, setGuests] = useState('2 adults · 1 room');

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
            {t('hotel.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('hotel.subtitle')}
          </p>
        </div>

        <Card className="glass-card border border-primary/15 shadow-lg backdrop-blur mb-16">
          <div className="grid gap-4 p-6 md:grid-cols-[1.2fr,repeat(3,1fr),auto] md:items-center">
            <div className="group rounded-xl border border-primary/10 bg-background/80 px-5 py-4 transition hover:border-primary/40">
              <label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
                {t('hero.searchPlaceholder')}
              </label>
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-primary" />
                <Input
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  placeholder="Dhaka, Bangladesh"
                  className="border-0 bg-transparent px-0 text-base font-semibold text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                />
              </div>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    'group rounded-xl border border-primary/10 bg-background/80 px-5 py-4 text-left transition hover:border-primary/40',
                  )}
                >
                  <label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
                    {t('hero.checkIn')}
                  </label>
                  <div className="flex items-center gap-3 text-base font-semibold text-foreground">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <span>
                      {dateRange?.from ? format(dateRange.from, 'EEE, dd MMM yyyy') : t('hero.checkIn')}
                    </span>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto border-primary/20 bg-background/95 p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  defaultMonth={dateRange?.from}
                  className="rounded-xl"
                  classNames={{
                    day_selected: 'bg-primary text-primary-foreground hover:bg-primary',
                    day_range_middle: 'aria-selected:bg-primary/20 aria-selected:text-foreground',
                  }}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    'group rounded-xl border border-primary/10 bg-background/80 px-5 py-4 text-left transition hover:border-primary/40',
                  )}
                >
                  <label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
                    {t('hero.checkOut')}
                  </label>
                  <div className="flex items-center gap-3 text-base font-semibold text-foreground">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <span>
                      {dateRange?.to ? format(dateRange.to, 'EEE, dd MMM yyyy') : t('hero.checkOut')}
                    </span>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto border-primary/20 bg-background/95 p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  defaultMonth={dateRange?.from}
                  className="rounded-xl"
                  classNames={{
                    day_selected: 'bg-primary text-primary-foreground hover:bg-primary',
                    day_range_middle: 'aria-selected:bg-primary/20 aria-selected:text-foreground',
                  }}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    'group rounded-xl border border-primary/10 bg-background/80 px-5 py-4 text-left transition hover:border-primary/40',
                  )}
                >
                  <label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
                    {t('hero.guestsRooms')}
                  </label>
                  <div className="flex items-center gap-3 text-base font-semibold text-foreground">
                    <Users className="h-5 w-5 text-primary" />
                    <span>{guests}</span>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 border-primary/20 bg-background/95" align="start">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Adults</label>
                    <Select defaultValue="2" onValueChange={(value) => setGuests(`${value} adults · 1 room`)}>
                      <SelectTrigger>
                        <SelectValue placeholder="2 adults" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 adult</SelectItem>
                        <SelectItem value="2">2 adults</SelectItem>
                        <SelectItem value="3">3 adults</SelectItem>
                        <SelectItem value="4">4 adults</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Rooms</label>
                    <Select defaultValue="1" onValueChange={(value) => setGuests(`2 adults · ${value} room${value === '1' ? '' : 's'}`)}>
                      <SelectTrigger>
                        <SelectValue placeholder="1 room" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 room</SelectItem>
                        <SelectItem value="2">2 rooms</SelectItem>
                        <SelectItem value="3">3 rooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">
                    TravelExa teams across Bangladesh provide instant Bengali support for every booking.
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button size="lg" className="h-full rounded-xl bg-primary px-10 py-4 text-lg font-semibold text-primary-foreground shadow-primary/20 transition hover:bg-primary/90 hover:shadow-lg">
              {t('hero.searchButton')}
            </Button>
          </div>
        </Card>

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
                    <p className="text-xs text-muted-foreground">{t('hotel.pricePerNight')}</p>
                  </div>
                </div>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold group-hover:scale-105 smooth-transition glow-effect"
                  onClick={() => {
                    setSelectedHotel(hotel);
                    setIsDialogOpen(true);
                  }}
                >
                  {t('hotel.bookNow')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="m-0 h-[100dvh] w-[100dvw] max-w-[100dvw] rounded-none border-0 bg-background/95 p-0 shadow-none">
          {selectedHotel && (
            <div className="flex h-full min-h-0 flex-col">
              <ScrollArea type="auto" className="flex-1 min-h-0 bg-gradient-to-b from-primary/5 via-background to-background">
                <div className="px-6 py-10 sm:px-16 sm:py-14">
                  <div className="mx-auto w-full max-w-4xl space-y-8">
                    <DialogHeader className="space-y-3 text-left">
                      <DialogTitle className="flex items-center gap-3 text-3xl font-bold text-primary">
                        <CheckCircle2 className="w-6 h-6" /> {t('hotel.modalTitle')}
                      </DialogTitle>
                      <DialogDescription className="text-base text-muted-foreground">
                        {t('hotel.modalSubtitle')}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6">
                      <div className="flex flex-col gap-5 rounded-2xl border border-primary/20 bg-background/80 p-6 shadow-lg sm:flex-row sm:items-center">
                        <img
                          src={selectedHotel.image}
                          alt={selectedHotel.name}
                          className="h-36 w-full rounded-xl object-cover shadow-md sm:h-40 sm:w-48"
                        />
                        <div className="space-y-3">
                          <p className="text-sm uppercase tracking-wide text-muted-foreground">{t('hotel.modalStay')}</p>
                          <h3 className="text-2xl font-semibold leading-snug text-foreground">{selectedHotel.name}</h3>
                          <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>
                              {t('hotel.modalLocation')}: {selectedHotel.location}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-border/40 bg-background/70 p-5 shadow-sm">
                          <p className="text-sm text-muted-foreground">{t('hotel.modalPrice')}</p>
                          <p className="mt-2 text-2xl font-semibold text-primary">{selectedHotel.price}</p>
                        </div>
                        <div className="rounded-xl border border-border/40 bg-background/70 p-5 shadow-sm">
                          <p className="text-sm text-muted-foreground">{t('hotel.modalRating')}</p>
                          <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-foreground">
                            <Star className="h-5 w-5 text-primary fill-primary" />
                            {selectedHotel.rating}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-primary/20 bg-background/80 p-5 shadow-sm">
                          <p className="text-sm text-muted-foreground">{t('hotel.modalRooms')}</p>
                          <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-foreground">
                            <Building2 className="h-5 w-5 text-primary" />
                            {selectedHotel.availableRooms}
                          </p>
                        </div>
                        <div className="rounded-xl border border-primary/20 bg-background/80 p-5 shadow-sm">
                          <p className="text-sm text-muted-foreground">{t('hotel.modalBookings')}</p>
                          <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-foreground">
                            <CalendarCheck className="h-5 w-5 text-primary" />
                            {selectedHotel.weeklyBookings}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-primary/15 bg-background/80 p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-base font-semibold text-primary">
                          <CheckCircle2 className="h-5 w-5" /> {t('hotel.modalAvailability')}
                        </div>
                        <Separator className="my-4 bg-border/60" />
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-xs font-medium">
                            {t('hotel.amenity.breakfast')}
                          </Badge>
                          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-xs font-medium">
                            {t('hotel.amenity.freeWifi')}
                          </Badge>
                          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-xs font-medium">
                            {t('hotel.amenity.pickup')}
                          </Badge>
                          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-xs font-medium">
                            {t('hotel.amenity.familyRooms')}
                          </Badge>
                          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-xs font-medium">
                            {t('hotel.amenity.support')}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-background/80 p-6 text-sm leading-relaxed text-muted-foreground">
                        <PhoneCall className="h-5 w-5 flex-shrink-0 text-primary" />
                        <p>{t('hotel.modalContact')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="flex flex-col gap-3 border-t border-border/60 bg-background/95 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-16">
                <p className="text-sm text-muted-foreground">
                  {selectedHotel.name}
                </p>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <Button size="lg" className="w-full sm:w-auto" onClick={() => setIsDialogOpen(false)}>
                    {t('hotel.modalPrimary')}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    {t('hotel.modalSecondary')}
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

export default HotelShowcase;
