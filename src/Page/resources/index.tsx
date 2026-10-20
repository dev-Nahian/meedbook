import { Link, useLocation } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { resourceLinks } from "./resourceData";

const ResourcePage = () => {
  const { pathname } = useLocation();
  const current = resourceLinks.find((item) => item.to === pathname) ?? resourceLinks[0];

  return (
    <div className="mt-24 bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-b from-sky-50 to-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
              {current.eyebrow}
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-secondary sm:text-5xl">
              {current.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              {current.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/see-all-clinic"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              >
                Find a clinic
                <ArrowRight size={17} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-secondary transition-all hover:border-primary hover:text-primary"
              >
                Ask for help
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white bg-white/80 p-6 shadow-xl shadow-sky-100">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Planning checklist
            </p>
            <div className="mt-6 space-y-4">
              {current.highlights.map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-6 text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              More resources
            </p>
            <h2 className="mt-2 text-3xl font-bold text-secondary">
              Continue planning your dialysis journey
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            Read latest updates
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resourceLinks
            .filter((item) => item.to !== current.to)
            .slice(0, 6)
            .map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <p className="text-base font-semibold text-secondary">
                  {item.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {item.description}
                </p>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
};

export default ResourcePage;
