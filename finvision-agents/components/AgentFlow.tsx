import React from 'react';
import { Agent, AgentName, AgentStatus } from '../types';
import { CheckCircleIcon, ErrorIcon, LoaderIcon, PendingIcon, RouterIcon, RetrieverIcon, SynthesizerIcon, VerifierIcon, FeedbackIcon } from './icons';

const statusConfig = {
  [AgentStatus.Pending]: { icon: <PendingIcon />, color: 'text-subtle' },
  [AgentStatus.InProgress]: { icon: <LoaderIcon />, color: 'text-primary' },
  [AgentStatus.Completed]: { icon: <CheckCircleIcon />, color: 'text-success' },
  [AgentStatus.Error]: { icon: <ErrorIcon />, color: 'text-danger' },
};

const agentIcons = {
    [AgentName.Router]: <RouterIcon />,
    [AgentName.Retriever]: <RetrieverIcon />,
    [AgentName.Synthesizer]: <SynthesizerIcon />,
    [AgentName.Verifier]: <VerifierIcon />,
    [AgentName.Feedback]: <FeedbackIcon />,
};

const AgentNode: React.FC<{ agent: Agent; index: number }> = ({ agent, index }) => {
  const { icon, color } = statusConfig[agent.status];
  
  const statusClasses = {
    [AgentStatus.Pending]: 'border-border',
    [AgentStatus.InProgress]: 'border-primary/80 animate-border-glow-primary',
    [AgentStatus.Completed]: 'border-success/50',
    [AgentStatus.Error]: 'border-danger/50',
  };

  return (
    <div 
      className="flex flex-col items-center text-center w-28 md:w-32 animate-fadeInUp opacity-0"
      style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
    >
       <div className={`relative h-14 w-14 md:h-16 md:w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-surface to-surface-light border p-1 transition-all duration-300 ${statusClasses[agent.status]}`}>
        <div className="absolute inset-0 rounded-full bg-surface opacity-80"></div>
        <div className={`relative h-7 w-7 md:h-8 md:w-8 ${color} transition-colors z-10`}>{agentIcons[agent.name]}</div>
        <div className="absolute -bottom-1 -right-1 z-20">
          <div className={`h-6 w-6 ${color}`}>{icon}</div>
        </div>
      </div>
      <p className={`mt-2 text-xs font-semibold ${agent.status !== AgentStatus.Pending ? 'text-gray-200' : 'text-subtle'} transition-colors`}>{agent.name}</p>
      <p className="mt-1 text-xs text-subtle hidden md:block">{agent.description}</p>
    </div>
  );
};


export const AgentFlow: React.FC<{ agents: Agent[] }> = ({ agents }) => {
  return (
    <div className="w-full bg-surface border border-border rounded-lg p-4 md:p-6 shadow-xl animate-fadeInUp">
      <h2 className="text-lg font-bold text-gray-200 mb-6 text-center md:text-left">Agent Workflow</h2>
      <div className="flex items-start justify-between">
        {agents.map((agent, index) => (
          <React.Fragment key={agent.name}>
            <AgentNode agent={agent} index={index} />
            {index < agents.length - 1 && (
              <div className="flex-1 mt-7 h-0.5 bg-surface-light relative rounded-full">
                <div 
                   className={`
                     h-full rounded-full bg-gradient-to-r from-success to-primary relative
                     transition-all duration-700 ease-in-out
                     ${agents[index].status === AgentStatus.Completed ? 'w-full' : 'w-0'}
                   `}
                >
                  <div 
                    className={`
                      absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent
                      bg-[length:200%_100%]
                      ${agents[index].status === AgentStatus.Completed ? 'animate-gradient-flow' : ''}
                    `}
                    style={{ animationDelay: '400ms' }}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};