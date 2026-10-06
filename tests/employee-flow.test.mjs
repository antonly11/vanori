import test from "node:test";
import assert from "node:assert/strict";
import { loadTypeScript as load, plain } from "./helpers/load-typescript.mjs";
const lib = "src/lib/employee/";
const navigation = load(lib + "experience-navigation.ts");
const state = load(lib + "check-in-state.ts");
const flow = load(lib + "check-in-flow.ts");
const workload = load(lib + "workload-flow.ts");
const support = load(lib + "workload-support.ts");
const conversations = load(lib + "workload-conversations.ts");
const plan = load(lib + "support-plan.ts");
const daily = load(lib + "daily-needs.ts");
const own = load(lib + "own-actions.ts");
const values = load(lib + "values.ts");
const connections = load(lib + "value-connection.ts");
const practice = load(lib + "workload-practice.ts");

const day = (step, extra = {}) => ({ view: "day", step, area: null, need: null, ...extra });

test("all wellbeing levels enter the intended branch", () => {
  for (const [level, expected] of [["very-low", "support"], ["low", "support"], ["neutral", "neutral"], ["good", "positive"], ["very-good", "positive"]]) {
    assert.equal(flow.getFollowUpStep(level), expected);
  }
  assert.equal(flow.getSupportStep(["workload"]), "workload-situation");
  assert.equal(flow.getSupportStep(["relationships"]), "scenario-situation");
  assert.equal(flow.getSupportStep(["workload", "relationships"]), "support-focus");
});

test("back from support returns to the actual neutral needs screen", () => {
  let history = navigation.createScreenHistory(day("neutral"));
  history = navigation.appendScreen(history, day("explore"));
  const needsEntry = history.entries[history.index].id;
  history = navigation.appendScreen(history, day("support"));
  history = navigation.restoreScreen(history, needsEntry);
  assert.equal(history.entries[history.index].screen.step, "explore");
});

test("a new branch discards browser-forward entries without reusing their IDs", () => {
  let history = navigation.createScreenHistory(day("wellbeing"));
  history = navigation.appendScreen(history, day("positive"));
  const positiveEntry = history.entries[1].id;
  history = navigation.appendScreen(history, day("reflection"));
  const obsoleteEntry = history.entries[2].id;
  history = navigation.restoreScreen(history, positiveEntry);
  history = navigation.appendScreen(history, day("support"));
  assert.equal(history.entries.length, 3);
  assert(!history.entries.some((entry) => entry.id === obsoleteEntry));
  assert.equal(navigation.restoreScreen(history, obsoleteEntry), history);
});

test("history markers accept only a session and integer entry, not private answers", () => {
  assert.deepEqual(plain(navigation.readHistoryMarker({ vanori: { session: "test", entry: 2, answer: "synthetic private text" } })), { session: "test", entry: 2 });
  for (const invalid of [null, {}, { vanori: null }, { vanori: { session: 5, entry: 1 } }, { vanori: { session: "test", entry: 1.5 } }]) assert.equal(navigation.readHistoryMarker(invalid), null);
});

test("alternative and own actions survive leaving the suggestion screen", () => {
  let answer = state.createCheckInAnswers("low");
  answer = state.checkInReducer(answer, { type: "workload-issue", issue: "amount" });
  answer = state.checkInReducer(answer, { type: "workload-details", details: ["volume"] });
  const key = state.getActionContext("workload", answer.workload, "work");
  const chosen = plan.getActionSuggestions("workload", answer.workload)[1];
  answer = state.checkInReducer(answer, { type: "action", key, action: chosen });
  let history = navigation.createScreenHistory(day("value-connection", { area: "workload" }));
  history = navigation.appendScreen(history, day("support-preview", { area: "workload", action: chosen }));
  history = navigation.restoreScreen(history, 0);
  assert.equal(history.entries[history.index].screen.step, "value-connection");
  assert.equal(answer.actions[key].title, "Be om konkret avlastning");
  const custom = own.getOwnActionOptions(["Ta en kort promenad"])[0].action;
  answer = state.checkInReducer(answer, { type: "action", key, action: custom });
  assert.equal(answer.actions[key].source, "own");
  assert.notEqual(key, state.getActionContext("workload", answer.workload, "health"));
});

test("changing mood resets the check-in but repeated selection preserves answers", () => {
  let answer = state.createCheckInAnswers("low");
  answer = state.checkInReducer(answer, { type: "support-categories", categories: ["workload"] });
  answer = state.checkInReducer(answer, { type: "workload-issue", issue: "pressure" });
  assert.equal(state.checkInReducer(answer, { type: "level", level: "low" }), answer);
  const reset = state.checkInReducer(answer, { type: "level", level: "good" });
  assert.equal(reset.level, "good");
  assert.equal(reset.workload.issue, null);
  assert.equal(reset.supportCategories.length, 0);
});

test("multiple answers are kept while a valid workload focus is selected", () => {
  let answer = state.createCheckInAnswers("low");
  answer = state.checkInReducer(answer, { type: "workload-issue", issue: "pressure" });
  answer = state.checkInReducer(answer, { type: "workload-details", details: ["external", "self"] });
  assert.equal(answer.workload.detail, null);
  answer = state.checkInReducer(answer, { type: "workload-focus", detail: "self" });
  assert.deepEqual(plain(answer.workload.details), ["external", "self"]);
  assert.equal(answer.workload.detail, "self");
  assert.equal(connections.getValueConnectionContext(["workload"], answer.workload).suggestedDomain, "health");
  assert.equal(state.checkInReducer(answer, { type: "workload-focus", detail: "invalid" }), answer);
});

test("uncertain details are exclusive and skipped questions reset old value choices", () => {
  let answer = state.createCheckInAnswers("low");
  answer = state.checkInReducer(answer, { type: "workload-issue", issue: "pressure" });
  answer = state.checkInReducer(answer, { type: "workload-details", details: ["self", "external"] });
  answer = state.checkInReducer(answer, { type: "workload-details", details: ["self", "external", "unsure"] });
  assert.deepEqual(plain(answer.workload.details), ["unsure"]);
  answer = state.checkInReducer(answer, { type: "domain", area: "workload", domain: "relationships" });
  answer = state.checkInReducer(answer, { type: "skip-value", area: "workload" });
  answer = state.checkInReducer(answer, { type: "skip-workload", stage: 0 });
  assert.equal(answer.domains.workload, undefined);
  assert(!answer.skippedValues.includes("workload"));
  assert.equal(answer.workload.issue, null);
});

test("completed areas and daily needs are tracked once without discarding other selections", () => {
  let answer = state.createCheckInAnswers("neutral");
  answer = state.checkInReducer(answer, { type: "needs", needs: ["pause", "prioritize"] });
  answer = state.checkInReducer(answer, { type: "finish-need", need: "pause" });
  answer = state.checkInReducer(answer, { type: "finish-need", need: "pause" });
  assert.deepEqual(plain(answer.exploredNeeds), ["pause"]);
  assert.deepEqual(plain(answer.needs), ["pause", "prioritize"]);
  answer = state.checkInReducer(answer, { type: "support-categories", categories: ["workload", "relationships"] });
  answer = state.checkInReducer(answer, { type: "finish-area", area: "workload" });
  assert.deepEqual(plain(answer.supportCategories), ["workload", "relationships"]);
});

test("all seven neutral needs have distinct concrete support", () => {
  const all = daily.dailyNeeds.flatMap((need) => daily.getDailySupport(need.id));
  assert.equal(all.length, 14);
  assert.equal(new Set(all.map((action) => action.id)).size, 14);
  assert.equal(new Set(all.map((action) => action.title)).size, 14);
  assert.equal(daily.getDailyValueDomain("pause"), "health");
  assert.equal(daily.getDailyValueDomain("check-in"), "relationships");
  assert.notEqual(daily.getDailySupport("pause")[0].id, daily.getDailySupport("prioritize")[0].id);
});

test("general categories have unique content and concrete conversation roles", () => {
  const areas = ["relationships", "clarity-control", "focus", "motivation", "recovery", "other"];
  const all = areas.flatMap((area) => plan.getActionSuggestions(area, workload.createEmptyWorkloadAnswer()));
  assert.equal(all.length, 12);
  assert.equal(new Set(all.map((action) => action.title)).size, 12);
  for (const action of all.filter((item) => item.conversation)) assert(action.conversation.withWhom && action.conversation.opening && action.conversation.reason);
});

test("all specific workload routes retain authored actions and conversation guides by stable ID", () => {
  const collected = new Map();
  let specific = 0;
  for (const issue of workload.workloadIssues) {
    const base = { ...workload.createEmptyWorkloadAnswer(), issue: issue.id };
    for (const action of support.workloadSupport[issue.id].general) collected.set(action.id, action);
    for (const choice of workload.workloadFollowUps[issue.id].choices) {
      const focused = workload.changeWorkloadDetails(base, [choice.id]);
      const options = support.getWorkloadSupport(focused);
      assert(options.length >= 2, issue.id + "/" + choice.id);
      if (choice.id === "other" || choice.id === "unsure") assert.equal(options, support.workloadSupport[issue.id].general);
      else specific++;
      for (const action of options) {
        collected.set(action.id, action);
        assert.equal(action.steps.length, 2);
        if (action.conversation) assert.equal(action.conversation, conversations.workloadConversations[action.id]);
      }
      assert.equal(support.getWorkloadSupport({ ...focused, detail: "invalid" }), support.workloadSupport[issue.id].general);
    }
  }
  for (const action of support.getWorkloadSupport(workload.createEmptyWorkloadAnswer())) collected.set(action.id, action);
  const both = { ...workload.createEmptyWorkloadAnswer(), issue: "pressure", details: ["external", "self"], detail: "self" };
  for (const action of support.getWorkloadSupport(both)) collected.set(action.id, action);
  assert.equal(specific, 39);
  assert.equal(collected.size, 104);
  assert.equal(Object.keys(conversations.workloadConversations).length, 79);
  for (const [id, guide] of Object.entries(conversations.workloadConversations)) {
    assert(collected.has(id), "orphan conversation " + id);
    assert(guide.withWhom && guide.opening && guide.reason);
  }
  const renamed = { ...collected.get("visa-vad-som-inte-ryms"), title: "En ny rubrik" };
  assert.equal(renamed.conversation, conversations.workloadConversations[renamed.id]);
});

test("own ideas get optional variations only for clearly recognized non-negated activities", () => {
  const options = own.getOwnActionOptions(["Ta en promenad", "Ta en kaffe med en kollega", "Träning som jag tycker om", "Läsa en egen bok", "Inte träna idag", "Ta en promenad"]);
  assert.equal(options.length, 5);
  assert.equal(options[0].variations.length, 2);
  assert(options[1].variations.some((action) => action.title.includes("tillsammans")));
  assert.equal(options[2].variations.length, 2);
  assert.equal(options[3].variations.length, 0);
  assert.equal(options[4].variations.length, 0);
  assert(options[0].variations.every((action) => action.source === "adapted" && action.basedOn === "Ta en promenad"));
});

test("all Bullseye scores move inward and maximum-score markers do not overlap", () => {
  for (let domain = 0; domain < 4; domain++) {
    let previous = Infinity;
    for (let rating = 1; rating <= 7; rating++) {
      const point = values.getValuePosition(domain, rating);
      const radius = Math.hypot(point.x - 180, point.y - 180);
      assert(radius < previous);
      previous = radius;
    }
  }
  const a = values.getValuePosition(0, 7), b = values.getValuePosition(1, 7);
  assert(Math.hypot(a.x - b.x, a.y - b.y) > 18);
  const profile = values.createEmptyValuesProfile();
  assert.equal(values.hasValue(profile.work), false);
  assert.equal(values.hasValue({ ...profile.work, direction: "synthetic direction" }), true);
});

test("all support areas enter guided action pages while neutral small needs retain their route", () => {
  assert.equal(flow.getPracticeStep("workload"), "workload-practice");
  assert.equal(flow.getPracticeStep(null), null);
  for (const area of ["relationships", "clarity-control", "focus", "motivation", "recovery", "other"]) assert.equal(flow.getPracticeStep(area), "scenario-practice");
});

test("workload action guidance follows the selected cause and preserves its conversation", () => {
  const base = { ...workload.createEmptyWorkloadAnswer(), issue: "amount" };
  const volume = workload.changeWorkloadDetails(base, ["volume"]);
  const interruptions = workload.changeWorkloadDetails(base, ["interruptions"]);
  const first = practice.getWorkloadPractice(plan.getActionSuggestions("workload", volume)[0], volume, null);
  const second = practice.getWorkloadPractice(plan.getActionSuggestions("workload", interruptions)[0], interruptions, null);
  assert(first.basis.includes("Mer arbete än tiden räcker till"));
  assert(second.basis.includes("Avbrott"));
  assert.notDeepEqual(plain(first.steps), plain(second.steps));
  assert.equal(first.smallerStep, first.steps[0]);
  assert(first.conversation.withWhom.includes("chef"));
  assert(first.conversation.opening.includes("flyttas"));
  assert.equal(first.valuePrompt, null);
});

test("all authored workload actions can be practised without replacing their distinct steps", () => {
  for (const issue of workload.workloadIssues) {
    const base = { ...workload.createEmptyWorkloadAnswer(), issue: issue.id };
    for (const choice of workload.workloadFollowUps[issue.id].choices) {
      const answer = workload.changeWorkloadDetails(base, [choice.id]);
      for (const action of plan.getActionSuggestions("workload", answer)) {
        const result = practice.getWorkloadPractice(action, answer, null);
        assert.deepEqual(plain(result.steps), plain(action.steps));
        assert(result.support.withWhom && result.support.opening);
      }
    }
  }
});

test("own actions use their chosen direction without guessing from private free text", () => {
  const profile = values.createEmptyValuesProfile();
  profile.health = { ...profile.health, direction: "Min privata riktning", action: "Ta en promenad" };
  const value = connections.getChosenValue(profile, "health");
  const option = own.getOwnActionOptions(value.actions)[0];
  const answer = { ...workload.createEmptyWorkloadAnswer(), comment: "Private text must not influence the plan" };
  const result = practice.getWorkloadPractice(option.variations[0], answer, value);
  assert(result.basis.includes("hälsa"));
  assert.equal(result.steps[0], option.variations[0].instruction);
  assert(!JSON.stringify(result).includes(answer.comment));
  assert(!JSON.stringify(result).includes(value.direction));
  const unrelated = { ...value, actions: [] };
  assert.equal(practice.getWorkloadPractice(option.action, answer, unrelated).basis, "Du valde den här egna idén.");
  const skipped = practice.getWorkloadPractice(plan.getActionSuggestions("workload", answer)[0], answer, null);
  assert(skipped.basis.includes("orsaken ännu är oklar"));
});

test("practice choices survive back and forward, stay separate per action, and clear on restart", () => {
  let answers = state.createCheckInAnswers("low");
  const actions = plan.getActionSuggestions("workload", answers.workload);
  const context = state.getActionContext("workload", answers.workload, null);
  const key = practice.getPracticeKey(context, actions[0]);
  const progress = { smaller: true, reflecting: true, feedback: "not-fit" };
  answers = state.checkInReducer(answers, { type: "practice", key, progress });
  let history = navigation.createScreenHistory(day("value-connection", { area: "workload" }));
  history = navigation.appendScreen(history, day("workload-practice", { area: "workload", action: actions[0] }));
  history = navigation.restoreScreen(history, 0);
  history = navigation.restoreScreen(history, 1);
  assert.equal(history.entries[history.index].screen.action.id, actions[0].id);
  assert.deepEqual(plain(answers.practice[key]), progress);
  assert.equal(answers.practice[practice.getPracticeKey(context, actions[1])], undefined);
  const ownA = { id: "own-0", title: "Old idea", source: "own", instruction: "" };
  const ownB = { ...ownA, title: "Edited idea" };
  assert.notEqual(practice.getPracticeKey(context, ownA), practice.getPracticeKey(context, ownB));
  assert.deepEqual(plain(state.checkInReducer(answers, { type: "restart" }).practice), {});
});

test("the day home enters the wellbeing question, with values and actions kept in the menu", () => {
  const history = navigation.createScreenHistory();
  assert.deepEqual(plain(history.entries[0].screen), day("wellbeing"));
  assert.equal(navigation.getActiveMenu(day("workload-practice", { area: "workload" })), "day");
  assert.equal(navigation.getActiveMenu({ view: "introduction" }), "values");
  assert.equal(navigation.getActiveMenu({ view: "actions" }), "actions");
  const setup = { view: "setup", screen: 1, editing: true, returnTo: { view: "actions" } };
  assert.equal(navigation.getActiveMenu(setup), "actions");
});

test("visiting personal pages does not discard an ongoing check-in or its selected action", () => {
  let answers = state.createCheckInAnswers("low");
  const action = plan.getActionSuggestions("workload", answers.workload)[1];
  const key = state.getActionContext("workload", answers.workload, "work");
  answers = state.checkInReducer(answers, { type: "action", key, action });
  const ongoing = day("workload-practice", { area: "workload", action });
  let history = navigation.createScreenHistory(ongoing);
  history = navigation.appendScreen(history, { view: "actions" });
  history = navigation.appendScreen(history, { view: "values" });
  history = navigation.appendScreen(history, navigation.createDayScreen());
  assert.equal(history.entries[history.index].screen.step, "wellbeing");
  history = navigation.appendScreen(history, ongoing);
  assert.equal(history.entries[history.index].screen.action.id, action.id);
  assert.equal(answers.actions[key].id, action.id);
});
