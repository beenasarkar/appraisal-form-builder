
export interface AppraisalForm {
  id: string;
  title: string;
  sections: FormSection[];
  createdAt: string;
  status: 'draft' | 'active' | 'archived';
  workflow?: WorkflowStage;
}

export interface FormSection {
  id: string;
  title: string;
  status: 'not-started' | 'in-progress' | 'complete';
  fields: FormField[];
}

export interface FormField {
  id: string;
  type: 'label' | 'textbox' | 'radio' | 'attachment' | 'dropdown' | 'multiselect' | 'score' | 'sentiment';
  label: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  value?: any;
  settings?: {
    expandable?: boolean;
    dictate?: boolean;
    summarize?: boolean;
    sentiment?: boolean;
    minScore?: number;
    maxScore?: number;
  };
}

export type WorkflowStage = 'pre-appraisal' | 'appraisal-meeting' | 'post-appraisal';

export interface WorkflowProcess {
  preAppraisal: boolean;
  appraisalMeeting: boolean;
  postAppraisal: boolean;
  assignedForm?: string;
}

export interface SentimentAnalysis {
  score: number;
  label: 'positive' | 'neutral' | 'negative';
  confidence: number;
}
