import { alignmentLevels, createEmptyValuesProfile, valueDomains, type ValuesProfile } from "./values";
import { createDayScreen, type ExperienceScreen } from "./experience-navigation";

// Local demo only. Never use this device-wide store as an authenticated account.
// Only Bullseye and its onboarding status are persisted, never daily check-ins.
export const prototypeProfileKey = "vanori.prototype.bullseye.v1";
export type PrototypeProfile = { version: 1; onboarding: "new" | "later" | "complete"; profile: ValuesProfile };
type StorageAccess = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function createPrototypeProfile(): PrototypeProfile {
  return { version: 1, onboarding: "new", profile: createEmptyValuesProfile() };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parsePrototypeProfile(raw: string | null): PrototypeProfile {
  const empty = createPrototypeProfile();
  if (!raw) return createPrototypeProfile();
  try {
    const data: unknown = JSON.parse(raw);
    if (!isObject(data) || data.version !== 1 || (data.onboarding !== "new" && data.onboarding !== "later" && data.onboarding !== "complete") || !isObject(data.profile)) return createPrototypeProfile();
    for (const { id } of valueDomains) {
      const answer = data.profile[id];
      if (!isObject(answer)) return createPrototypeProfile();
      for (const [field, limit] of [["reflection", 350], ["direction", 180], ["barrier", 350], ["action", 1000]] as const) {
        const text = answer[field];
        if (typeof text !== "string" || text.length > limit) return createPrototypeProfile();
        empty.profile[id][field] = text;
      }
      const alignment = answer.alignment;
      if (alignment === null) empty.profile[id].alignment = null;
      else {
        const valid = alignmentLevels.find((level) => level === alignment);
        if (valid === undefined) return createPrototypeProfile();
        empty.profile[id].alignment = valid;
      }
    }
    empty.onboarding = data.onboarding;
    return empty;
  } catch {
    return createPrototypeProfile();
  }
}

export function getPrototypeStartScreen(onboarding: PrototypeProfile["onboarding"]): ExperienceScreen {
  return onboarding === "complete" ? createDayScreen() : { view: "introduction" };
}

export function readPrototypeProfile(storage: StorageAccess | null) {
  try {
    if (storage) return { record: parsePrototypeProfile(storage.getItem(prototypeProfileKey)), available: true };
  } catch { /* Storage may be blocked. Continue with an in-memory demo. */ }
  return { record: createPrototypeProfile(), available: false };
}

export function writePrototypeProfile(storage: StorageAccess | null, record: PrototypeProfile): boolean {
  try {
    if (!storage) return false;
    // Rebuild the allowed record; extra input properties never enter storage.
    storage.setItem(prototypeProfileKey, JSON.stringify(parsePrototypeProfile(JSON.stringify(record))));
    return true;
  } catch {
    return false;
  }
}

export function deletePrototypeProfile(storage: StorageAccess | null): boolean {
  try {
    if (!storage) return false;
    storage.removeItem(prototypeProfileKey);
    return true;
  } catch {
    return false;
  }
}

export function getPrototypeStorage(): StorageAccess | null {
  try { return window.localStorage; } catch { return null; }
}
