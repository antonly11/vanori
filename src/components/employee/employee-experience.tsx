"use client";

import { useEffect, useRef, useState } from "react";
import { createEmptyValuesProfile, valueDomains, type ValueDomainId } from "@/lib/employee/values";
import { createDayScreen, type DayScreen, type ExperienceScreen } from "@/lib/employee/experience-navigation";
import { WellbeingCheckIn } from "./wellbeing-check-in";
import { ValuesIntroduction } from "./values/values-introduction";
import { ValuesOnboarding } from "./values/values-onboarding";
import { ValuesOverview } from "./values/values-overview";
import { useExperienceNavigation } from "./use-experience-navigation";

export function EmployeeExperience() {
  // Prototype only: private answers remain in memory for this visit.
  const [profile, setProfile] = useState(createEmptyValuesProfile);
  const [lastDay, setLastDay] = useState(createDayScreen);
  const navigation = useExperienceNavigation();
  const { screen } = navigation;
  const day = screen.view === "day" ? screen : lastDay;
  const dayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (screen.view === "day") dayRef.current?.querySelector<HTMLHeadingElement>("h1")?.focus();
  }, [screen]);

  function navigate(next: ExperienceScreen) {
    if (screen.view === "day") setLastDay(screen);
    if (next.view === "day") setLastDay(next);
    navigation.navigate(next);
  }

  function editDomain(index: number, returnTo: DayScreen | { view: "values" }) {
    navigate({ view: "setup", screen: index * 2, editing: true, returnTo });
  }

  function editFromDay(domain: ValueDomainId) {
    editDomain(valueDomains.findIndex((item) => item.id === domain), day);
  }

  return <>
    <nav aria-label="Din meny" className="mb-7 flex self-start rounded-full border border-outline p-1 text-sm sm:mb-9">
      {([{ id: "day", label: "Min dag" }, { id: "values", label: "Mina värderingar" }] as const).map((item) => {
        const active = screen.view === item.id || (item.id === "values" && screen.view === "setup");
        return <button key={item.id} type="button" onClick={() => navigate(item.id === "day" ? day : { view: "values" })} aria-current={active ? "page" : undefined} className={`min-h-11 rounded-full px-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${active ? "bg-accent text-accent-ink" : "text-muted hover:text-foreground"}`}>{item.label}</button>;
      })}
    </nav>
    {screen.view === "introduction" && <ValuesIntroduction onStart={() => navigate({ view: "setup", screen: 0, editing: false, returnTo: { view: "values" } })} onLater={() => navigate(day)} />}
    {screen.view === "setup" && <ValuesOnboarding profile={profile} screen={screen.screen} editing={screen.editing} onChange={setProfile} onScreen={(next) => navigate({ ...screen, screen: next })} onBack={navigation.back} onFinish={() => navigate(screen.returnTo)} />}
    {screen.view === "values" && <ValuesOverview profile={profile} onEdit={(index) => editDomain(index, { view: "values" })} onDay={() => navigate(day)} />}
    <div ref={dayRef} hidden={screen.view !== "day"}>
      <WellbeingCheckIn profile={profile} screen={day} onNavigate={navigate} onBack={navigation.back} onRestart={() => { const initial = createDayScreen(); setLastDay(initial); navigation.reset(initial); }} onEditValue={editFromDay} onSaveDirection={(domain, direction) => setProfile((current) => ({ ...current, [domain]: { ...current[domain], direction } }))} />
    </div>
  </>;
}
