export type CountryStat = {
  country: string;
  visitors: number;
  pageviews: number;
};

export type SiteAnalytics = {
  visitors: number;
  pageviews: number;
  countries: CountryStat[];
};

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  CA: "Canada",
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
  NL: "Netherlands",
  ES: "Spain",
  IT: "Italy",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  IE: "Ireland",
  AU: "Australia",
  NZ: "New Zealand",
  JP: "Japan",
  KR: "South Korea",
  CN: "China",
  IN: "India",
  SG: "Singapore",
  BR: "Brazil",
  MX: "Mexico",
  AR: "Argentina",
  CL: "Chile",
  PT: "Portugal",
  CH: "Switzerland",
  AT: "Austria",
  BE: "Belgium",
  PL: "Poland",
  CZ: "Czechia",
  IL: "Israel",
  AE: "United Arab Emirates",
  ZA: "South Africa",
};

export function countryName(code: string) {
  return COUNTRY_NAMES[code] ?? code;
}

function teamParam() {
  const explicit = process.env.VERCEL_ANALYTICS_TEAM_ID;
  if (explicit) return explicit;
  const org = process.env.VERCEL_ORG_ID;
  if (org?.startsWith("team_")) return org;
  return null;
}

async function queryAnalytics(
  path: "visits/count" | "visits/aggregate",
  extra: Record<string, string> = {},
) {
  const token =
    process.env.VERCEL_ANALYTICS_TOKEN ?? process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!token || !projectId) return null;

  const url = new URL(`https://api.vercel.com/v1/query/web-analytics/${path}`);
  url.searchParams.set("projectId", projectId);
  const teamId = teamParam();
  if (teamId) url.searchParams.set("teamId", teamId);
  for (const [key, value] of Object.entries(extra)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 300 },
  });

  if (!response.ok) return null;
  return response.json();
}

export async function getSiteAnalytics(): Promise<SiteAnalytics | null> {
  const until = new Date();
  const since = new Date(until);
  since.setUTCDate(since.getUTCDate() - 30);

  const [totals, byCountry] = await Promise.all([
    queryAnalytics("visits/count"),
    queryAnalytics("visits/aggregate", {
      since: since.toISOString(),
      until: until.toISOString(),
      by: "country",
      limit: "12",
    }),
  ]);

  if (!totals && !byCountry) return null;

  const countries = Array.isArray(byCountry?.data)
    ? byCountry.data
        .map((row: { country?: string; visitors?: number; pageviews?: number }) => ({
          country: String(row.country ?? ""),
          visitors: Number(row.visitors ?? 0),
          pageviews: Number(row.pageviews ?? 0),
        }))
        .filter((row: CountryStat) => row.country)
    : [];

  return {
    visitors: Number(totals?.data?.visitors ?? 0),
    pageviews: Number(totals?.data?.pageviews ?? 0),
    countries,
  };
}
