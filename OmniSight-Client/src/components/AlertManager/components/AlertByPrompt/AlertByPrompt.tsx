
import React, { useState } from 'react';
import { useAlertContext } from '../../context/AlertContext';
import NaturalLanguageInput from './NaturalLanguageInput';
import ConfirmationStep from './ConfirmationStep';
import SuccessStep from './SuccessStep';
import { AlertPromptRule } from '../../types';
import { parseNaturalLanguage } from './utils/promptParser';

type Step = 'input' | 'confirm' | 'success';

const AlertByPrompt: React.FC = () => {
  const [step, setStep] = useState<Step>('input');
  const [prompt, setPrompt] = useState('');
  const [parsedRule, setParsedRule] = useState<AlertPromptRule | null>(null);
  const { createNaturalLanguageRule } = useAlertContext();

  const handlePromptSubmit = (promptText: string) => {
    setPrompt(promptText);
    const rule = parseNaturalLanguage(promptText);
    setParsedRule(rule);
    setStep('confirm');
  };

  const handleConfirm = (updatedRule: AlertPromptRule) => {
    createNaturalLanguageRule(prompt);
    setParsedRule(updatedRule);
    setStep('success');
  };

  const handleReset = () => {
    setStep('input');
    setPrompt('');
    setParsedRule(null);
  };

  const handleEdit = () => {
    setStep('input');
  };

  return (
    <div className="space-y-6">
      {step === 'input' && (
        <NaturalLanguageInput
          initialPrompt={prompt}
          onSubmit={handlePromptSubmit}
        />
      )}

      {step === 'confirm' && parsedRule && (
        <ConfirmationStep
          rule={parsedRule}
          originalPrompt={prompt}
          onConfirm={handleConfirm}
          onEdit={handleEdit}
        />
      )}

      {step === 'success' && (
        <SuccessStep onCreateAnother={handleReset} />
      )}
    </div>
  );
};

export default AlertByPrompt;
