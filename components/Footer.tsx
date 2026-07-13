import { site } from "@/lib/data";

export function Footer() {
  return (
    <footer className="bg-background px-9 py-10 lg:px-6">
      <div className="mx-auto w-full max-w-7xl">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">
          ( {site.credit} )
        </p>
      </div>
    </footer>
  );
}
