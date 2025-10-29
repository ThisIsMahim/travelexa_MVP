import { Plane, Facebook, Instagram, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Plane className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">Travelexa</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Your trusted travel partner for seamless flight and hotel bookings worldwide.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 hover:scale-110 smooth-transition group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 group-hover:text-primary smooth-transition" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 hover:scale-110 smooth-transition group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 group-hover:text-primary smooth-transition" />
              </a>
              <a
                href="https://wa.me/8801792090069"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 hover:scale-110 smooth-transition group"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 group-hover:text-primary smooth-transition" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#flights" className="text-muted-foreground hover:text-primary smooth-transition">
                  Book Flights
                </a>
              </li>
              <li>
                <a href="#hotels" className="text-muted-foreground hover:text-primary smooth-transition">
                  Find Hotels
                </a>
              </li>
              <li>
                <a href="#about" className="text-muted-foreground hover:text-primary smooth-transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-primary smooth-transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="tel:+8801792090069" className="hover:text-primary smooth-transition">
                  +880 1792 090069
                </a>
              </li>
              <li>
                <a href="mailto:Travelexasyl@gmail.com" className="hover:text-primary smooth-transition">
                  Travelexasyl@gmail.com
                </a>
              </li>
              <li className="pt-2">
                <span className="text-sm">Available 24/7</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Travelexa. Travel with Trust. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
