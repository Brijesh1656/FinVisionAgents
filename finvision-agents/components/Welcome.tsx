import React from 'react';
import { LogoIcon } from './icons';
import { ArrowRightIcon } from './icons';

interface WelcomeProps {
    onExampleClick: (example: string) => void;
}

const EXAMPLES = [
    "Summarize Apple's last quarterly earnings call transcript.",
    "What are the key financial risks for NVIDIA in 2024?",
    "Compare the P/E ratios of major tech companies like GOOGL, MSFT, and AMZN."
]

export const Welcome: React.FC<WelcomeProps> = ({ onExampleClick }) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-full animate-fadeInUp overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-900/20 to-background animate-gradient bg-[size:200%_200%] z-0"></div>
      <div className="relative z-10 flex flex-col items-center justify-center p-8">
        <LogoIcon className="h-20 w-20 text-primary animate-glow" />
        <h1 className="text-4xl md:text-5xl font-bold mt-6 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 text-center">Welcome to FinVision-Agents</h1>
        <p className="text-lg text-subtle mt-4 text-center max-w-3xl">
          An interactive simulation of a multi-agent RAG system for financial analysis.
          Enter a query below to begin, or try one of the examples.
        </p>

        <div className="mt-12 w-full max-w-2xl space-y-4">
          <p className="text-center font-semibold text-gray-300 mb-2">Try an example:</p>
          {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => onExampleClick(ex)} className="w-full text-left p-4 bg-surface/50 border border-border rounded-lg hover:border-primary transition-all group flex justify-between items-center backdrop-blur-sm hover:bg-surface/80 transform hover:-translate-y-1 duration-300 shadow-md hover:shadow-primary/20">
                  <span className="text-gray-300">{ex}</span>
                  <ArrowRightIcon className="h-5 w-5 text-subtle group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
              </button>
          ))}
        </div>
      </div>
    </div>
  );
};