import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import FlightBooking from '@/components/FlightBooking';
import HotelShowcase from '@/components/HotelShowcase';
import TourPackages from '@/components/TourPackages';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

const Index = () => {
  useSmoothScroll();

  return (
    <div className="relative">
      <Navigation />
      <main>
        <div id="home">
          <Hero />
        </div>
        <div id="flights">
          <FlightBooking />
        </div>
        <div id="hotels">
          <HotelShowcase />
        </div>
        <div id="tours">
          <TourPackages />
        </div>
        <div id="about">
          <WhyChooseUs />
        </div>
        <div id="testimonials">
          <Testimonials />
        </div>
        <div id="contact">
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
