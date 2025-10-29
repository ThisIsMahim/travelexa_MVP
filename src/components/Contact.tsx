import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Phone, Mail, MapPin } from 'lucide-react';

const Contact = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useInViewAnimation<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className={`py-24 px-6 relative transition-all duration-700 ease-out ${
        sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Get in <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            We're here to help plan your perfect journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="glass-card p-6 hover:border-primary/50 smooth-transition hover-lift group cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:scale-110 smooth-transition">
                  <Phone className="w-6 h-6 text-primary group-hover:rotate-12 smooth-transition" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">Call or WhatsApp</h3>
                  <a
                    href="tel:+8801792090069"
                    className="text-muted-foreground hover:text-primary smooth-transition"
                  >
                    +880 1792 090069
                  </a>
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6 hover:border-primary/50 smooth-transition hover-lift group cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:scale-110 smooth-transition">
                  <Mail className="w-6 h-6 text-primary group-hover:rotate-12 smooth-transition" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">Email Us</h3>
                  <a
                    href="mailto:Travelexasyl@gmail.com"
                    className="text-muted-foreground hover:text-primary smooth-transition"
                  >
                    Travelexasyl@gmail.com
                  </a>
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6 hover:border-primary/50 smooth-transition hover-lift group cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:scale-110 smooth-transition">
                  <MapPin className="w-6 h-6 text-primary group-hover:rotate-12 smooth-transition" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">Visit Us</h3>
                  <p className="text-muted-foreground">
                    Available online worldwide
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="glass-card p-8">
            <form className="space-y-4">
              <div>
                <Input
                  placeholder="Your Name"
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div>
                <Input
                  placeholder="Subject"
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  rows={5}
                  className="bg-secondary/50 border-border resize-none"
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold glow-effect hover:scale-105 smooth-transition"
              >
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
