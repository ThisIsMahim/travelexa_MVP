import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plane, Calendar as CalendarIcon, CheckCircle2, PhoneCall, RotateCcw, X, Mail, User } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type FlightInfo = {
  from: string;
  to: string;
  price: string;
  duration: string;
  airline: string;
  departureTime: string;
  arrivalTime: string;
  flightNumber: string;
  availableSeats: number;
  amenities: string[];
  availableDates: Date[];
  departureDate?: Date;
};

const FlightBooking = () => {
  const { t } = useLanguage();
  const { ref: sectionRef, isVisible: sectionVisible } = useInViewAnimation<HTMLElement>();
  const { ref: cardsRef, isVisible: cardsVisible } = useInViewAnimation<HTMLDivElement>();
  const navigate = useNavigate();

  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchResults, setSearchResults] = useState<FlightInfo[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<FlightInfo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState<Date | undefined>(undefined);
  const [passengers, setPassengers] = useState('1');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const { toast } = useToast();

  const displayedFlights = searchResults.slice(0, 4);
  const hasMoreFlights = searchResults.length > displayedFlights.length;

  // Generate available dates for the next 30 days
  const generateAvailableDates = (daysAhead: number) => {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = 0; i < daysAhead; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      date.setHours(0, 0, 0, 0);
      dates.push(date);
    }
    return dates;
  };

  const allAvailableDates = generateAvailableDates(30);

  const sampleFlights: FlightInfo[] = [
    { 
      from: 'Dhaka', 
      to: 'Dubai', 
      price: '৳32,500', 
      duration: '5h 30m',
      airline: 'Emirates',
      departureTime: '10:30 AM',
      arrivalTime: '4:00 PM (Dubai Time)',
      flightNumber: 'EK-582',
      availableSeats: 24,
      amenities: ['WiFi Available', 'Meals Included', 'Entertainment System', 'USB Charging', 'In-Flight Shopping'],
      availableDates: allAvailableDates
    },
    { 
      from: 'Chittagong', 
      to: 'Dubai', 
      price: '৳34,800', 
      duration: '6h 15m',
      airline: 'Emirates',
      departureTime: '1:20 PM',
      arrivalTime: '7:35 PM (Dubai Time)',
      flightNumber: 'EK-584',
      availableSeats: 16,
      amenities: ['WiFi Available', 'Meals Included', 'Entertainment System', 'USB Charging'],
      availableDates: allAvailableDates.filter((_, i) => i % 2 === 0)
    },
    { 
      from: 'Dhaka', 
      to: 'Singapore', 
      price: '৳37,600', 
      duration: '4h 15m',
      airline: 'Singapore Airlines',
      departureTime: '11:45 PM',
      arrivalTime: '6:00 AM+1 (Singapore Time)',
      flightNumber: 'SQ-446',
      availableSeats: 18,
      amenities: ['WiFi Available', 'Premium Meals', 'Entertainment System', 'Extra Legroom', 'Priority Boarding'],
      availableDates: allAvailableDates
    },
    { 
      from: 'Chittagong', 
      to: 'Bangkok', 
      price: '৳22,400', 
      duration: '2h 30m',
      airline: 'Thai Airways',
      departureTime: '4:40 PM',
      arrivalTime: '7:10 PM (Bangkok Time)',
      flightNumber: 'TG-323',
      availableSeats: 28,
      amenities: ['Meals Included', 'Entertainment System', 'USB Charging'],
      availableDates: allAvailableDates.filter((_, i) => [0, 2, 4, 6].includes(i % 7))
    },
    { 
      from: 'Dhaka', 
      to: 'Bangkok', 
      price: '৳20,200', 
      duration: '2h 45m',
      airline: 'Thai Airways',
      departureTime: '2:15 PM',
      arrivalTime: '4:00 PM (Bangkok Time)',
      flightNumber: 'TG-321',
      availableSeats: 32,
      amenities: ['Snacks Included', 'Entertainment System', 'USB Charging', 'Travel Amenity Kit'],
      availableDates: allAvailableDates.filter((_, i) => i % 2 === 0)
    },
    { 
      from: 'Dhaka', 
      to: 'Kuala Lumpur', 
      price: '৳22,400', 
      duration: '3h 20m',
      airline: 'Malaysia Airlines',
      departureTime: '8:00 AM',
      arrivalTime: '12:20 PM (KL Time)',
      flightNumber: 'MH-196',
      availableSeats: 15,
      amenities: ['WiFi Available', 'Meals Included', 'Entertainment System', 'Lounge Access'],
      availableDates: allAvailableDates
    },
    { 
      from: 'Chittagong', 
      to: 'Kuala Lumpur', 
      price: '৳24,100', 
      duration: '3h 45m',
      airline: 'Malaysia Airlines',
      departureTime: '10:25 AM',
      arrivalTime: '2:10 PM (KL Time)',
      flightNumber: 'MH-198',
      availableSeats: 22,
      amenities: ['WiFi Available', 'Meals Included', 'Entertainment System'],
      availableDates: allAvailableDates.filter((_, i) => i % 3 === 0)
    },
    { 
      from: 'Dhaka', 
      to: 'Dubai', 
      price: '৳34,700', 
      duration: '5h 45m',
      airline: 'flydubai',
      departureTime: '3:45 PM',
      arrivalTime: '9:30 PM (Dubai Time)',
      flightNumber: 'FZ-571',
      availableSeats: 28,
      amenities: ['WiFi Available', 'Meals Included', 'Entertainment System', 'USB Charging'],
      availableDates: allAvailableDates
    },
    { 
      from: 'Dhaka', 
      to: 'Bangkok', 
      price: '৳21,300', 
      duration: '2h 50m',
      airline: 'US-Bangla Airlines',
      departureTime: '9:30 AM',
      arrivalTime: '12:20 PM (Bangkok Time)',
      flightNumber: 'BS-325',
      availableSeats: 20,
      amenities: ['Meals Included', 'Entertainment System', 'USB Charging'],
      availableDates: allAvailableDates.filter((_, i) => [0, 2, 4, 6].includes(i % 7))
    },
    { 
      from: 'Chittagong', 
      to: 'Singapore', 
      price: '৳39,200', 
      duration: '4h 35m',
      airline: 'Singapore Airlines',
      departureTime: '6:50 PM',
      arrivalTime: '11:25 PM (Singapore Time)',
      flightNumber: 'SQ-448',
      availableSeats: 14,
      amenities: ['WiFi Available', 'Premium Meals', 'Entertainment System', 'Priority Boarding'],
      availableDates: allAvailableDates.filter((_, i) => i % 2 === 1)
    },
  ];

  // Get unique destinations from sample flights
  const destinations = Array.from(new Set(sampleFlights.map(f => f.to)));

  // Show all flights initially
  useEffect(() => {
    setSearchResults(sampleFlights);
  }, []);

  const handleSearch = () => {
    let results = sampleFlights;
    
    // Filter by origin city if selected
    if (fromCity) {
      results = results.filter(flight => flight.from === fromCity);
    }
    
    // Filter by destination if selected
    if (toCity) {
      results = results.filter(flight => flight.to === toCity);
    }
    
    // Filter by date if selected
    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      
      results = results.filter(flight => 
        flight.availableDates.some(availableDate => {
          const compareDate = new Date(availableDate);
          compareDate.setHours(0, 0, 0, 0);
          return compareDate.getTime() === selectedDate.getTime();
        })
      );
      
      // Add the departure date to each result for display
      results = results.map(flight => ({
        ...flight,
        departureDate: selectedDate
      }));
    }
    
    setSearchResults(results);
  };

  const handleReset = () => {
    setFromCity('');
    setToCity('');
    setDate(undefined);
    setSearchResults(sampleFlights);
  };

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
      title: "✈️ Flight Booked Successfully!",
      description: "Your flight has been booked. You will be contacted shortly with confirmation details.",
    });

    // Reset form and close dialog
    setIsDialogOpen(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setBookingDate(undefined);
    setPassengers('1');
  };

  const handleOpenDialog = (flight: FlightInfo) => {
    setSelectedFlight(flight);
    setBookingDate(flight.departureDate);
    setIsDialogOpen(true);
  };

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
          <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4">
            <div className="flex items-center  gap-3 bg-secondary/50 rounded-lg px-4 py-3">
              <Plane className="w-5 h-5 text-primary" />
              <Select value={fromCity} onValueChange={setFromCity}>
                <SelectTrigger className="border-0 bg-transparent focus:ring-0">
                  <SelectValue placeholder={t('flight.from')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="Dhaka">Dhaka</SelectItem>
                  <SelectItem value="Chittagong">Chittagong</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 bg-secondary/50 rounded-lg px-4 py-3">
              <Plane className="w-5 h-5 text-primary rotate-90" />
              <Select value={toCity} onValueChange={setToCity}>
                <SelectTrigger className="border-0 bg-transparent focus:ring-0">
                  <SelectValue placeholder={t('flight.to')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Destinations</SelectItem>
                  {destinations.map((destination) => (
                    <SelectItem key={destination} value={destination}>
                      {destination}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    'flex items-center gap-3 bg-secondary/50 rounded-lg px-4 py-3 text-left transition hover:bg-secondary/70',
                  )}
                >
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <span className={cn(
                    "flex-1 text-sm font-medium",
                    !date && "text-muted-foreground font-normal"
                  )}>
                    {date ? format(date, 'PPP') : 'Select date'}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto border-primary/20 bg-background/95 p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="rounded-xl"
                  classNames={{
                    day_selected: 'bg-primary text-primary-foreground hover:bg-primary',
                  }}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
            <Button 
              onClick={handleSearch}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold glow-effect hover:scale-105 smooth-transition"
            >
              {t('flight.search')}
            </Button>
            <Button 
              onClick={handleReset}
              variant="outline"
              className="border-primary/30 hover:bg-primary/10 font-semibold smooth-transition"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </Card>

        {/* Flight Results */}
        {displayedFlights.length > 0 && (
          <div
            ref={cardsRef}
            className={`space-y-4 transition-all duration-700 ease-out ${
              cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {displayedFlights.map((flight, index) => (
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
                    <p className="text-muted-foreground mb-1">{flight.airline} • {flight.flightNumber}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{t('tour.duration')}: {flight.duration}</span>
                      {flight.departureDate && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {format(flight.departureDate, 'MMM dd, yyyy')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 smooth-transition">{flight.price}</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenDialog(flight)}
                      className="border-primary/30 hover:bg-primary hover:text-primary-foreground font-semibold smooth-transition"
                    >
                      {t('hotel.bookNow')}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {hasMoreFlights && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              className="border-primary/40 hover:bg-primary hover:text-primary-foreground font-semibold smooth-transition"
              onClick={() => navigate('/flights')}
            >
              {t('flight.showAll')}
            </Button>
          </div>
        )}

        {searchResults.length === 0 && (
          <div className="text-center py-16">
            <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl font-semibold mb-2">No flights found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search criteria</p>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Search
            </Button>
          </div>
        )}
      </div>

      {/* Booking Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent hideClose className="m-0 h-[100dvh] w-[100dvw] max-w-[100dvw] rounded-none border-0 bg-background/98 backdrop-blur-xl p-0 shadow-2xl">
          {selectedFlight && (
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
                        <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-primary animate-pulse" /> Confirm Your Flight Booking
                      </DialogTitle>
                      <DialogDescription className="text-base sm:text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                        Review your flight details before confirming your booking
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6">
                      <div className="flex flex-col gap-5 rounded-2xl border border-primary/20 bg-background/80 p-6 shadow-lg">
                        <div className="space-y-3">
                          <p className="text-sm uppercase tracking-wide text-muted-foreground">Flight Details</p>
                          <div className="flex items-center gap-4">
                            <h3 className="text-3xl font-bold text-foreground">{selectedFlight.from}</h3>
                            <Plane className="w-6 h-6 text-primary" />
                            <h3 className="text-3xl font-bold text-foreground">{selectedFlight.to}</h3>
                          </div>
                          <p className="text-lg text-muted-foreground">
                            {selectedFlight.airline} • {selectedFlight.flightNumber}
                          </p>
                        </div>
                      </div>

                      {selectedFlight.departureDate && (
                        <div className="rounded-xl border border-primary/20 bg-background/80 p-5 shadow-sm">
                          <p className="text-sm text-muted-foreground">Departure Date</p>
                          <p className="mt-2 text-2xl font-semibold text-primary">{format(selectedFlight.departureDate, 'EEEE, MMMM dd, yyyy')}</p>
                        </div>
                      )}

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-border/40 bg-background/70 p-5 shadow-sm">
                          <p className="text-sm text-muted-foreground">Departure Time</p>
                          <p className="mt-2 text-2xl font-semibold text-primary">{selectedFlight.departureTime}</p>
                        </div>
                        <div className="rounded-xl border border-border/40 bg-background/70 p-5 shadow-sm">
                          <p className="text-sm text-muted-foreground">Arrival Time</p>
                          <p className="mt-2 text-2xl font-semibold text-primary">{selectedFlight.arrivalTime}</p>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-primary/20 bg-background/80 p-5 shadow-sm">
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="mt-2 text-2xl font-semibold text-foreground">{selectedFlight.duration}</p>
                        </div>
                        <div className="rounded-xl border border-primary/20 bg-background/80 p-5 shadow-sm">
                          <p className="text-sm text-muted-foreground">Available Seats</p>
                          <p className="mt-2 text-2xl font-semibold text-foreground">{selectedFlight.availableSeats}</p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-primary/15 bg-background/80 p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-base font-semibold text-primary">
                          <CheckCircle2 className="h-5 w-5" /> Amenities & Services
                        </div>
                        <Separator className="my-4 bg-border/60" />
                        <div className="flex flex-wrap gap-2">
                          {selectedFlight.amenities.map((amenity, index) => (
                            <Badge key={index} variant="outline" className="border-primary/40 bg-primary/10 text-xs font-medium">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border/40 bg-background/70 p-6 shadow-sm">
                        <p className="text-sm text-muted-foreground mb-2">Total Price</p>
                        <p className="text-4xl font-bold text-primary">{selectedFlight.price}</p>
                      </div>

                      <Separator className="my-6" />

                      {/* Booking Form */}
                      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-background p-6 shadow-lg">
                        <h4 className="text-xl font-semibold text-primary mb-6 flex items-center gap-2">
                          <User className="w-5 h-5" /> Passenger Details
                        </h4>
                        <div className="grid gap-5">
                          <div className="grid gap-2">
                            <Label htmlFor="fullName" className="text-sm font-medium">Full Name *</Label>
                            <Input
                              id="fullName"
                              placeholder="Enter your full name"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="bg-background"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="email"
                                type="email"
                                placeholder="your.email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-background pl-10"
                              />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+880 1XXX-XXXXXX"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="bg-background"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="bookingDate" className="text-sm font-medium">Travel Date</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      'justify-start text-left font-normal bg-background',
                                      !bookingDate && 'text-muted-foreground'
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {bookingDate ? format(bookingDate, 'PPP') : 'Pick a date'}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={bookingDate}
                                    onSelect={setBookingDate}
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="passengers" className="text-sm font-medium">Passengers</Label>
                              <Select value={passengers} onValueChange={setPassengers}>
                                <SelectTrigger className="bg-background">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5, 6].map((num) => (
                                    <SelectItem key={num} value={num.toString()}>
                                      {num} {num === 1 ? 'Passenger' : 'Passengers'}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-background/80 p-6 text-sm leading-relaxed text-muted-foreground">
                        <PhoneCall className="h-5 w-5 flex-shrink-0 text-primary" />
                        <p>Need assistance? Call us at +880-1234-567890 or email support@travelexa.com. Our Bengali-speaking team is available 24/7.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="flex flex-col gap-3 border-t border-border/60 bg-background/95 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-16">
                <p className="text-sm text-muted-foreground">
                  {selectedFlight.airline} {selectedFlight.flightNumber} • {selectedFlight.from} → {selectedFlight.to}
                </p>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <Button size="lg" className="w-full sm:w-auto" onClick={handleConfirmBooking}>
                    Confirm Booking
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
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

export default FlightBooking;
