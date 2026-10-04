"use client";

import { useEffect, useId, useReducer, useRef, type FormEvent } from "react";
import { positiveCategories, stressCategories, type StressCategoryId } from "@/lib/employee/stress-categories";
import { dailyNeeds, getDailySupport, getDailyValueDomain } from "@/lib/employee/daily-needs";
import { getCheckInHeading, getFollowUpStep, getSupportStep, type CheckInStep } from "@/lib/employee/check-in-flow";
import { checkInReducer, createCheckInAnswers, getActionContext } from "@/lib/employee/check-in-state";
import { workloadFollowUps } from "@/lib/employee/workload-flow";
import { getChosenValue, getValueConnectionContext } from "@/lib/employee/value-connection";
import type { SmallAction } from "@/lib/employee/support-plan";
import type { DayScreen } from "@/lib/employee/experience-navigation";
import type { ValueDomainId, ValuesProfile } from "@/lib/employee/values";
import { PrimaryButton } from "@/components/ui/primary-button";
import { TextButton, SecondaryButton } from "@/components/ui/secondary-button";
import { wellbeingLevels } from "./wellbeing-levels";
import { WellbeingSelector } from "./wellbeing-selector";
import { StressorSelector } from "./stressor-selector";
import { SupportPreview } from "./support-preview";
import { WorkloadQuestions } from "./workload-questions";
import { ValueConnection } from "./value-connection";
import { ActionSuggestion } from "./action-suggestion";
import { FocusChoice } from "./focus-choice";

type Props = {
  profile: ValuesProfile;
  screen: DayScreen;
  onNavigate: (screen: DayScreen) => void;
  onBack: () => void;
  onRestart: () => void;
  onEditValue: (domain: ValueDomainId) => void;
  onSaveDirection: (domain: ValueDomainId, direction: string) => void;
};

export function WellbeingCheckIn({ profile, screen, onNavigate, onBack, onRestart, onEditValue, onSaveDirection }: Props) {
  const [answers, dispatch] = useReducer(checkInReducer, undefined, createCheckInAnswers);
  const { step, area, need } = screen;
  const { level, workload } = answers;
  const remainingAreas = answers.supportCategories.filter((item) => !answers.exploredAreas.includes(item) && item !== area);
  const remainingNeeds = answers.needs.filter((item) => !answers.exploredNeeds.includes(item) && item !== need);
  const isReflection = step === "reflection";
  const isExploration = step === "explore";
  const isCategoryStep = step === "support" || isExploration || isReflection;
  const isWorkloadStep = step === "workload-situation" || step === "workload-detail";
  const selectedCategories = isReflection ? answers.reflectionCategories : answers.supportCategories;
  const selectedCount = isExploration ? answers.needs.length : selectedCategories.length;
  const selectedLabel = wellbeingLevels.find((item) => item.value === level)?.label;
  const domain = area && !answers.skippedValues.includes(area) ? answers.domains[area] ?? getValueConnectionContext([area], workload).suggestedDomain : null;
  const actionKey = getActionContext(area, workload, domain, need);
  const commentId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => { headingRef.current?.focus(); }, [screen]);

  function go(next: CheckInStep, nextArea = area, nextNeed = need, action?: SmallAction) {
    onNavigate({ view: "day", step: next, area: nextArea, need: nextNeed, ...(action ? { action } : {}) });
  }

  function beginArea(nextArea: StressCategoryId) {
    go(getSupportStep([nextArea]), nextArea, null);
  }

  function finishArea(exploreAnother: boolean) {
    if (need) {
      dispatch({ type: "finish-need", need });
      if (exploreAnother && remainingNeeds.length === 1) go("daily-support", null, remainingNeeds[0]);
      else go(exploreAnother && remainingNeeds.length > 1 ? "daily-focus" : "done", null, null);
      return;
    }
    if (area) dispatch({ type: "finish-area", area });
    if (exploreAnother && remainingAreas.length === 1) beginArea(remainingAreas[0]);
    else go(exploreAnother && remainingAreas.length > 1 ? "support-focus" : "done", null, null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === "wellbeing" && level) go(getFollowUpStep(level), null, null);
    else if (step === "support" && selectedCount > 0) {
      if (answers.supportCategories.length === 1) beginArea(answers.supportCategories[0]);
      else go("support-focus", null, null);
    } else if (isExploration && selectedCount > 0) {
      go(answers.needs.length === 1 ? "daily-support" : "daily-focus", null, answers.needs.length === 1 ? answers.needs[0] : null);
    } else if (isReflection && selectedCount > 0) go("done", null, null);
  }

  function chooseAction(action: SmallAction) {
    dispatch({ type: "action", key: actionKey, action });
  }

  const focusChoices = answers.supportCategories.filter((item) => !answers.exploredAreas.includes(item));
  const dailyDomain = need ? getDailyValueDomain(need) : null;
  const dailyValue = getChosenValue(profile, dailyDomain);

  return <>
    <div className="mb-6 sm:mb-8 sm:text-center">
      <p className="mb-3 text-xs font-medium tracking-[0.22em] text-accent">EN STUND FÖR DIG</p>
      <h1 ref={headingRef} tabIndex={-1} className="max-w-xl break-words text-[2rem] leading-[1.15] font-medium tracking-[-0.045em] text-foreground focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:mx-auto sm:text-[2.75rem]">
        {step === "workload-detail" && workload.issue ? workloadFollowUps[workload.issue].question : getCheckInHeading(step, level)}
      </h1>
      {step !== "wellbeing" && step !== "done" && <div className="mt-3 flex items-center justify-between gap-3 text-sm">
        <TextButton onClick={onBack}><span aria-hidden="true">← </span>Tillbaka</TextButton>
        <p className="text-muted">{selectedLabel}</p>
      </div>}
    </div>
    <div className="min-w-0 rounded-3xl border border-outline bg-surface p-4 shadow-[0_16px_64px_-32px_#00000080] sm:p-6">
      {step === "wellbeing" || isCategoryStep ? <form onSubmit={handleSubmit}>
        {step === "wellbeing" ? <WellbeingSelector value={level} onChange={(next) => dispatch({ type: "level", level: next })} />
          : isExploration ? <StressorSelector value={answers.needs} onChange={(needs) => dispatch({ type: "needs", needs })} categories={dailyNeeds} />
          : <StressorSelector value={selectedCategories} onChange={(categories) => dispatch({ type: isReflection ? "reflection-categories" : "support-categories", categories })} categories={isReflection ? positiveCategories : stressCategories} />}
        {isReflection && answers.reflectionCategories.includes("other") && <div className="mt-5">
          <label htmlFor={commentId} className="block text-sm font-medium">Kort kommentar</label>
          <p id={`${commentId}-hint`} className="mt-1 text-xs text-muted">Valfritt · max 200 tecken</p>
          <textarea id={commentId} aria-describedby={`${commentId}-hint`} value={answers.reflectionComment} onChange={(event) => dispatch({ type: "reflection-comment", text: event.target.value })} maxLength={200} rows={3} className="text-field mt-2 min-h-28" />
        </div>}
        <div className="mt-5 sm:mt-6"><PrimaryButton disabled={step === "wellbeing" ? level === null : selectedCount === 0} showArrow={!isReflection}>
          {step === "wellbeing" ? "Fortsätt" : step === "support" ? "Gå vidare till stöd" : isExploration ? "Visa ett litet steg" : "Klart för idag"}
        </PrimaryButton></div>
        {isExploration && <TextButton fullWidth onClick={() => go("support", null, null)}>Jag vill ha stöd</TextButton>}
        {isCategoryStep && <TextButton fullWidth onClick={() => { dispatch({ type: isReflection ? "clear-reflection" : isExploration ? "clear-needs" : "clear-support" }); go("done", null, null); }}>{isReflection || isExploration ? "Hoppa över" : "Avsluta för nu"}</TextButton>}
      </form>
      : step === "support-focus" ? focusChoices.length > 0
        ? <FocusChoice key={`areas-${answers.exploredAreas.join("-")}`} choices={stressCategories.filter((category) => focusChoices.includes(category.id))} initial={null} onContinue={beginArea} />
        : <><p>Du har utforskat dina valda områden.</p><TextButton fullWidth onClick={() => go("support", null, null)}>Välj ett område igen</TextButton></>
      : step === "daily-focus" ? remainingNeeds.length > 0 ? <FocusChoice choices={dailyNeeds.filter((item) => remainingNeeds.includes(item.id))} initial={need} onContinue={(next) => go("daily-support", null, next)} /> : <><p>Du har utforskat dina valda behov.</p><TextButton fullWidth onClick={() => go("explore", null, null)}>Välj ett behov igen</TextButton></>
      : step === "daily-support" && need ? <>
        <p className="mb-4 text-sm text-muted">{dailyNeeds.find((item) => item.id === need)?.label}</p>
        <ActionSuggestion suggestions={getDailySupport(need)} ownActions={dailyValue?.actions ?? []} selection={answers.actions[actionKey] ?? null} onSelect={chooseAction} onTry={(action) => go("support-preview", null, need, action)} />
        {dailyValue && <aside className="mt-4 rounded-xl border border-outline p-3"><p className="text-xs text-muted">Din riktning</p><p className="mt-1 break-words text-sm leading-6">{dailyValue.direction}</p></aside>}
        <TextButton fullWidth onClick={() => finishArea(false)}>Klart för idag</TextButton>
        <TextButton fullWidth onClick={() => go("support", null, null)}>Jag vill ha mer stöd</TextButton>
        <p className="mt-3 text-xs leading-5 text-muted">Utkast för psykologgranskning.</p>
      </>
      : step === "workload-detail-focus" && workload.issue ? <FocusChoice choices={workloadFollowUps[workload.issue].choices.filter((choice) => workload.details.includes(choice.id))} initial={workload.detail} onContinue={(detail) => { dispatch({ type: "workload-focus", detail }); go("value-connection"); }} />
      : isWorkloadStep ? <WorkloadQuestions stage={step === "workload-situation" ? 0 : 1} answer={workload} hasOtherAreas={answers.supportCategories.length > 1}
        onIssue={(issue) => dispatch({ type: "workload-issue", issue })} onDetail={(details) => dispatch({ type: "workload-details", details })} onComment={(text) => dispatch({ type: "workload-comment", text })}
        onContinue={() => go(step === "workload-situation" ? "workload-detail" : workload.details.length > 1 ? "workload-detail-focus" : "value-connection")}
        onSkip={() => { dispatch({ type: "skip-workload", stage: step === "workload-situation" ? 0 : 1 }); go("value-connection"); }} onExit={() => go("done", null, null)} />
      : step === "value-connection" ? <ValueConnection profile={profile} area={area ?? "other"} workload={workload} selected={area ? answers.domains[area] ?? null : null} skipValue={area ? answers.skippedValues.includes(area) : false}
        selection={answers.actions[actionKey] ?? null} onAction={chooseAction}
        onSelect={(next) => { if (area) dispatch({ type: "domain", area, domain: next }); }}
        onSave={(next, direction) => { onSaveDirection(next, direction); if (area) dispatch({ type: "domain", area, domain: next }); }}
        onEdit={onEditValue} onTry={(action) => go("support-preview", area, null, action)} onSkip={() => { if (area) dispatch({ type: "skip-value", area }); }} />
      : step === "support-preview" ? <SupportPreview action={screen.action ?? null} onExit={() => finishArea(false)} onOther={() => finishArea(true)} hasOther={need ? remainingNeeds.length > 0 : remainingAreas.length > 0} otherLabel={need ? "Utforska ett annat valt behov" : undefined} />
      : step === "done" ? <div className="py-3 text-center sm:py-6">
        <span aria-hidden="true" className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6"><path d="m5 12 4 4L19 6" /></svg></span>
        <p className="text-base">Tack för din stund.</p>
        {remainingAreas.length > 0 && <div className="mt-4"><p className="text-sm leading-6 text-muted">Dina val finns kvar om du vill fortsätta.</p><TextButton onClick={() => remainingAreas.length === 1 ? beginArea(remainingAreas[0]) : go("support-focus", null, null)}>Utforska ett annat valt område</TextButton></div>}
        {remainingNeeds.length > 0 && <TextButton fullWidth onClick={() => go(remainingNeeds.length === 1 ? "daily-support" : "daily-focus", null, remainingNeeds.length === 1 ? remainingNeeds[0] : null)}>Utforska ett annat valt behov</TextButton>}
        <TextButton onClick={() => { dispatch({ type: "restart" }); onRestart(); }}>Till startsidan</TextButton>
      </div>
      : <div className="space-y-3">
        <PrimaryButton type="button" showArrow={step !== "positive"} onClick={() => go(step === "positive" ? "done" : "explore", null, null)}>{step === "positive" ? "Klart för idag" : "Utforska min dag"}</PrimaryButton>
        <SecondaryButton onClick={() => go(step === "positive" ? "reflection" : "done", null, null)}>{step === "positive" ? "Vad har bidragit?" : "Klart för idag"}</SecondaryButton>
        <TextButton fullWidth onClick={() => go("support", null, null)}>{step === "positive" ? "Jag vill ändå ha stöd" : "Jag vill ha stöd"}</TextButton>
      </div>}
    </div>
  </>;
}
