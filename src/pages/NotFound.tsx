import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Hammer, Sparkles } from "lucide-react";

const LOGO_SRC = "/skybridge-logo.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    scrollTo(0, 0);
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#050b16] via-[#091327] to-[#0a1b38] px-6 py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_55%)]" aria-hidden />
      <div className="absolute inset-0 bg-grid-small-white/[0.03] opacity-40" aria-hidden />

      <div className="relative z-10 w-full max-w-4xl">
        <div className="mb-10 flex flex-col items-center gap-5 text-center">
          <img
            src={LOGO_SRC}
            alt="Skybridge Digital logo"
            className="h-16 w-16 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-lg shadow-blue-500/20 backdrop-blur"
          />
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.4em] text-blue-200/80">Skybridge Digital</p>
            <h1 className="text-3xl font-semibold text-white/90 sm:text-4xl">Partnering to craft unforgettable travel products</h1>
          </div>
        </div>

        <div className="mx-auto mb-10 max-w-3xl rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-center shadow-2xl shadow-blue-900/20 backdrop-blur">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-blue-400/40 bg-blue-500/10">
            <Hammer className="h-10 w-10 text-blue-200" aria-hidden />
          </div>
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-blue-200/70">404 · Experience Under Construction</p>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            This journey isn’t launched yet
          </h2>
          <p className="text-lg text-blue-100/80">
            The route <span className="font-semibold text-white">{location.pathname}</span> is being assembled with the same polish as our premium travel experiences.
            Connect with Skybridge Digital to explore how we can build your full flights, hotels, and tours platform.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="w-full max-w-xs bg-blue-500 text-slate-950 hover:bg-blue-400">
            <a href="/">
              Back to Home
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full max-w-xs border-blue-400/70 text-blue-100 hover:bg-blue-500/10"
          >
            <a href="mailto:skybridgedigitalofficial@gmail.com?subject=Partner%20with%20Skybridge%20Digital&body=Hi%20Skybridge%20Digital%20team,%0D%0AWe'd%20love%20to%20see%20the%20full%20TravelExa%20experience.%20Let's%20connect!">
              Hire Skybridge Digital
            </a>
          </Button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-3 text-sm text-blue-100/70">
          <Sparkles className="h-4 w-4" aria-hidden />
          We build end-to-end travel platforms that scale.
        </div>
      </div>
    </section>
  );
};

export default NotFound;
