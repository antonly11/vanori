import { EmployeeExperience } from "@/components/employee/employee-experience";

export default function Home() {
  return (
    <div className="relative isolate flex min-h-svh flex-col overflow-x-clip">
      <div aria-hidden="true" className="ambient-glow pointer-events-none absolute inset-0 -z-10" />
      <a href="#main-content" className="skip-link">Hoppa till innehållet</a>
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-10 sm:py-6">
        <div className="flex items-center gap-3" aria-label="Vanori">
          <svg aria-hidden="true" viewBox="8 10 48 54" className="size-8 text-accent" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M18 60C21 53 20 47 17 43C13 36 13 30 17 26C21 20 29 18 35 20C40 22.5 42 26.5 41.5 29.5C40.8 32 44 35 47 38C49 40 47.5 41 45 41.8C42.8 42.5 43.3 44.2 45 45.6C46.4 46.7 43.7 47.2 42.2 47.7C44.5 48.5 44.3 49.8 42.8 50.7C41.5 51.5 43.4 54.2 41 55.1C38.6 56 34.2 53.2 31 52.8C27.5 52.4 26.5 57 28 62"
            />
            <path d="M14 26.5C12 24.2 20 21.9 25 24.2C33 28.2 13 34 18 26.5C22 20.5 39 21.3 32 26.5C26 32.5 19 21.7 25 21.3C34 20.9 22 29.8 25 34C29 37.3 35 32.7 32 30.1C28 28.2 24 34 31 35.3" strokeWidth="1.5" />
            <path d="M30 33C36 29 42 32 40 35C37 38 32 34 35 32C40 29 44 33 43 36" strokeWidth="1.5" />
          </svg>
          <span className="text-2xl font-medium tracking-[-0.025em]">vanori</span>
        </div>
        <span className="rounded-full border border-outline px-3 py-1.5 text-xs tracking-wide text-muted">Förhandsvisning</span>
      </header>
      <main id="main-content" tabIndex={-1} className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-8 pt-5 outline-none sm:px-10 sm:pb-12 sm:pt-10">
        <EmployeeExperience />
        <p className="mt-5 flex items-start justify-center gap-2 text-sm leading-6 text-muted">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="mt-1 size-4 shrink-0" stroke="currentColor" strokeWidth="1.5">
            <rect x="5" y="10" width="14" height="11" rx="3" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
          </svg>
          <span>Förhandsvisning · Svaren försvinner när sidan laddas om.</span>
        </p>
      </main>
      <footer className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 border-t border-outline px-4 py-4 text-xs text-muted sm:px-10">
        <span>Lite mer utrymme för dig.</span>
        <span>Vanori · Välmående på jobbet</span>
      </footer>
    </div>
  );
}
