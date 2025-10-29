import { Agent, AgentName, AgentStatus } from './types';

export const INITIAL_AGENTS: Agent[] = [
  {
    name: AgentName.Router,
    description: 'Routes query to the appropriate financial pipeline.',
    status: AgentStatus.Pending,
  },
  {
    name: AgentName.Retriever,
    description: 'Fetches top-K documents from vector database & APIs.',
    status: AgentStatus.Pending,
  },
  {
    name: AgentName.Synthesizer,
    description: 'Constructs RAG prompt and generates analysis with LLM.',
    status: AgentStatus.Pending,
  },
  {
    name: AgentName.Verifier,
    description: 'Fact-checks statements with secondary retrieval and rules.',
    status: AgentStatus.Pending,
  },
  {
    name: AgentName.Feedback,
    description: 'Collects user feedback and auto-metrics for scoring.',
    status: AgentStatus.Pending,
  },
];
