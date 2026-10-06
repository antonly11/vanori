import test from "node:test";
import assert from "node:assert/strict";
import { loadTypeScript as load, plain } from "./helpers/load-typescript.mjs";

const profile = load("src/lib/employee/prototype-profile.ts");
const connections = load("src/lib/employee/value-connection.ts");
const workload = load("src/lib/employee/workload-flow.ts");

function storage() {
  const entries = new Map();
  return { entries, getItem: (key) => entries.get(key) ?? null, setItem: (key, value) => entries.set(key, value), removeItem: (key) => entries.delete(key) };
}

test("first visit, interrupted drafts and deferral start with the welcome screen; only completion enters the day", () => {
  const local = storage();
  const first = profile.readPrototypeProfile(local).record;
  const welcome = { view: "introduction" };
  assert.deepEqual(plain(profile.getPrototypeStartScreen(first.onboarding)), welcome);
  first.profile.work.direction = "En påhittad riktning";
  profile.writePrototypeProfile(local, first);
  assert.deepEqual(plain(profile.getPrototypeStartScreen(profile.readPrototypeProfile(local).record.onboarding)), welcome);
  profile.writePrototypeProfile(local, { ...first, onboarding: "later" });
  assert.deepEqual(plain(profile.getPrototypeStartScreen(profile.readPrototypeProfile(local).record.onboarding)), welcome);
  assert.equal(profile.readPrototypeProfile(local).record.profile.work.direction, first.profile.work.direction);
  profile.writePrototypeProfile(local, { ...first, onboarding: "complete" });
  assert.equal(profile.getPrototypeStartScreen(profile.readPrototypeProfile(local).record.onboarding).step, "wellbeing");
});

test("saved and edited Bullseye feeds the existing workload value connection after a new visit", () => {
  const local = storage();
  const record = profile.createPrototypeProfile();
  record.onboarding = "complete";
  record.profile.work.direction = "Jag vill arbeta med omtanke.";
  record.profile.work.action = "Ta en promenad\nFråga en kollega";
  record.profile.work.alignment = 4;
  assert(profile.writePrototypeProfile(local, record));
  let restored = profile.readPrototypeProfile(local).record;
  const answer = workload.changeWorkloadDetails({ ...workload.createEmptyWorkloadAnswer(), issue: "amount" }, ["volume"]);
  const domain = connections.getValueConnectionContext(["workload"], answer).suggestedDomain;
  assert.equal(connections.getChosenValue(restored.profile, domain).direction, record.profile.work.direction);
  assert.deepEqual(plain(connections.getChosenValue(restored.profile, domain).actions), ["Ta en promenad", "Fråga en kollega"]);
  restored.profile.work.direction = "En ändrad riktning";
  profile.writePrototypeProfile(local, restored);
  restored = profile.readPrototypeProfile(local).record;
  assert.equal(connections.getChosenValue(restored.profile, domain).direction, "En ändrad riktning");
});

test("invalid or incompatible records reset completely and extra daily answers are not persisted", () => {
  const empty = profile.createPrototypeProfile();
  const corrupted = profile.createPrototypeProfile();
  corrupted.profile.work.direction = "Ska inte återställas delvis";
  corrupted.profile.health.alignment = 99;
  for (const raw of ["{broken", JSON.stringify({ ...empty, version: 2 }), JSON.stringify(corrupted), JSON.stringify({ ...empty, profile: {} }), JSON.stringify({ ...empty, onboarding: "invalid" })]) {
    assert.deepEqual(plain(profile.parsePrototypeProfile(raw)), plain(empty));
  }
  const local = storage();
  profile.writePrototypeProfile(local, { ...empty, dailyAnswers: "NEVER SAVE", profile: { ...empty.profile, work: { ...empty.profile.work, secretExtraField: "NEVER SAVE" } } });
  assert(!local.getItem(profile.prototypeProfileKey).includes("NEVER SAVE"));
  assert.deepEqual([...local.entries.keys()], [profile.prototypeProfileKey]);
});

test("blocked storage falls back without throwing; deletion removes only the prototype profile", () => {
  const blocked = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); }, removeItem() { throw new Error("blocked"); } };
  assert.equal(profile.readPrototypeProfile(blocked).available, false);
  assert.equal(profile.writePrototypeProfile(blocked, profile.createPrototypeProfile()), false);
  assert.equal(profile.deletePrototypeProfile(blocked), false);
  assert.equal(profile.writePrototypeProfile(null, profile.createPrototypeProfile()), false);
  const local = storage();
  local.setItem("another-app", "keep");
  profile.writePrototypeProfile(local, { ...profile.createPrototypeProfile(), onboarding: "complete" });
  assert(profile.deletePrototypeProfile(local));
  assert.equal(local.getItem("another-app"), "keep");
  assert.equal(profile.readPrototypeProfile(local).record.onboarding, "new");
});
