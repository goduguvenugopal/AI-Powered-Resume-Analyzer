import  { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FileText,
  Plus,
  Trash2,
  Clock,
  X,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import { getMyAnalysesApi, deleteAnalysisApi } from "../api/resumeAnalysis.api";
import type { IResumeAnalysis } from "../types";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "../utils/date.utils";
import ConfirmModal from "../components/modals/ConfirmModal";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const ScoreBadge = ({ score }: { score?: number }) => {
  if (score === undefined) return null;
  const color =
    score >= 80
      ? "text-emerald-400 bg-emerald-400/10"
      : score >= 60
        ? "text-amber-400 bg-amber-400/10"
        : "text-red-400 bg-red-400/10";
  return (
    <span
      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${color}`}
    >
      {score}
    </span>
  );
};

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [history, setHistory] = useState<IResumeAnalysis[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoadingHistory(true);
      const res = await getMyAnalysesApi({ limit: 30, sortOrder: "desc" });
      setHistory(res.data);
    } catch {
      // silently fail
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
    const handler = () => fetchHistory();
    window.addEventListener("analysis:refresh", handler);
    return () => window.removeEventListener("analysis:refresh", handler);
  }, [fetchHistory]);

  const handleDeleteConfirm = async () => {
    if (!confirmId) return;
    try {
      setDeletingId(confirmId);
      await deleteAnalysisApi(confirmId);
      setHistory((prev) => prev.filter((a) => a._id !== confirmId));
      toast.success("Analysis deleted");
      if (location.pathname === `/analysis/${confirmId}`) navigate("/");
    } catch {
      toast.error("Failed to delete analysis");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const isActive = (id: string) => location.pathname === `/analysis/${id}`;

  return (
    <>
      {/* Backdrop — all screen sizes */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel — always fixed, controlled via translate */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-zinc-900 border-r border-zinc-800/60
          flex flex-col transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-zinc-800/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <FileText size={14} className="text-white" />
            </div>
            <span className="font-semibold text-zinc-100 text-sm tracking-tight">
              Resume<span className="text-indigo-400">Analyser</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="px-3 pt-3 pb-2 shrink-0">
          <button
            onClick={() => {
              navigate("/");
              onClose();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                location.pathname === "/"
                  ? "bg-indigo-600/20 text-indigo-300"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              }`}
          >
            <LayoutDashboard size={15} />
            Home
          </button>
        </nav>

        {/* New Analysis */}
        <div className="px-3 pb-3 shrink-0">
          <button
            onClick={() => {
              navigate("/");
              onClose();
              window.dispatchEvent(new CustomEvent("analysis:new"));
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Plus size={15} />
            New Analysis
          </button>
        </div>

        <div className="px-4 pb-2 shrink-0">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-600 uppercase tracking-widest">
            <Clock size={11} />
            History
          </div>
        </div>

        {/* History list */}
        <div className="flex-1 custom-scroll overflow-y-auto px-3 pb-4 space-y-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
          {loadingHistory ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={18} className="animate-spin text-zinc-600" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 px-3">
              <FileText size={24} className="text-zinc-700 mx-auto mb-2" />
              <p className="text-xs text-zinc-600">No analyses yet</p>
            </div>
          ) : (
            history.map((item) => (
              <button
                key={item._id}
                onClick={() => {
                  navigate(`/analysis/${item._id}`);
                  onClose();
                }}
                className={`w-full group flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors
                  ${
                    isActive(item._id)
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                  }`}
              >
                <FileText size={13} className="mt-0.5 shrink-0 text-zinc-600" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <ScoreBadge score={item.llmResponse.score} />
                    <span className="text-[10px] text-zinc-600">
                      {formatDistanceToNow(item.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs truncate leading-relaxed">
                    {item.llmResponse.summary.slice(0, 60)}…
                  </p>
                </div>

                {/*
                  Delete button:
                  - Always visible on mobile/touch (sm:opacity-0 hides only on sm+)
                  - Revealed on hover for larger screens
                */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmId(item._id);
                  }}
                  disabled={deletingId === item._id}
                  className="sm:opacity-0 sm:group-hover:opacity-100 mt-0.5 p-1 rounded text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0"
                  aria-label="Delete analysis"
                >
                  {deletingId === item._id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                </button>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Confirm delete modal */}
      <ConfirmModal
        open={!!confirmId}
        title="Delete Analysis"
        message="This analysis will be permanently removed from your history. This action cannot be undone."
        confirmLabel="Delete"
        loading={!!deletingId}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
};

export default Sidebar;
