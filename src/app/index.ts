export interface ScaffoldSummary {
  name: string;
  projectType: string;
  description: string;
}

const scaffoldDescription = [
  "ClawMarket",
  " prepared with the Harness Engineering and Orchestrator workflow.",
].join("");

export const scaffoldSummary: ScaffoldSummary = {
  name: "clawmarket",
  projectType: "Monorepo + Web App",
  description: scaffoldDescription,
};

export function getScaffoldSummary(): ScaffoldSummary {
  return scaffoldSummary;
}
