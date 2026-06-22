export type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  warning?: string;
};

export const initialEquipment = {
  id: "BR-1001",
  name: "IBM Bridge Box",
  location: "Data center rack 12",
  status: "Awaiting inspection",
};

export const workflowSteps: WorkflowStep[] = [
  {
    id: "inspect",
    title: "Inspect the asset",
    description: "Verify visible indicators, warning lights, and physical condition.",
  },
  {
    id: "power-cycle",
    title: "Power cycle the unit",
    description: "Safely reboot the equipment if it is unresponsive or showing error codes.",
    warning: "Power cycling during active operations may cause temporary service interruption.",
  },
  {
    id: "check-cables",
    title: "Check cabling",
    description: "Confirm that power and network cables are securely connected.",
  },
  {
    id: "report",
    title: "Generate incident report",
    description: "Capture observations and confirm the next recommended action.",
  },
];
