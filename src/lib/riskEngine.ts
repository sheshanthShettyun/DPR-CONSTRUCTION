export interface IntakeInput {
  name: string;
  location: string;
  projectType: string;
  budget: number;
  startDate: string;
  targetDate: string;
  crewSize: number;
  scale: number;
  siteConditions: string;
}

export interface GeneratedRisk {
  title: string;
  description: string;
  severity: "Low" | "Medium" | "High";
  category: string;
}

export interface GeneratedMilestone {
  title: string;
  date: string;
  phasePct: number;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function generateRisksAndMilestones(input: IntakeInput): {
  risks: GeneratedRisk[];
  milestones: GeneratedMilestone[];
} {
  const start = new Date(input.startDate);
  const end = new Date(input.targetDate);
  const durationDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / MS_PER_DAY));

  // budget per 1,000 sqft per day of schedule — a rough intensity signal
  const budgetIntensity = input.scale > 0 ? input.budget / input.scale / durationDays : 0;
  // crew members per 1,000 sqft
  const crewDensity = input.scale > 0 ? input.crewSize / input.scale : 0;

  const risks: GeneratedRisk[] = [];

  if (durationDays < input.scale * 0.9) {
    risks.push({
      title: "Compressed Schedule",
      description: `Target timeline of ${durationDays} days is tight for a ${input.scale}k sqft project of this type.`,
      severity: "High",
      category: "Schedule",
    });
  } else if (durationDays < input.scale * 1.4) {
    risks.push({
      title: "Schedule Pressure",
      description: `Timeline is workable but leaves little slack for delays across ${durationDays} days.`,
      severity: "Medium",
      category: "Schedule",
    });
  }

  if (budgetIntensity < 15) {
    risks.push({
      title: "Cost Overrun Risk",
      description: "Budget relative to project scale and schedule is on the low side — limited contingency for change orders.",
      severity: "High",
      category: "Cost",
    });
  } else if (budgetIntensity < 30) {
    risks.push({
      title: "Tight Contingency Margin",
      description: "Budget covers baseline scope but leaves a thin buffer for overruns.",
      severity: "Medium",
      category: "Cost",
    });
  }

  if (crewDensity < 0.8) {
    risks.push({
      title: "Labor Shortage Risk",
      description: `Crew size of ${input.crewSize} is low relative to the ${input.scale}k sqft scope — may bottleneck parallel work.`,
      severity: "Medium",
      category: "Labor",
    });
  }

  const siteRiskMap: Record<string, GeneratedRisk> = {
    "Seismic Zone": {
      title: "Seismic & Structural Risk",
      description: "Site is in a seismic zone — expect added structural engineering review and reinforcement costs.",
      severity: "High",
      category: "Site Conditions",
    },
    "Flood Zone": {
      title: "Flood & Water Damage Risk",
      description: "Site is in a flood zone — drainage, waterproofing, and weather delays are elevated risks.",
      severity: "High",
      category: "Site Conditions",
    },
    Coastal: {
      title: "Weather Exposure Risk",
      description: "Coastal site increases exposure to storms, wind loading, and corrosion-resistant material requirements.",
      severity: "Medium",
      category: "Site Conditions",
    },
    Urban: {
      title: "Site Access & Logistics Risk",
      description: "Dense urban site — expect constrained laydown space, permitting friction, and delivery scheduling challenges.",
      severity: "Medium",
      category: "Logistics",
    },
    Remote: {
      title: "Supply Chain & Logistics Risk",
      description: "Remote site location increases material lead times and transport costs.",
      severity: "Medium",
      category: "Logistics",
    },
  };
  if (siteRiskMap[input.siteConditions]) {
    risks.push(siteRiskMap[input.siteConditions]);
  }

  if (input.projectType === "Industrial") {
    risks.push({
      title: "Safety & Compliance Risk",
      description: "Industrial scope involves heavy machinery and process systems — elevated safety and regulatory compliance burden.",
      severity: "Medium",
      category: "Safety",
    });
  }
  if (input.projectType === "Infrastructure") {
    risks.push({
      title: "Regulatory & Permitting Risk",
      description: "Infrastructure projects typically require multi-agency permitting and public review, which can extend timelines.",
      severity: "Medium",
      category: "Regulatory",
    });
  }

  risks.push({
    title: "Permit & Regulatory Approval Delays",
    description: "Standard risk for any project — local permitting and inspection scheduling can slip the timeline.",
    severity: "Low",
    category: "Regulatory",
  });
  risks.push({
    title: "Weather Delays",
    description: "General exposure to adverse weather affecting exterior and site work.",
    severity: "Low",
    category: "Schedule",
  });

  const severityRank = { High: 0, Medium: 1, Low: 2 };
  risks.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

  const phases = [
    { title: "Site Preparation & Permitting", phasePct: 8 },
    { title: "Foundation Complete", phasePct: 22 },
    { title: "Structural Framing Complete", phasePct: 45 },
    { title: "MEP Rough-In", phasePct: 65 },
    { title: "Interior Finishes", phasePct: 85 },
    { title: "Final Inspection & Handover", phasePct: 100 },
  ];

  const milestones: GeneratedMilestone[] = phases.map((p) => {
    const date = new Date(start.getTime() + (durationDays * p.phasePct) / 100 * MS_PER_DAY);
    return {
      title: p.title,
      date: date.toISOString().slice(0, 10),
      phasePct: p.phasePct,
    };
  });

  return { risks, milestones };
}
