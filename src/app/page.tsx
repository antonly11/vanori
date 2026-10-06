import { VanoriLogo } from "@/components/ui/vanori-logo";
import { EmployeeExperience } from "@/components/employee/employee-experience";

export default function Home() {
  return (
    <div className="relative isolate flex min-h-svh flex-col overflow-x-clip">
      <div aria-hidden="true" className="ambient-glow pointer-events-none absolute inset-0 -z-10" />
      <a href="#main-content" className="skip-link">Hoppa till innehållet</a>
      <header className="mx-auto flex w-full max-w-shell items-center justify-between px-4 py-4 sm:px-10 sm:py-6 lg:px-28">
        <div className="flex items-center gap-3" aria-label="Vanori">
          <VanoriLogo />
          <span className="text-2xl font-medium tracking-[-0.025em]">vanori</span>
        </div>
        <span className="rounded-full border border-outline px-3 py-1.5 text-xs tracking-wide text-muted">Förhandsvisning</span>
      </header>
      <div className="mx-auto w-full max-w-shell flex-1 px-4 pb-8 pt-5 sm:px-10 sm:pb-12 sm:pt-10">
        <EmployeeExperience />
      </div>
      <footer className="mx-auto flex w-full max-w-shell items-center justify-between gap-4 border-t border-outline px-4 py-4 text-xs text-muted sm:px-10 lg:px-28">
        <span>Lite mer utrymme för dig.</span>
        <span>Vanori · Välmående på jobbet</span>
      </footer>
    </div>
  );
}
