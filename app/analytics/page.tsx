import { Footer } from "@/components/Footer";
import { getSiteAnalytics, countryName } from "@/lib/site-analytics";
import { isAnalyticsUnlocked } from "./actions";
import { UnlockForm } from "./UnlockForm";

export const metadata = {
  title: "Analytics — (SW)",
  robots: { index: false, follow: false },
};

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default async function AnalyticsPage() {
  const unlocked = await isAnalyticsUnlocked();
  const stats = unlocked ? await getSiteAnalytics() : null;

  return (
    <main className="min-h-dvh bg-[#e2e2e2] text-black">
      <div className="px-9 pt-[calc(var(--header-height)+2.5rem)] pb-10 lg:px-6">
        <div className="mx-auto w-full max-w-7xl">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            ( vibe coded in 2026 )
          </p>
          <h1 className="!font-sans mt-4 max-w-4xl text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight">
            {unlocked ? "Site analytics" : "Enter password"}
          </h1>
          {unlocked ? (
            <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-black/60">
              Visitors and locations from Vercel Web Analytics. Totals are
              lifetime; countries cover the last 30 days.
            </p>
          ) : (
            <UnlockForm />
          )}

          {unlocked && stats ? (
            <>
              <section className="mt-16 grid grid-cols-1 gap-8 border-t border-black/20 pt-8 sm:grid-cols-2">
                <div>
                  <p className="font-sans text-base text-black/45">Visitors</p>
                  <p className="mt-3 font-sans text-[clamp(2.5rem,6vw,4rem)] font-bold leading-none tracking-tight">
                    {formatCount(stats.visitors)}
                  </p>
                </div>
                <div>
                  <p className="font-sans text-base text-black/45">Page views</p>
                  <p className="mt-3 font-sans text-[clamp(2.5rem,6vw,4rem)] font-bold leading-none tracking-tight">
                    {formatCount(stats.pageviews)}
                  </p>
                </div>
              </section>

              <section className="mt-16">
                <p className="font-sans text-base text-black/45">Locations</p>
                <div className="mt-3 border-t border-black/20" />
                {stats.countries.length > 0 ? (
                  <ul className="mt-6 divide-y divide-black/10">
                    {stats.countries.map((row) => (
                      <li
                        key={row.country}
                        className="flex items-baseline justify-between gap-6 py-3"
                      >
                        <span className="font-sans text-base">
                          {countryName(row.country)}
                        </span>
                        <span className="font-mono text-sm tabular-nums text-black/55">
                          {formatCount(row.visitors)} visitors
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-6 font-sans text-base text-black/55">
                    No location data yet. Check back after a bit of traffic.
                  </p>
                )}
              </section>
            </>
          ) : null}
          {unlocked && !stats ? (
            <p className="mt-16 max-w-xl font-sans text-base leading-relaxed text-black/55">
              Analytics just went live. Visitor and location counts will show
              here once they can be read from Vercel.
            </p>
          ) : null}
        </div>
      </div>
      <Footer />
    </main>
  );
}
