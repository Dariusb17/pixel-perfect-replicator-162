import { useEffect, useMemo, useRef, useState } from "react";
import electricianAbout from "@/assets/electrician-about.jpg";
import electricianProcess from "@/assets/electrician-process.jpg";
import electricianServices from "@/assets/electrician-services.jpg";
import electricianUrgent from "@/assets/electrician-urgent.jpg";

function Reveal({ children, delay = 0, as: Tag = "div", className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

function useParallax() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const progress = 1 - (rect.top + rect.height / 2) / vh;
        el.style.transform = `translate3d(0, ${progress * -40}px, 0) scale(${1 + Math.max(0, progress) * 0.05})`;
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return ref;
}

const STOCK = {
  hero: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=80",
  services: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
  process: "https://images.unsplash.com/photo-1565608087341-404b25492fee?auto=format&fit=crop&w=1200&q=80",
  about: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&w=1200&q=80",
};

function CountUp({ to, suffix = "", duration = 1400 }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true;
          const start = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(to * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function LetterReveal({ text, className = "", delay = 0, step = 35 }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="char"
          style={{ animationDelay: `${delay + i * step}ms` }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setP(total > 0 ? (h.scrollTop / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed left-0 top-0 z-50 h-[3px] w-full bg-transparent">
      <div className="h-full bg-gradient-to-r from-brand via-indigo-400 to-brand transition-[width] duration-150 ease-out" style={{ width: `${p}%` }} />
    </div>
  );
}

function Marquee({ items }) {
  const loop = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-white/60 bg-white/40 backdrop-blur">
      <div className="marquee-track flex w-max gap-12 py-4">
        {loop.map((it, i) => (
          <span key={i} className="flex items-center gap-3 whitespace-nowrap text-sm font-medium text-ink/70">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

function useParams() {
  return useMemo(() => {
    if (typeof window === "undefined") return {};
    const sp = new URLSearchParams(window.location.search);
    const get = (k) => {
      const v = sp.get(k);
      return v && v.trim() ? v.trim() : "";
    };
    return {
      name: get("name") || "Electrician",
      phone: get("phone"),
      city: get("city"),
      rating: get("rating"),
      reviews: get("reviews") || "5000",
      about: get("about"),
      address: get("address"),
      maps_url: get("maps_url"),
      hours: get("hours"),
      photo1: get("photo1"),
      photo2: get("photo2"),
      photo3: get("photo3"),
    };
  }, []);
}

const digits = (s) => (s || "").replace(/\D+/g, "");

function SafeImg({ src, fallback, alt, className }) {
  const [cur, setCur] = useState(src || fallback);
  useEffect(() => { setCur(src || fallback); }, [src, fallback]);
  return (
    <img
      src={cur}
      alt={alt}
      className={className}
      onError={() => { if (cur !== fallback) setCur(fallback); }}
      loading="lazy"
    />
  );
}

function Navbar({ name, phone }) {
  const tel = digits(phone);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="sticky top-4 z-40 px-4">
      <nav
        className={`mx-auto flex max-w-5xl items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300 ${
          scrolled
            ? "border border-white/40 bg-white/40 shadow-[0_10px_40px_rgba(15,23,42,0.10)] backdrop-blur-xl backdrop-saturate-150"
            : "border border-white/70 bg-white/90 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur"
        }`}
      >
        <span className="text-lg font-semibold tracking-tight text-ink">{name}</span>
        <div className="hidden gap-7 text-sm font-medium text-ink/80 md:flex">
          <a href="#servicii" className="hover:text-brand transition">Servicii</a>
          <a href="#despre" className="hover:text-brand transition">Despre</a>
          <a href="#recenzii" className="hover:text-brand transition">Recenzii</a>
          <a href="#contact" className="hover:text-brand transition">Contact</a>
        </div>
        <a
          href={tel ? `tel:${tel}` : "#contact"}
          className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-dark"
        >
          Ofertă
        </a>
      </nav>
    </div>
  );
}

function Hero({ name, phone, city, rating, photo1 }) {
  const tel = digits(phone);
  const parallaxRef = useParallax();
  return (
    <section className="px-4 pt-6">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/60 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)]">
        <div className="relative min-h-[560px] md:min-h-[640px]">
          <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
            <SafeImg
              src={electricianAbout}
              fallback={electricianAbout}
              alt="Electrician la lucru"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand/40 blob" />
          <div className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-indigo-400/30 blob" style={{ animationDelay: "-4s" }} />
          <div className="relative flex h-full min-h-[560px] md:min-h-[640px] flex-col justify-end p-8 md:p-12">
            <Reveal as="h1" className="text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
              Electrician profesionist<br />la orice oră
            </Reveal>
            <Reveal delay={1100} as="p" className="mt-5 max-w-xl text-base text-white/85 md:text-lg">
              Instalații sigure, reparații rapide, și service 24/7 pentru locuințe și afaceri{city ? <> în <strong className="font-semibold text-white">{city}</strong></> : null}.
            </Reveal>
            {rating ? (
              <Reveal delay={1200} as="p" className="mt-3 text-sm text-white/90">★ {rating} pe Google · {name}</Reveal>
            ) : null}
            <Reveal delay={1300} className="mt-6 flex flex-wrap gap-3">
              <a
                href={tel ? `tel:${tel}` : "#contact"}
                className="pulse-glow rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                Sunați acum
              </a>
              <a
                href="#servicii"
                className="rounded-full bg-white/15 px-6 py-3 text-sm font-medium text-white ring-1 ring-white/40 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/25"
              >
                Vezi serviciile
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function About({ name, about, city }) {
  const location = city ? (
    <>
      <strong className="font-semibold text-ink">{city}</strong>, România
    </>
  ) : (
    "România"
  );
  return (
    <section id="despre" className="px-4 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="inline-block rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-ink shadow-sm">
              Despre Noi
            </span>
          </Reveal>
          <Reveal as="h2" delay={80} className="mt-6 text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
            Experiență și Siguranță în Fiecare Conexiune
          </Reveal>
          <Reveal as="p" delay={160} className="mt-6 max-w-xl text-base leading-relaxed text-slate-600">
            {about || (
              <>
                {name} oferă servicii electrice complete în {location}. Cu o echipă de electricieni autorizați ANRE, punem siguranța instalației dumneavoastră pe primul loc.
              </>
            )}
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Reveal delay={220} className="rounded-2xl border border-white bg-white/80 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              <p className="text-4xl font-bold tracking-tight text-ink"><CountUp to={15} suffix="+ Ani" /></p>
              <p className="mt-3 text-sm text-slate-500">Experiență pe piață</p>
            </Reveal>
            <Reveal delay={300} className="rounded-2xl border border-white bg-white/80 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              <p className="text-4xl font-bold tracking-tight text-ink"><CountUp to={5000} suffix="+" duration={1800} /></p>
              <p className="mt-3 text-sm text-slate-500">Intervenții finalizate</p>
            </Reveal>
          </div>
        </div>
        <Reveal delay={120} className="overflow-hidden rounded-3xl border border-white bg-white/80 p-2 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.2)]">
          <SafeImg
            src={electricianAbout}
            fallback={electricianAbout}
            alt="Electrician autorizat"
            className="h-[360px] w-full rounded-2xl object-cover md:h-[520px]"
          />
        </Reveal>
      </div>
    </section>
  );
}

function Services({ phone, photo2 }) {
  const tel = digits(phone);
  return (
    <section id="servicii" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
            Servicii Electrice Complete
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
            Soluții profesionale pentru orice problemă electrică, rezidențială sau comercială.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={tel ? `tel:${tel}` : "#contact"}
              className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-brand-dark"
            >
              Contactați-ne
            </a>
            <a
              href={tel ? `https://wa.me/${tel}` : "#contact"}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#25D366] px-6 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-[#1ebe5d]"
            >
              WhatsApp
            </a>
          </div>
        </div>
        <div className="mt-10 -mx-4 overflow-x-auto px-4 pb-4 [scrollbar-width:thin]">
          <div className="flex snap-x snap-mandatory gap-5">
            {[
              { title: "Instalații Electrice", desc: "Execuție instalații noi pentru case și birouri, respectând normele de siguranță.", img: electricianServices },
              { title: "Reparații Urgente", desc: "Intervenții rapide 24/7 pentru scurtcircuite, tablouri arse sau întreruperi de curent.", img: electricianUrgent },
              { title: "Mentenanță", desc: "Verificări periodice pentru a preveni incidentele și pentru a optimiza consumul.", img: electricianProcess },
              { title: "Automatizări", desc: "Integrare sisteme inteligente pentru controlul iluminatului și eficiență energetică.", img: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80" },
              { title: "Iluminat Exterior", desc: "Montaj sisteme de iluminat pentru grădini, fațade și spații comerciale.", img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80" },
            ].map((s, i) => (
              <div key={i} className="w-[280px] flex-none snap-start overflow-hidden rounded-3xl border border-white bg-white/90 p-3 text-left shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)] md:w-[320px]">
                <SafeImg
                  src={s.img}
                  fallback={s.img}
                  alt={s.title}
                  className="h-[220px] w-full rounded-2xl object-cover md:h-[260px]"
                />
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StandardIcon({ d }) {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-md">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d={d} />
      </svg>
    </div>
  );
}

function Standards() {
  const items = [
    {
      title: "Autorizați ANRE",
      desc: "Toți membrii echipei dețin acreditările necesare pentru lucrări sigure.",
      icon: <StandardIcon d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    },
    {
      title: "Materiale Certificate",
      desc: "Folosim doar componente omologate, cu garanție extinsă.",
      icon: (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-md">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
            <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
          </svg>
        </div>
      ),
    },
    {
      title: "Intervenții Rapide",
      desc: "Echipa noastră ajunge la fața locului în cel mai scurt timp posibil.",
      icon: (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-md">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
            <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
          </svg>
        </div>
      ),
    },
  ];
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
          Standarde de<br />Execuție
        </h2>
        <p className="mt-4 text-base text-slate-600">De ce să ne alegi pe noi pentru siguranța ta?</p>
        <div className="mt-10 space-y-5 text-left">
          {items.map((it, i) => (
            <div key={i} className="rounded-3xl border border-white bg-white/90 p-7 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              {it.icon}
              <h3 className="mt-16 text-2xl font-semibold text-ink">{it.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process({ photo3 }) {
  const steps = [
    { n: 1, title: "Apel sau Mesaj", desc: "Ne contactezi și descrii problema electrică identificată." },
    { n: 2, title: "Evaluare la fața locului", desc: "Venim rapid să diagnosticăm și să propunem cea mai bună soluție." },
    { n: 3, title: "Execuția lucrărilor", desc: "Folosim materiale profesionale și scule omologate pentru reparație." },
    { n: 4, title: "Testare și Recepție", desc: "Verificăm siguranța circuitelor înainte de finalizarea lucrării." },
  ];
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
            Procesul Nostru de Lucru
          </h2>
          <p className="mt-4 text-base text-slate-600">Simplu și eficient pentru confortul tău</p>
        </div>
        <div className="mt-10 overflow-hidden rounded-3xl border border-white bg-white/90 p-3 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <SafeImg
            src={electricianProcess}
            fallback={electricianProcess}
            alt="Procesul de lucru"
            className="h-[300px] w-full rounded-2xl object-cover md:h-[460px]"
          />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 text-left sm:grid-cols-2 md:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="rounded-3xl border border-white bg-white/90 p-7 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">{s.n}</div>
              <h3 className="mt-5 text-xl font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
              <div className="mt-6 h-px w-full bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stars() {
  return (
    <div className="flex gap-1 text-brand">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function Reviews({ name, reviews }) {
  const items = [
    {
      text: "Promptitudine și profesionalism. Au rezolvat scurtcircuitul în 30 de minute.",
      who: "Andrei Moldovan",
      role: "Proprietar casă",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=160&h=160&q=80",
    },
    {
      text: "Mentenanța anuală la birouri a fost realizată impecabil și conform normelor.",
      who: "Maria Ionescu",
      role: "Manager firmă",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=160&h=160&q=80",
    },
    {
      text: "Colaborez cu ei la proiecte rezidențiale de lux. Execuție perfectă.",
      who: "Andrei Dobre",
      role: "Architect",
      avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=facearea&facepad=2&w=160&h=160&q=80",
    },
  ];
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal as="h2" className="text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
          Ce spun clienții<br />noștri
        </Reveal>
        <Reveal delay={120} as="p" className="mx-auto mt-4 max-w-md text-base text-slate-600">
          Peste {reviews} de clienți mulțumiți de serviciile {name}.
        </Reveal>
        <div className="mt-10 space-y-5 text-left">
          {items.map((r, i) => (
            <Reveal key={i} delay={i * 100} className="rounded-3xl border border-white bg-white/90 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
              <Stars />
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{r.text}</p>
              <div className="mt-5 flex items-center gap-3">
                <SafeImg
                  src={r.avatar}
                  fallback={r.avatar}
                  alt={r.who}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
                <div>
                  <p className="text-sm font-semibold text-ink">{r.who}</p>
                  <p className="text-xs text-slate-500">{r.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-white bg-white/90 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-ink">{q}</span>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white transition ${open ? "rotate-45" : ""}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="h-4 w-4">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      {open ? <div className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{a}</div> : null}
    </div>
  );
}

function FAQ({ city }) {
  const faqs = [
    { q: "Interveniți în weekend?", a: "Da, oferim intervenții și în weekend, 24/7 pentru urgențe electrice." },
    { q: "Ce zone acoperiți?", a: city ? `Oferim servicii în toată zona ${city}.` : "Oferim servicii în toată zona dumneavoastră." },
    { q: "Oferiți factură?", a: "Da, emitem factură fiscală pentru toate lucrările efectuate." },
  ];
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">Întrebări Frecvente</h2>
        <div className="mt-8 space-y-4">
          {faqs.map((f, i) => <FAQItem key={i} {...f} />)}
        </div>
      </div>
    </section>
  );
}

function CTA({ phone }) {
  const tel = digits(phone);
  return (
    <section id="contact" className="px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-3xl border border-white bg-white/95 p-10 text-center shadow-[0_20px_60px_-20px_rgba(15,23,42,0.2)]">
          <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_30%_20%,#dbeafe,transparent_60%),radial-gradient(circle_at_80%_80%,#ede9fe,transparent_60%)]" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-ink shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path d="M22 16.92V21a1 1 0 01-1.11 1A19.79 19.79 0 012 4.11 1 1 0 013 3h4.09a1 1 0 011 .75l1 4a1 1 0 01-.29 1L7 10.5a16 16 0 006.5 6.5l1.75-1.75a1 1 0 011-.29l4 1a1 1 0 01.75 1z" /></svg>
              Contactați-ne
            </span>
            <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
              Ai o urgență<br />electrică?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-slate-600">
              Suntem pregătiți să intervenim rapid pentru a-ți asigura confortul și siguranța.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a
                href={tel ? `tel:${tel}` : "#"}
                className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-brand-dark"
              >
                Sună acum
              </a>
              <a
                href={tel ? `https://wa.me/${tel}` : "#"}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-brand-soft px-6 py-3 text-sm font-medium text-brand-dark transition hover:bg-white"
              >
                Cere ofertă
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ name, phone, address, maps_url, hours }) {
  const tel = digits(phone);
  return (
    <footer className="mt-10 bg-brand text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="text-3xl font-bold tracking-tight">{name}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white/70">Servicii</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#servicii" className="hover:underline">Instalații</a></li>
              <li><a href="#servicii" className="hover:underline">Mentenanță</a></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white/70">Contactați-ne</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                {phone ? (
                  <a href={`tel:${tel}`} className="hover:underline">{phone}</a>
                ) : (
                  "07xx xxx xxx"
                )}
              </li>
              {address ? <li>{address}</li> : null}
              {hours ? <li>{hours}</li> : null}
              {maps_url ? (
                <li>
                  <a href={maps_url} target="_blank" rel="noreferrer" className="hover:underline">
                    Deschide în Google Maps
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white/70">Companie</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#despre" className="hover:underline">Despre</a></li>
              <li><a href="#contact" className="hover:underline">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/20 pt-6 text-sm text-white/80 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} | {name}</p>
          <a href="#" className="hover:underline">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const p = useParams();
  return (
    <div className="min-h-screen">
      <ScrollProgress />
      <Navbar name={p.name} phone={p.phone} />
      <Hero name={p.name} phone={p.phone} city={p.city} rating={p.rating} photo1={p.photo1} />
      <div className="mt-10">
        <Marquee items={["Autorizați ANRE", "Service 24/7", "Garanție lucrări", "Materiale certificate", "Intervenții rapide", "Echipă verificată"]} />
      </div>
      <About name={p.name} about={p.about} city={p.city} />
      <Services phone={p.phone} photo2={p.photo2} />
      <Standards />
      <Process photo3={p.photo3} />
      <Reviews name={p.name} reviews={p.reviews} />
      <FAQ city={p.city} />
      <CTA phone={p.phone} />
      <Footer name={p.name} phone={p.phone} address={p.address} maps_url={p.maps_url} hours={p.hours} />
    </div>
  );
}
