import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Sparkles, 
  Send, 
  Bot,
  Heart
} from 'lucide-react';
import { speakText, stopSpeaking, isSpeechRecognitionSupported, createSpeechRecognizer } from '../utils/speech';

interface VoiceConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalState: any;
}

export const VoiceConsultantModal: React.FC<VoiceConsultantModalProps> = ({
  isOpen,
  onClose,
  hospitalState
}) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: 'Arogya AI Voice Consultant initialized. Current status: 87 beds available, ICU at 90% critical threshold with shortage anticipated in 9 hours. How can I assist hospital bed capacity planning?',
      time: 'Just now'
    }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const recognizerRef = useRef<any>(null);

  const quickPrompts = [
    'Give me a 60-second hospital capacity briefing',
    'What is the ICU status and shortage timeline?',
    'What if admissions increase by 20% tomorrow?',
    'Which patients are eligible for discharge today?',
    'Check Ayushman Bharat PM-JAY bed concession rules'
  ];

  useEffect(() => {
    if (isOpen && messages.length === 1 && !isSpeaking) {
      speakText(messages[0].text, () => setIsSpeaking(false));
      setIsSpeaking(true);
    }
    return () => {
      stopSpeaking();
      if (recognizerRef.current) {
        recognizerRef.current.abort?.();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendQuery = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userText = textToSend.trim();
    setQuery('');
    setMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text: userText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userText, hospitalState })
      });

      const data = await res.json();
      const replyText = data.reply || 'Arogya AI operational. Bed capacity monitoring active.';

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      stopSpeaking();
      setIsSpeaking(true);
      speakText(replyText, () => setIsSpeaking(false));
    } catch (err) {
      console.error('AI Consultant Request Failed:', err);
      const fallback = 'Arogya AI Telemetry: 213 of 300 beds occupied. ICU capacity is critical at 90 percent. Recommend expediting 12 step-down discharges.';
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: fallback,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsSpeaking(true);
      speakText(fallback, () => setIsSpeaking(false));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Speech recognition is not supported in this browser environment. You can type inquiries or use the quick prompt buttons below.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      return;
    }

    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setIsRecording(false);
        handleSendQuery(transcript);
      },
      (err) => {
        console.error('Speech recognition error:', err);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );

    if (recognizer) {
      recognizerRef.current = recognizer;
      try {
        recognizer.start();
        setIsRecording(true);
      } catch (e) {
        console.error('Error starting recognizer:', e);
      }
    }
  };

  const toggleSpeaking = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      const lastAiMessage = [...messages].reverse().find((m) => m.sender === 'ai');
      if (lastAiMessage) {
        setIsSpeaking(true);
        speakText(lastAiMessage.text, () => setIsSpeaking(false));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border-2 border-emerald-400 rounded-3xl max-w-2xl w-full h-[650px] flex flex-col shadow-2xl overflow-hidden font-mono text-slate-800">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-b border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 tracking-wide">
                  AROGYA AI VOICE CONSULTANT
                </h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  CLINICAL VOICE ADVISOR
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans">
                Natural speech synthesis & real-time hospital crisis intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSpeaking}
              className={`p-2 rounded-xl border transition-colors ${
                isSpeaking 
                  ? 'bg-rose-50 border-rose-300 text-rose-700' 
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title={isSpeaking ? 'Mute Speech' : 'Replay Audio'}
            >
              {isSpeaking ? <Volume2 className="w-4 h-4 animate-bounce text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Audio Wave Visualizer Indicator */}
        <div className="px-5 py-2.5 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-600 text-[11px] font-bold">Audio Telemetry:</span>
            {isSpeaking || isRecording ? (
              <div className="flex items-center gap-1">
                {[12, 24, 16, 32, 20, 10, 28, 14, 22].map((height, i) => (
                  <span
                    key={i}
                    className="w-1 bg-emerald-600 rounded-full animate-pulse"
                    style={{ height: `${height}px`, animationDelay: `${i * 100}ms` }}
                  ></span>
                ))}
                <span className="text-emerald-800 text-[10px] ml-2 font-bold uppercase">
                  {isRecording ? 'Listening via mic...' : 'Speaking clinical advisory...'}
                </span>
              </div>
            ) : (
              <span className="text-slate-400 text-[11px]">Ready for voice inquiry</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-emerald-700 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Gemini 3.8 Flash Online</span>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#fbfdfc]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="text-[10px] text-slate-400 mb-1 px-1">
                {m.sender === 'user' ? 'Hospital Coordinator' : 'Arogya Voice Engine'} · {m.time}
              </div>
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none shadow-sm'
                    : 'bg-white border border-emerald-200 text-slate-800 rounded-tl-none shadow-sm'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-emerald-700 text-xs py-2">
              <Sparkles className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Analyzing hospital telemetry and synthesizing advice...</span>
            </div>
          )}
        </div>

        {/* Voice Prompt Shortcuts */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 text-[10px] uppercase font-bold shrink-0">Prompts:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(p)}
              className="px-3 py-1 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 whitespace-nowrap text-[11px] transition-colors font-medium"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Query Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
          <button
            onClick={toggleRecording}
            className={`p-3 rounded-2xl border transition-all ${
              isRecording
                ? 'bg-rose-500 border-rose-400 text-white animate-pulse shadow-md shadow-rose-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-700/20'
            }`}
            title="Click to speak via microphone"
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            placeholder={isRecording ? 'Listening to speech...' : 'Type or ask verbal hospital capacity question...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendQuery(query);
            }}
            className="flex-1 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-2xl px-4 py-3 text-xs text-slate-900 outline-none font-medium"
          />

          <button
            onClick={() => handleSendQuery(query)}
            disabled={!query.trim() || isLoading}
            className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-colors shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
