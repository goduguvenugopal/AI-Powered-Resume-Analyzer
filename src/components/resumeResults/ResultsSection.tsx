 
import {
  FileText,
  RotateCcw,
  Star,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import type { ILlmResponse } from "../../types";

// ─── Score Ring ───────────────────────────────────────────────────────────────
const ScoreRing = ({ score }: { score: number }) => {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center w-28 h-28">
      <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
        <circle cx="56" cy="56" r={r} fill="none" stroke="#27272a" strokeWidth="8" />
        <circle
          cx="56"
          cy="56"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-bold text-zinc-100">{score}</p>
        <p className="text-[10px] text-zinc-500 -mt-1">/ 100</p>
      </div>
    </div>
  );
};

// ─── Results Section ──────────────────────────────────────────────────────────
interface ResultsSectionProps {
  result: ILlmResponse;
  fileName?: string;
  /** If provided, renders the "Analyze new" reset button in the header */
  onReset?: () => void;
}

const ResultsSection = ({ result, fileName, onReset }: ResultsSectionProps) => (
  <div className="space-y-6 ">
    {/* Header row */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-zinc-900 border border-zinc-800 rounded-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
          <FileText size={18} className="text-indigo-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-100 max-w-[200px] truncate">
            {fileName ?? "Resume Analysis"}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">Analysis complete</p>
        </div>
      </div>
      {onReset && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors self-start sm:self-auto"
        >
          <RotateCcw size={14} />
          Analyze new
        </button>
      )}
    </div>

    {/* Score + summary */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="sm:col-span-1 flex flex-col items-center justify-center p-6 bg-zinc-900 border border-zinc-800 rounded-2xl gap-3">
        {result.score !== undefined && <ScoreRing score={result.score} />}
        <div className="text-center">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
            Resume Score
          </p>
          {result.score !== undefined && (
            <p className="text-xs text-zinc-600 mt-1">
              {result.score >= 80 ? "Excellent" : result.score >= 60 ? "Good" : "Needs work"}
            </p>
          )}
        </div>
      </div>
      <div className="sm:col-span-2 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <Star size={11} />
          Summary
        </p>
        <p className="text-sm text-zinc-300 leading-relaxed flex-1">{result.summary}</p>
      </div>
    </div>

    {/* Strengths / Weaknesses / Suggestions */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Strengths */}
      <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <CheckCircle size={11} />
          Strengths
        </p>
        <ul className="space-y-2">
          {result.strengths.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
              <CheckCircle size={13} className="text-emerald-500 mt-0.5 shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <p className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <AlertCircle size={11} />
          Weaknesses
        </p>
        <ul className="space-y-2">
          {result.weaknesses.map((w, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
              <AlertCircle size={13} className="text-red-500 mt-0.5 shrink-0" />
              {w}
            </li>
          ))}
        </ul>
      </div>

      {/* Suggestions */}
      <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <Lightbulb size={11} />
          Suggestions
        </p>
        <ul className="space-y-2">
          {result.suggestions.map((s:any, i:any) => (
            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
              <ChevronRight size={13} className="text-indigo-500 mt-0.5 shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default ResultsSection;