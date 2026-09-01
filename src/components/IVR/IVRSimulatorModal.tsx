import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  PhoneOff,
  Volume2,
  VolumeX,
  Mic,
  RotateCcw,
  Sparkles,
  X,
  Languages,
} from 'lucide-react';
import { Language } from '../../types';
import { ivrService, IVRResponse } from '../../services/ivrService';

interface IVRSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const IVRSimulatorModal: React.FC<IVRSimulatorModalProps> = ({
  isOpen,
  onClose,
  language: defaultLang,
}) => {
  const [callActive, setCallActive] = useState<boolean>(false);
  const [currentResponse, setCurrentResponse] = useState<IVRResponse | null>(null);
  const [activeLang, setActiveLang] = useState<Language>(defaultLang);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [keyLog, setKeyLog] = useState<string[]>([]);

  // Sound generator for DTMF tones
  const playDTMFTone = (key: string) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      const keyFreqs: Record<string, [number, number]> = {
        '1': [697, 1209],
        '2': [697, 1336],
        '3': [697, 1477],
        '4': [770, 1209],
        '5': [770, 1336],
        '6': [770, 1477],
        '7': [852, 1209],
        '8': [852, 1336],
        '9': [852, 1477],
        '*': [941, 1209],
        '0': [941, 1336],
        '#': [941, 1477],
      };

      const [f1, f2] = keyFreqs[key] || [800, 1200];
      osc1.frequency.value = f1;
      osc2.frequency.value = f2;
      gain.gain.value = 0.1;

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      setTimeout(() => {
        osc1.stop();
        osc2.stop();
        ctx.close();
      }, 120);
    } catch {
      // AudioContext fallback
    }
  };

  // Text to Speech
  const speakPrompt = (text: string, lang: Language) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (lang === 'ta') utterance.lang = 'ta-IN';
    else if (lang === 'hi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Call timer
  useEffect(() => {
    let interval: any;
    if (callActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [callActive]);

  if (!isOpen) return null;

  const handleStartCall = () => {
    setCallActive(true);
    setKeyLog([]);
    const res = ivrService.startCall();
    setCurrentResponse(res);
    speakPrompt(res.promptText.ta, 'ta');
  };

  const handleEndCall = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    const res = ivrService.endCall();
    setCurrentResponse(res);
    setCallActive(false);
  };

  const handleKeyPress = (key: string) => {
    if (!callActive) return;
    playDTMFTone(key);
    setKeyLog((prev) => [...prev, key]);

    // Handle language switch
    if (currentResponse?.state === 'LANGUAGE_SELECT') {
      if (key === '1') setActiveLang('ta');
      else if (key === '2') setActiveLang('en');
      else if (key === '3') setActiveLang('hi');
    }

    const res = ivrService.handleKeyPress(key);
    setCurrentResponse(res);

    const prompt = res.promptText[activeLang] || res.promptText.en;
    speakPrompt(prompt, activeLang);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activePromptText = currentResponse
    ? currentResponse.promptText[activeLang] || currentResponse.promptText.en
    : 'Press Call to connect to FarmerConnect Toll-Free Voice Assistant';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3129]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#2D3129] text-[#FDFCF8] rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-[#4A6741]/40 relative overflow-hidden flex flex-col justify-between">
        <button
          onClick={() => {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full text-[#827D6B] hover:text-[#FDFCF8] hover:bg-[#3D5635] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Screen Header */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#4A6741]/30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#4A6741] text-white flex items-center justify-center">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#FDFCF8] tracking-wide">
                  FarmerConnect IVR Simulation
                </h3>
                <span className="text-[10px] text-[#A6A292] font-mono">
                  Toll-Free: 1800-425-3276
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSpeechEnabled(!speechEnabled)}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  speechEnabled ? 'text-[#E6F0E4] bg-[#4A6741]' : 'text-[#827D6B] bg-[#22251E]'
                }`}
                title={speechEnabled ? 'Voice Sound Active' : 'Voice Sound Muted'}
              >
                {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <span className="font-mono text-xs text-[#D97757] font-bold bg-[#22251E] px-2 py-0.5 rounded-lg">
                {callActive ? formatTimer(callDuration) : '00:00'}
              </span>
            </div>
          </div>

          {/* Simulated Voice Output Screen */}
          <div className="mt-4 p-4 rounded-2xl bg-[#22251E] border border-[#4A6741]/30 min-h-[120px] flex flex-col justify-between">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-[#4A6741]/40 text-[#A6C99B] flex items-center justify-center shrink-0 mt-0.5">
                <Mic className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <p className="text-xs sm:text-sm text-[#E6F0E4] font-medium leading-relaxed">
                {activePromptText}
              </p>
            </div>

            {currentResponse?.actionResult && (
              <div className="mt-2 p-2 bg-[#4A6741]/40 border border-[#4A6741]/50 rounded-xl text-xs text-[#E6F0E4] font-semibold">
                ✓ {currentResponse.actionResult}
              </div>
            )}

            {callActive && (
              <div className="flex items-center justify-between pt-2 border-t border-[#4A6741]/20 text-[10px] text-[#827D6B]">
                <span>Language: {activeLang === 'ta' ? 'தமிழ்' : activeLang === 'hi' ? 'हिन्दी' : 'English'}</span>
                <span>Keys Pressed: [{keyLog.join(' → ')}]</span>
              </div>
            )}
          </div>

          {/* Interactive Prompt Options Display */}
          {callActive && currentResponse?.options && currentResponse.options.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
              {currentResponse.options.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleKeyPress(opt.key)}
                  className="px-2.5 py-1 rounded-xl bg-[#22251E] hover:bg-[#3D5635] text-[11px] font-bold text-[#D97757] border border-[#4A6741]/30 transition-colors"
                >
                  {opt.label[activeLang] || opt.label.en}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DTMF Keypad (Telephone Layout) */}
        <div className="my-5">
          <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto">
            {[
              { key: '1', sub: '.,' },
              { key: '2', sub: 'ABC' },
              { key: '3', sub: 'DEF' },
              { key: '4', sub: 'GHI' },
              { key: '5', sub: 'JKL' },
              { key: '6', sub: 'MNO' },
              { key: '7', sub: 'PQRS' },
              { key: '8', sub: 'TUV' },
              { key: '9', sub: 'WXYZ' },
              { key: '*', sub: 'Menu' },
              { key: '0', sub: '+' },
              { key: '#', sub: 'End' },
            ].map((btn) => (
              <button
                key={btn.key}
                disabled={!callActive && btn.key !== '1'}
                onClick={() => handleKeyPress(btn.key)}
                className="h-13 rounded-2xl bg-[#22251E] hover:bg-[#3D5635] active:bg-[#4A6741] active:scale-95 text-[#FDFCF8] font-bold text-lg flex flex-col items-center justify-center border border-[#4A6741]/30 transition-all disabled:opacity-40 disabled:pointer-events-none shadow-xs"
              >
                <span>{btn.key}</span>
                <span className="text-[8px] text-[#827D6B] -mt-1 font-mono tracking-widest uppercase">
                  {btn.sub}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Call Controls */}
        <div className="pt-3 border-t border-[#4A6741]/30 flex justify-center gap-4">
          {!callActive ? (
            <button
              onClick={handleStartCall}
              className="w-full max-w-[260px] py-3.5 bg-[#4A6741] hover:bg-[#3D5635] text-white font-bold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Dial Toll-Free (1800-425-3276)</span>
            </button>
          ) : (
            <button
              onClick={handleEndCall}
              className="w-full max-w-[260px] py-3.5 bg-[#D97757] hover:bg-[#C26344] text-white font-bold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <PhoneOff className="w-5 h-5" />
              <span>End Call</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
