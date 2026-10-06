import { hasWorkloadDetail, workloadFollowUps, workloadIssues, type WorkloadAnswer, type WorkloadIssueId } from "@/lib/employee/workload-flow";
import { ScenarioQuestions } from "./scenario-questions";

type Props = { stage: 0 | 1; answer: WorkloadAnswer; hasOtherAreas: boolean; onIssue: (issue: WorkloadIssueId) => void; onDetail: (details: string[]) => void; onComment: (text: string) => void; onContinue: () => void; onSkip: () => void; onExit: () => void };

export function WorkloadQuestions({ answer, ...props }: Props) {
  return <ScenarioQuestions {...props} areaLabel="Arbetsbelastning och krav" issue={answer.issue} details={answer.details} comment={answer.comment}
    issues={workloadIssues} choices={answer.issue ? workloadFollowUps[answer.issue].choices : []}
    ready={props.stage === 0 ? answer.issue !== null : hasWorkloadDetail(answer)} otherAreasHint="Du valde att börja med arbetsbelastningen. Dina andra val finns kvar." />;
}
