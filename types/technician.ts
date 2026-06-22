export type TechnicianInput = {
  assetId: string;
  symptoms: string;
  errorCode: string;
  photos: string[];
  escalate: boolean;
};

export type DiagnosisResult = {
  summary: string;
  action: string;
  nextStepIndex: number;
};
