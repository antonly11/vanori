"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { valueDomains, type ValueDomainId, type ValuesProfile } from "@/lib/employee/values";
import { deletePrototypeProfile, getPrototypeStartScreen, getPrototypeStorage, readPrototypeProfile, writePrototypeProfile, type PrototypeProfile } from "@/lib/employee/prototype-profile";
import { createDayScreen, getActiveMenu, type DayScreen, type ExperienceScreen, type EmployeeMenuItem } from "@/lib/employee/experience-navigation";
import { WellbeingCheckIn } from "./wellbeing-check-in";
import { ValuesIntroduction } from "./values/values-introduction";
import { ValuesOnboarding } from "./values/values-onboarding";
import { ValuesOverview } from "./values/values-overview";
import { useExperienceNavigation } from "./use-experience-navigation";
import { EmployeeMenu } from "./employee-menu";
import { ActionsOverview } from "./actions-overview";

const subscribeToHydration = () => () => {};

export function EmployeeExperience() {
  // The server cannot read browser storage. Mount the session after hydration
  // so the first screen matches the saved status without flashing the home form.
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  return hydrated ? <EmployeeSession /> : <main id="main-content" className="mx-auto max-w-content py-12 text-center text-muted" aria-busy="true"><p role="status">Öppnar din plats…</p></main>;
}

function EmployeeSession() {
  const [local, setLocal] = useState(() => readPrototypeProfile(getPrototypeStorage()));
  const { profile, onboarding } = local.record;
  const [deleteError, setDeleteError] = useState(false);
  const [lastDay, setLastDay] = useState(createDayScreen);
  const navigation = useExperienceNavigation(getPrototypeStartScreen(onboarding));
  const { screen } = navigation;
  const day = screen.view === "day" ? screen : lastDay;
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    contentRef.current?.querySelector<HTMLHeadingElement>("h1")?.focus();
  }, [screen]);

  function saveRecord(record: PrototypeProfile) {
    setLocal({ record, available: writePrototypeProfile(getPrototypeStorage(), record) });
  }

  function setProfile(next: ValuesProfile) {
    saveRecord({ ...local.record, profile: next });
  }

  function deferOnboarding() {
    if (onboarding === "new") saveRecord({ ...local.record, onboarding: "later" });
    home();
  }

  function finishOnboarding() {
    if (screen.view !== "setup") return;
    if (!screen.editing) saveRecord({ ...local.record, onboarding: "complete" });
    navigate(screen.returnTo);
  }

  function deleteProfile() {
    if (!deletePrototypeProfile(getPrototypeStorage())) { setDeleteError(true); return; }
    window.location.reload();
  }

  function navigate(next: ExperienceScreen) {
    if (screen.view === "day" && screen.step !== "wellbeing") setLastDay(screen);
    if (next.view === "day" && next.step !== "wellbeing") setLastDay(next);
    navigation.navigate(next);
  }

  function editDomain(index: number, returnTo: DayScreen | { view: "values" | "actions" }) {
    navigate({ view: "setup", screen: index * 2, editing: true, returnTo });
  }

  function editFromDay(domain: ValueDomainId) {
    editDomain(valueDomains.findIndex((item) => item.id === domain), day);
  }

  function home() {
    navigate(createDayScreen());
  }

  function selectMenu(item: EmployeeMenuItem) {
    if (item === "day") deferOnboarding();
    else navigate({ view: item });
    // A mobile menu may close without changing the already active screen.
    contentRef.current?.querySelector<HTMLHeadingElement>("h1")?.focus();
  }

  const canResume = lastDay.step !== "wellbeing" && lastDay.step !== "done" && !(screen.view === "day" && screen.step !== "wellbeing");

  function newCheckIn() {
    const initial = createDayScreen();
    // A different mood starts a different flow. Do not resume or reopen old
    // day screens after their answers have been reset; keep the private profile.
    if (lastDay.step !== "wellbeing") navigation.reset(screen.view === "day" && screen.step === "wellbeing" ? screen : initial);
    setLastDay(initial);
  }

  return <div className="grid items-start gap-6 lg:gap-0">
    <EmployeeMenu active={getActiveMenu(screen)} onSelect={selectMenu} onResume={canResume ? () => navigate(lastDay) : undefined} />
    <main ref={contentRef} id="main-content" tabIndex={-1} className="mx-auto w-full min-w-0 max-w-content outline-none">
    {screen.view === "introduction" && <ValuesIntroduction onStart={() => navigate({ view: "setup", screen: 0, editing: false, returnTo: { view: "values" } })} onLater={deferOnboarding} />}
    {screen.view === "setup" && <ValuesOnboarding profile={profile} screen={screen.screen} editing={screen.editing} onChange={setProfile} onScreen={(next) => navigate({ ...screen, screen: next })} onBack={navigation.canGoBack ? navigation.back : undefined} onFinish={finishOnboarding} onLater={deferOnboarding} />}
    {screen.view === "values" && <ValuesOverview profile={profile} onEdit={(index) => editDomain(index, { view: "values" })} onDay={deferOnboarding} onIntroduction={() => navigate({ view: "introduction" })} onDelete={deleteProfile} deleteError={deleteError} />}
    {screen.view === "actions" && <ActionsOverview profile={profile} onChange={(domain, text) => setProfile({ ...profile, [domain]: { ...profile[domain], action: text.slice(0, 1000) } })} onDay={deferOnboarding} onValues={() => navigate({ view: "values" })} />}
    <div hidden={screen.view !== "day"}>
      <WellbeingCheckIn profile={profile} screen={day} onNavigate={navigate} onBack={navigation.back} onNewCheckIn={newCheckIn} onRestart={() => { const initial = createDayScreen(); setLastDay(initial); navigation.reset(initial); }} onEditValue={editFromDay} onSaveDirection={(domain, direction) => setProfile({ ...profile, [domain]: { ...profile[domain], direction } })} />
    </div>
    <p className="mt-5 flex items-start justify-center gap-2 text-body text-muted">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="mt-1 size-4 shrink-0" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
      <span>{local.available ? "Lokal prototyp · Bullseye sparas i denna webbläsare. Måendesvar är tillfälliga." : "Lokal lagring fungerar inte. Dina svar gäller bara under detta besök."}</span>
    </p>
    </main>
  </div>;
}
