export type WorkflowStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface WorkflowState {
  step: WorkflowStep;
  idea: string;
  synopsis: string;
  features: string[];
  improvements: string[];
  design: {
    palette: string[];
    fonts: string[];
  };
  phases: string[];
}

export const initialWorkflowState: WorkflowState = {
  step: 1,
  idea: "",
  synopsis: "",
  features: [],
  improvements: [],
  design: {
    palette: ["#000000", "#F5F2EF", "#FFFFFF"],
    fonts: ["Geist Sans", "Geist Mono"],
  },
  phases: [],
};

export function processWorkflow(state: WorkflowState, input: string): WorkflowState {
  switch (state.step) {
    case 1:
      return {
        ...state,
        step: 2,
        idea: input,
        synopsis: `A sophisticated digital solution centered around: ${input}. Focused on premium user experience and efficient orchestration.`,
        features: [
          "Automated Core Logic",
          "Premium UI Framework",
          "Advanced Data Analytics",
          "Real-time Collaboration",
          "Secure Auth Gateway",
          "Cloud-Native Architecture",
          "Performance Optimized",
          "Multi-device Sync",
          "Extensible Plugin System",
          "Integrated Documentation"
        ],
      };
    case 2:
      return {
        ...state,
        step: 3,
        improvements: [
          "Enhance micro-interactions",
          "Add dark mode support",
          "Optimize for low-bandwidth",
          "Integrate WebGL transitions",
          "Add voice navigation"
        ],
      };
    // Additional steps would follow a similar pattern
    default:
      return state;
  }
}
