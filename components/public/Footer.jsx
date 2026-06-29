// components/public/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-[#141840] text-[var(--ivory)] pt-24 pb-8"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Top Section: Massive Brand Typography */}
        <div className="mb-20">
          <h2 className="font-display text-[12vw] md:text-[10vw] leading-[0.9] tracking-tight text-(--ivory/10) select-none">
            SARAH
            <br />
            HOMESTAY
          </h2>
        </div>

        {/* Middle Section: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20 border-t border-(--ivory/10) pt-12">
          {/* Brand & Tagline */}
          <div className="md:col-span-4 space-y-6">
            <span className="font-display text-2xl tracking-wide">
              SARAH <span className="text-accent">HOMESTAY</span>
            </span>
            <p className="text-[var(--ivory)]/60 text-sm leading-relaxed max-w-xs font-accent italic text-lg">
              &quot;A home away from home.&quot;
            </p>
            <p className="text-[var(--ivory)]/60 text-sm leading-relaxed max-w-xs">
              Curated, smart-enabled stays across Kenya&apos;s most vibrant
              destinations.
            </p>
          </div>

          {/* Locations */}
          <div className="md:col-span-4 md:col-start-6 space-y-6">
            <h3 className="text-xs uppercase tracking-[0.2em] text-accent font-medium">
              Our Locations
            </h3>
            <ul className="space-y-3 text-[var(--ivory)]/80">
              <li>
                <a
                  href="#kilimani"
                  className="hover:text-accent transition-colors"
                >
                  Kilimani, Nairobi
                </a>
              </li>
              <li>
                <a
                  href="#malindi"
                  className="hover:text-accent transition-colors"
                >
                  Malindi Coast
                </a>
              </li>
              <li>
                <a
                  href="#nanyuki"
                  className="hover:text-accent transition-colors"
                >
                  Nanyuki Highlands
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3 space-y-6">
            <h3 className="text-xs uppercase tracking-[0.2em] text-accent font-medium">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-[var(--ivory)]/80 text-sm">
              <li>
                <a
                  href="https://wa.me/254722323471"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors flex items-center gap-2"
                >
                  WhatsApp: +254 722 323 471
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@sarahhomestay.com"
                  className="hover:text-accent transition-colors"
                >
                  hello@sarahhomestay.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-[var(--ivory)]/10 text-xs text-[var(--ivory)]/40">
          <Link
            href="/admin"
            className="hover:text-[var(--ivory)]/80 transition-colors"
          >
            &copy; {new Date().getFullYear()} Sarah Homestay. All rights
            reserved.
          </Link>
          <div className="flex gap-6">
            <span className="hover:text-[var(--ivory)]/80 cursor-pointer transition-colors">
              Privacy
            </span>
            <span className="hover:text-[var(--ivory)]/80 cursor-pointer transition-colors">
              Terms
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
