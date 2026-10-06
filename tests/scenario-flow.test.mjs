import test from "node:test";
import assert from "node:assert/strict";
import { loadTypeScript as load, plain } from "./helpers/load-typescript.mjs";
const lib = "src/lib/employee/";
const data = load(lib + "scenario-content.ts");
const flow = load(lib + "scenario-flow.ts");
const state = load(lib + "check-in-state.ts");
const steps = load(lib + "check-in-flow.ts");
const plan = load(lib + "support-plan.ts");
const workload = load(lib + "workload-flow.ts");
const values = load(lib + "values.ts");
const connection = load(lib + "value-connection.ts");
const practice = load(lib + "workload-practice.ts");
const navigation = load(lib + "experience-navigation.ts");

test("all six categories have reachable, distinct authored routes and full practice plans", () => {
  const ids = new Set(), titles = new Set();
  let routes = 0;
  for (const [area, definition] of Object.entries(data.scenarioDefinitions)) {
    assert.equal(steps.getSupportStep([area]), "scenario-situation");
    assert.equal(steps.getPracticeStep(area), "scenario-practice");
    for (const issue of definition.issues) {
      let answer = flow.changeScenarioIssue(area, flow.createScenarioAnswer(), issue.id);
      for (const detail of issue.details) {
        answer = flow.changeScenarioDetails(area, answer, [detail.id]);
        assert(flow.hasScenarioDetails(area, answer));
        const context = connection.getValueConnectionContext([area], workload.createEmptyWorkloadAnswer(), answer);
        assert.equal(context.suggestedDomain, detail.domain);
        const actions = plan.getActionSuggestions(area, workload.createEmptyWorkloadAnswer(), answer);
        assert(actions.length >= 2);
        for (const action of actions) {
          assert(!ids.has(action.id), "duplicate action ID: " + action.id);
          assert(!titles.has(action.title), "duplicate primary content: " + action.title);
          ids.add(action.id); titles.add(action.title);
          const result = flow.getScenarioPractice(area, action, answer, null);
          assert.deepEqual(plain(result.steps), plain(action.steps));
          assert.equal(result.smallerStep, result.steps[0]);
          assert(result.basis.includes(detail.label));
          assert(result.support.withWhom && result.support.opening);
          if (action.conversation) assert.equal(result.conversation, action.conversation);
        }
        routes++;
      }
    }
  }
  assert.equal(routes, 36); assert.equal(ids.size, 72);
});

test("multi-select keeps all causes, requires a valid focus and isolates categories and action progress", () => {
  let answers = state.createCheckInAnswers("low");
  answers = state.checkInReducer(answers, { type: "support-categories", categories: ["focus", "recovery"] });
  answers = state.checkInReducer(answers, { type: "scenario-issue", area: "focus", issue: "starting" });
  answers = state.checkInReducer(answers, { type: "scenario-details", area: "focus", details: ["large-task", "thoughts"] });
  assert.equal(answers.scenarios.focus.detail, null);
  assert.equal(flow.getScenarioActions("focus", answers.scenarios.focus), null);
  const invalid = state.checkInReducer(answers, { type: "scenario-focus", area: "focus", detail: "invalid" });
  assert.equal(invalid, answers);
  answers = state.checkInReducer(answers, { type: "scenario-focus", area: "focus", detail: "thoughts" });
  assert.deepEqual(plain(answers.scenarios.focus.details), ["large-task", "thoughts"]);
  const key = state.getActionContext("focus", answers.workload, "health", null, answers.scenarios.focus);
  const action = plan.getActionSuggestions("focus", answers.workload, answers.scenarios.focus)[0];
  const practiceKey = practice.getPracticeKey(key, action);
  answers = state.checkInReducer(answers, { type: "practice", key: practiceKey, progress: { smaller: true, reflecting: true, feedback: "not-fit" } });
  answers = state.checkInReducer(answers, { type: "scenario-issue", area: "recovery", issue: "disconnect" });
  answers = state.checkInReducer(answers, { type: "scenario-details", area: "recovery", details: ["rumination"] });
  assert.equal(answers.scenarios.focus.detail, "thoughts");
  assert(answers.practice[practiceKey].smaller);
  assert.notEqual(key, state.getActionContext("recovery", answers.workload, "leisure", null, answers.scenarios.recovery));
  answers = state.checkInReducer(answers, { type: "finish-area", area: "focus" });
  assert.deepEqual(plain(answers.supportCategories), ["focus", "recovery"]);
  assert.deepEqual(plain(answers.exploredAreas), ["focus"]);
});

test("changed and skipped causes reset stale directions, uncertain options are exclusive, invalid IDs cannot become causes", () => {
  for (const area of Object.keys(data.scenarioDefinitions)) {
    const issue = data.scenarioDefinitions[area].issues[0];
    const ids = issue.details.map((detail) => detail.id);
    let answer = flow.changeScenarioIssue(area, flow.createScenarioAnswer(), issue.id);
    answer = flow.changeScenarioDetails(area, answer, [...ids, "invalid"]);
    assert.deepEqual(plain(answer.details), plain(ids));
    answer = flow.changeScenarioDetails(area, answer, [...ids, "unsure"]);
    assert.deepEqual(plain(answer.details), ["unsure"]);
    answer = flow.changeScenarioDetails(area, answer, ["unsure", ids[0]]);
    assert.deepEqual(plain(answer.details), [ids[0]]);
    assert.equal(flow.changeScenarioIssue(area, answer, "invalid"), answer);
    assert.equal(flow.getScenarioDetail(area, { ...answer, detail: "invalid" }), null);
    let answers = state.createCheckInAnswers("low");
    answers = state.checkInReducer(answers, { type: "scenario-issue", area, issue: issue.id });
    answers = state.checkInReducer(answers, { type: "domain", area, domain: "leisure" });
    answers = state.checkInReducer(answers, { type: "skip-value", area });
    answers = state.checkInReducer(answers, { type: "skip-scenario", area, stage: 1 });
    assert.equal(answers.domains[area], undefined);
    assert(!answers.skippedValues.includes(area));
    assert.equal(answers.scenarios[area].issue, issue.id);
    answers = state.checkInReducer(answers, { type: "scenario-issue", area, issue: data.scenarioDefinitions[area].issues[1].id });
    assert.equal(answers.scenarios[area].details.length, 0);
    answers = state.checkInReducer(answers, { type: "skip-scenario", area, stage: 0 });
    assert.equal(answers.scenarios[area].issue, null);
    assert(plan.getActionSuggestions(area, answers.workload, answers.scenarios[area]).length >= 2);
    answers = state.checkInReducer(answers, { type: "clear-support" });
    assert.deepEqual(plain(answers.scenarios), {});
  }
});

test("explicit safety and recovery routes retain appropriate support even with own ideas or skipped details", () => {
  const own = { id: "own-0", source: "own", title: "Syntetisk egen idé", instruction: "" };
  let answer = flow.changeScenarioIssue("relationships", flow.createScenarioAnswer(), "treatment");
  for (const id of [null, "unsure", "unsafe", "demeaning"]) {
    const selection = id ? flow.changeScenarioDetails("relationships", answer, [id]) : answer;
    const actions = plan.getActionSuggestions("relationships", workload.createEmptyWorkloadAnswer(), selection);
    assert(actions.every((action) => action.conversation.withWhom.includes("Skyddsombud")));
    const result = flow.getScenarioPractice("relationships", own, selection, null);
    assert(result.support.opening.includes("inte ta upp det ensam"));
  }
  answer = flow.changeScenarioIssue("recovery", flow.createScenarioAnswer(), "fatigue");
  assert(flow.getScenarioPractice("recovery", own, answer, null).support.withWhom.includes("vårdcentral"));
});

test("free text does not select a cause, action or value; personal ideas and directions remain available", () => {
  const area = "recovery";
  const answer = flow.changeScenarioDetails(area, flow.changeScenarioIssue(area, flow.createScenarioAnswer(), "disconnect"), ["rumination"]);
  const changed = { ...answer, comment: "A private synthetic paragraph that must not be interpreted" };
  assert.deepEqual(plain(flow.getScenarioContext(area, answer)), plain(flow.getScenarioContext(area, changed)));
  assert.deepEqual(plain(flow.getScenarioActions(area, answer)), plain(flow.getScenarioActions(area, changed)));
  const profile = values.createEmptyValuesProfile();
  profile.leisure.direction = "Syntetisk riktning"; profile.leisure.action = "Ta en promenad";
  const value = connection.getChosenValue(profile, "leisure");
  const own = { id: "own-0", title: value.actions[0], source: "own", instruction: "" };
  const result = flow.getScenarioPractice(area, own, changed, value);
  assert(result.basis.includes("fritid"));
  assert(result.valuePrompt.includes("utanför arbetet"));
  assert(!JSON.stringify(result).includes(changed.comment));
  const unknown = flow.changeScenarioIssue("other", flow.createScenarioAnswer(), "unclear");
  assert.equal(flow.getScenarioContext("other", unknown).suggestedDomain, null);
});

test("new branches survive back and forward, menu visits and restart without putting answers into history markers", () => {
  const screens = [
    { view: "day", step: "scenario-situation", area: "focus", need: null },
    { view: "day", step: "scenario-detail", area: "focus", need: null },
    { view: "day", step: "scenario-detail-focus", area: "focus", need: null },
    { view: "values" },
    { view: "day", step: "scenario-practice", area: "focus", need: null },
  ];
  let history = navigation.createScreenHistory(screens[0]);
  for (const screen of screens.slice(1)) history = navigation.appendScreen(history, screen);
  history = navigation.restoreScreen(history, 2);
  assert.equal(history.entries[history.index].screen.step, "scenario-detail-focus");
  history = navigation.restoreScreen(history, 4);
  assert.equal(history.entries[history.index].screen.step, "scenario-practice");
  const answers = state.checkInReducer(state.createCheckInAnswers("low"), { type: "scenario-comment", area: "other", text: "x".repeat(500) });
  assert.equal(answers.scenarios.other.comment.length, 350);
  assert.deepEqual(plain(state.checkInReducer(answers, { type: "restart" }).scenarios), {});
});
