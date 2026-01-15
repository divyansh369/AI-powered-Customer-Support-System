import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, Zap, Database, Brain } from 'lucide-react';

const TypingIndicator = ({ stage = 'thinking' }) => {
  const [dots, setDots] = useState('');
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const stageWords = useMemo(() => {
    return {
      routing: ['Routing', 'Assigning', 'Selecting agent'],
      thinking: ['Thinking', 'Analyzing', 'Planning'],
      fetching: ['Searching', 'Fetching', 'Looking up records'],
      generating: ['Generating', 'Composing', 'Finalizing'],
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => prev + 1);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const stages = {
    routing: {
      icon: <Zap size={16} />,
      label: 'Routing your message',
      className: 'stage-routing',
    },
    thinking: {
      icon: <Brain size={16} />,
      label: 'Agent is thinking',
      className: 'stage-thinking',
    },
    fetching: {
      icon: <Database size={16} />,
      label: 'Fetching data',
      className: 'stage-fetching',
    },
    generating: {
      icon: <Loader2 size={16} className="spinning" />,
      label: 'Generating response',
      className: 'stage-generating',
    },
  };

  const currentStage = stages[stage] || stages.thinking;

  const words = stageWords[stage] || stageWords.thinking;
  const rotatingWord = words[wordIndex % words.length];

  return (
    <div className="typing-indicator-wrapper">
      <div className={`typing-indicator-advanced ${currentStage.className}`}>
        <div className="typing-indicator-icon">
          {currentStage.icon}
        </div>

        <div className="typing-indicator-text">
          <div className="typing-indicator-main">
            {currentStage.label}
            <span className="typing-dots">{dots}</span>
          </div>

          <div className="typing-indicator-sub">
            {rotatingWord}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;