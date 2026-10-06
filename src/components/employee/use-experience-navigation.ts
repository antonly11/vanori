"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { appendScreen, createScreenHistory, readHistoryMarker, restoreScreen, type ExperienceScreen } from "@/lib/employee/experience-navigation";

function historyState(session: string, entry: number) {
  const current: unknown = window.history.state;
  return { ...(current && typeof current === "object" ? current : {}), vanori: { session, entry } };
}

export function useExperienceNavigation(initialScreen?: ExperienceScreen) {
  const [history, setHistory] = useState(() => createScreenHistory(initialScreen));
  const current = useRef(history);
  const session = useRef("");
  const goingBack = useRef(false);
  const resetting = useRef(false);
  const queuedScreens = useRef<ExperienceScreen[]>([]);

  const pushScreen = useCallback((screen: ExperienceScreen) => {
    const previous = current.current.entries[current.current.index].screen;
    if (previous.view === screen.view && JSON.stringify(previous) === JSON.stringify(screen)) return;
    current.current = appendScreen(current.current, screen);
    window.history.pushState(historyState(session.current, current.current.entries[current.current.index].id), "");
    setHistory(current.current);
  }, []);

  useEffect(() => {
    if (!session.current) session.current = crypto.randomUUID();
    window.history.replaceState(historyState(session.current, current.current.entries[current.current.index].id), "");
    function onPopState(event: PopStateEvent) {
      goingBack.current = false;
      if (resetting.current) {
        resetting.current = false;
        window.history.replaceState(historyState(session.current, 0), "");
        const queued = queuedScreens.current;
        queuedScreens.current = [];
        for (const next of queued) pushScreen(next);
        return;
      }
      const marker = readHistoryMarker(event.state);
      if (!marker || marker.session !== session.current) return;
      current.current = restoreScreen(current.current, marker.entry);
      setHistory(current.current);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [pushScreen]);

  function navigate(screen: ExperienceScreen) {
    if (resetting.current) queuedScreens.current.push(screen);
    else pushScreen(screen);
  }

  function back() {
    if (current.current.index === 0 || goingBack.current || resetting.current) return;
    goingBack.current = true;
    window.history.back();
  }

  function reset(screen: ExperienceScreen) {
    // Old browser entries cannot reopen a completed check-in after its answers
    // are cleared. Reloading also starts a new, empty prototype session.
    const distance = current.current.index;
    session.current = crypto.randomUUID();
    current.current = createScreenHistory(screen);
    goingBack.current = false;
    if (distance > 0) {
      resetting.current = true;
      window.history.go(-distance);
    } else window.history.replaceState(historyState(session.current, 0), "");
    setHistory(current.current);
  }

  return { screen: history.entries[history.index].screen, canGoBack: history.index > 0, navigate, back, reset };
}
