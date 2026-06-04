import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Imports από τη σωστή δομή φακέλων
import FloatingNav from './components/ui/FloatingNav';
import { SkeletonTimeline, SkeletonMap } from './components/ui/Skeletons';
import StepIndicator from './components/ui/StepIndicator';
import { StepDestination, StepStyle, StepDuration } from './components/wizard/WizardSteps';
import TopoCanvas from './components/canvas/TopoCanvas';
import Stars from './components/Stars';
import { usePlanner } from "./styles/hooks/usePlanner"; 

export default function App() {
  const [step, setStep] = useState(0);
  const [activeTab, setActiveTab] = useState('explore');
  const [selections, setSelections] = useState({ island: null, style: null, duration: 7 });

  const { data, loading, fetchPlan } = usePlanner();

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      fetchPlan(selections);
    }
  };

  return (
    <div className="noise-overlay relative h-full w-full bg-aegean-950 text-white overflow-hidden font-sans">
      <Stars />
      
      <main className="relative z-10 h-screen w-full flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/10">
          <StepIndicator current={step} total={3} />
          
          <div className="mt-8">
            {step === 0 && <StepDestination selections={selections} setSelections={setSelections} onNext={handleNext} />}
            {step === 1 && <StepStyle selections={selections} setSelections={setSelections} onNext={handleNext} />}
            {step === 2 && <StepDuration selections={selections} setSelections={setSelections} onNext={handleNext} />}
          </div>
        </div>
      </main>

      <FloatingNav activeId={activeTab} onChange={setActiveTab} />
      
      <div className="fixed inset-0 z-0">
        <TopoCanvas />
      </div>
    </div>
  );
}