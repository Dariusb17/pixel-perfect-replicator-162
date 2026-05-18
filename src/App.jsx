import { useEffect, useMemo, useState } from "react";

const STOCK = {
  hero: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1400&q=80",
  services: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
  process: "https://images.unsplash.com/photo-1565608087341-404b25492fee?auto=format&fit=crop&w=1200&q=80",
  about: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
};

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
  return (
    <div className="sticky top-4 z-40 px-4">
      <nav className="mx-auto flex max-w-5xl items-center justify-between rounded-2xl border border-white/60 bg-white/90 px-5 py-3 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur">
        <span className="text-lg font-semibold tracking-tight text-ink">{name}</span>
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
  return (
    <section className="px-4 pt-6">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/60 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)]">
        <div className="relative min-h-[560px] md:min-h-[640px]">
          <SafeImg
            src={photo1}
            fallback={STOCK.hero}
            alt="Electrician la lucru"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
          <div className="relative flex h-full min-h-[560px] md:min-h-[640px] flex-col justify-end p-8 md:p-12">
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
              Electrician<br />profesionist<br />la orice oră
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/85 md:text-lg">
              Instalații sigure, reparații rapide, și service 24/7 pentru locuințe și afaceri. Certificat și asigurat pentru liniștea dumneavoastră.
              {city ? ` Servim zona ${city} și împrejurimi.` : ""}
            </p>
            {rating ? (
              <p className="mt-3 text-sm text-white/90">★ {rating} pe Google · {name}</p>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={tel ? `tel:${tel}` : "#contact"}
                className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-brand-dark"
              >
                Sunați acum
              </a>
              <a
                href="#servicii"
                className="rounded-full bg-brand-soft px-6 py-3 text-sm font-medium text-brand-dark transition hover:bg-white"
              >
                Vezi serviciile
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About({ name, about }) {
  const paragraph =
    about ||
    `${name} oferă servicii electrice complete în România, de la proiectare și execuție până la mentenanță industrială. Cu o echipă de electricieni autorizați ANRE, punem siguranța instalației dumneavoastră pe primul loc.`;
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <span className="inline-block rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-ink shadow-sm">
          Despre Noi
        </span>
        <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
          Experiență și<br />Siguranță în<br />Fiecare Conexiune
        </h2>
        <p className="mt-6 text-base leading-relaxed text-slate-600">{paragraph}</p>
        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-white bg-white/80 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
            <p className="text-4xl font-bold tracking-tight text-ink">15+ Ani</p>
            <p className="mt-3 text-sm text-slate-500">Experiență pe piață</p>
          </div>
          <div className="rounded-2xl border border-white bg-white/80 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
            <p className="text-4xl font-bold tracking-tight text-ink">5000+</p>
            <p className="mt-3 text-sm text-slate-500">Intervenții finalizate</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutPhoto() {
  return (
    <section className="px-4 pb-10">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-3xl border border-white bg-white/80 p-2 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
          <SafeImg
            src=""
            fallback={STOCK.about}
            alt="Electrician autorizat"
            className="h-[360px] w-full rounded-2xl object-cover md:h-[440px]"
          />
        </div>
      </div>
    </section>
  );
}

function Services({ phone, photo2 }) {
  const tel = digits(phone);
  return (
    <section id="servicii" className="px-4 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
          Servicii Electrice<br />Complete
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
          Soluții profesionale pentru orice problemă electrică, rezidențială sau comercială.
        </p>
        <div className="mt-6 flex justify-center">
          <a
            href={tel ? `tel:${tel}` : "#contact"}
            className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-brand-dark"
          >
            Contactați-ne
          </a>
        </div>
        <div className="mt-10 overflow-hidden rounded-3xl border border-white bg-white/90 p-3 text-left shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <SafeImg
            src={photo2}
            fallback={STOCK.services}
            alt="Instalații electrice"
            className="h-[300px] w-full rounded-2xl object-cover"
          />
          <div className="p-5">
            <h3 className="text-xl font-semibold text-ink">Instalații Electrice</h3>
            <p className="mt-2 text-sm text-slate-500">Execuție instalații noi pe normele de siguranță.</p>
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
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
          Procesul Nostru de<br />Lucru
        </h2>
        <p className="mt-4 text-base text-slate-600">Simplu și eficient pentru confortul tău</p>
        <div className="mt-10 overflow-hidden rounded-3xl border border-white bg-white/90 p-3 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <SafeImg
            src={photo3}
            fallback={STOCK.process}
            alt="Procesul de lucru"
            className="h-[300px] w-full rounded-2xl object-cover"
          />
        </div>
        <div className="mt-6 space-y-5 text-left">
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
    { text: "Promptitudine și profesionalism. Au rezolvat scurtcircuitul în 30 de minute.", who: "Ion Popescu", role: "Proprietar casă" },
    { text: "Mentenanța anuală la birouri a fost realizată impecabil și conform normelor.", who: "Maria Ionescu", role: "Manager firmă" },
    { text: "Colaborez cu ei la proiecte rezidențiale de lux. Execuție perfectă.", who: "Andrei Dobre", role: "Architect" },
  ];
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
          Ce spun clienții<br />noștri
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base text-slate-600">
          Peste {reviews} de clienți mulțumiți de serviciile {name}.
        </p>
        <div className="mt-10 space-y-5 text-left">
          {items.map((r, i) => (
            <div key={i} className="rounded-3xl border border-white bg-white/90 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              <Stars />
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{r.text}</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M7 7h4v4H8c0 2 1 3 3 3v2c-3 0-5-2-5-5V7zm8 0h4v4h-3c0 2 1 3 3 3v2c-3 0-5-2-5-5V7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{r.who}</p>
                  <p className="text-xs text-slate-500">{r.role}</p>
                </div>
              </div>
            </div>
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
    { q: "Ce zone acoperiți?", a: city ? `Acoperim zona ${city} și împrejurimi.` : "Acoperim zona dumneavoastră și împrejurimi." },
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
    <footer className="px-4 pb-10 pt-6">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white bg-white/80 p-8 text-sm text-slate-600 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
        <p className="text-lg font-semibold text-ink">{name}</p>
        <div className="mt-4 space-y-1.5">
          {phone ? (
            <p>
              Telefon: <a href={`tel:${tel}`} className="text-brand hover:underline">{phone}</a>
            </p>
          ) : (
            <p>Telefon: 07xx xxx xxx</p>
          )}
          {address ? <p>Adresă: {address}</p> : null}
          {hours ? <p>Program: {hours}</p> : null}
          {maps_url ? (
            <p>
              <a href={maps_url} target="_blank" rel="noreferrer" className="text-brand hover:underline">
                Deschide în Google Maps
              </a>
            </p>
          ) : null}
        </div>
        <p className="mt-6 text-xs text-slate-400">© {new Date().getFullYear()} {name}. Toate drepturile rezervate.</p>
      </div>
    </footer>
  );
}

export default function App() {
  const p = useParams();
  return (
    <div className="min-h-screen">
      <Navbar name={p.name} phone={p.phone} />
      <Hero name={p.name} phone={p.phone} city={p.city} rating={p.rating} photo1={p.photo1} />
      <About name={p.name} about={p.about} />
      <AboutPhoto />
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
