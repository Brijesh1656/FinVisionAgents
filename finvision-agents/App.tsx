import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { QueryInput } from './components/QueryInput';
import { AgentFlow } from './components/AgentFlow';
import { ResponseDisplay } from './components/ResponseDisplay';
import { Welcome } from './components/Welcome';
import { Agent, AgentName, AgentStatus, Source } from './types';
import { INITIAL_AGENTS } from './constants';
import { runFinancialAnalysis } from './services/geminiService';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  const updateAgentStatus = useCallback((name: AgentName, status: AgentStatus) => {
    setAgents(prev => prev.map(agent => agent.name === name ? { ...agent, status } : agent));
  }, []);
  
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  const runAgentSequence = useCallback(async (submittedQuery: string, submittedFile: File | null) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setSources([]);
    setHasStarted(true);
    setAgents(INITIAL_AGENTS.map(a => ({...a, status: AgentStatus.Pending})));

    let documentContent: string | null = null;
    if (submittedFile) {
      try {
        documentContent = await readFileAsText(submittedFile);
      } catch (e) {
        setError("Failed to read the uploaded file. Please try again.");
        setIsLoading(false);
        return;
      }
    }

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    try {
      updateAgentStatus(AgentName.Router, AgentStatus.InProgress);
      await delay(700);
      updateAgentStatus(AgentName.Router, AgentStatus.Completed);

      updateAgentStatus(AgentName.Retriever, AgentStatus.InProgress);
      await delay(1000);
      updateAgentStatus(AgentName.Retriever, AgentStatus.Completed);
      
      updateAgentStatus(AgentName.Synthesizer, AgentStatus.InProgress);
      
      const geminiResponse = await runFinancialAnalysis(submittedQuery, documentContent);
      
      setResponse(geminiResponse.analysis);
      setSources(geminiResponse.sources);

      updateAgentStatus(AgentName.Synthesizer, AgentStatus.Completed);

      updateAgentStatus(AgentName.Verifier, AgentStatus.InProgress);
      await delay(800);
      updateAgentStatus(AgentName.Verifier, AgentStatus.Completed);

      updateAgentStatus(AgentName.Feedback, AgentStatus.InProgress);
      await delay(500);
      updateAgentStatus(AgentName.Feedback, AgentStatus.Completed);

    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Error during analysis: ${errorMessage}`);
      setAgents(prev => {
        const agentToError = prev.find(a => a.status === AgentStatus.InProgress);
        if (agentToError) {
          return prev.map(a => a.name === agentToError.name ? {...a, status: AgentStatus.Error} : a);
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  }, [updateAgentStatus]);

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setFile(null); // Clear file when an example is clicked
    runAgentSequence(example, null);
  };
  
  const handleSubmit = () => {
     if (!query.trim() && !file) return;
     runAgentSequence(query, file);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow flex flex-col items-center p-4 md:p-8">
        <div className="w-full max-w-4xl flex-grow flex flex-col space-y-8">
          {hasStarted ? (
            <>
              <AgentFlow agents={agents} />
              <div className="flex-grow">
                <ResponseDisplay response={response} sources={sources} isLoading={isLoading} error={error} />
              </div>
            </>
          ) : (
            <Welcome onExampleClick={handleExampleClick} />
          )}
        </div>
      </main>
      <div className="sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-4 border-t border-border">
          <div className="w-full max-w-4xl mx-auto">
            <QueryInput
              query={query}
              setQuery={setQuery}
              file={file}
              setFile={setFile}
              isLoading={isLoading}
              onSubmit={handleSubmit}
            />
          </div>
      </div>
    </div>
  );
};

export default App;