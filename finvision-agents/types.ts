export enum AgentName {
  Router = 'Router',
  Retriever = 'Retriever',
  Synthesizer = 'Synthesizer',
  Verifier = 'Verifier',
  Feedback = 'Feedback',
}

export enum AgentStatus {
  Pending = 'pending',
  InProgress = 'in_progress',
  Completed = 'completed',
  Error = 'error',
}

export interface Agent {
  name: AgentName;
  description: string;
  status: AgentStatus;
}

export interface Source {
  title: string;
  url: string;
}

export interface GeminiResponse {
  analysis: string;
  sources: Source[];
}
