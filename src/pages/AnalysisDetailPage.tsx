import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { getAnalysisByIdApi } from "../api/resumeAnalysis.api"; // add this endpoint
import ResultsSection from "../components/resumeResults/ResultsSection";
import type { IResumeAnalysis } from "../types";

const AnalysisDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<IResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getAnalysisByIdApi(id);
        setAnalysis(res.data);
      } catch {
        setError("Failed to load analysis. It may have been deleted.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Home
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={28} className="animate-spin text-zinc-600" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <AlertCircle size={32} className="text-zinc-700" />
          <p className="text-sm text-zinc-500">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-300 transition-colors"
          >
            Go Home
          </button>
        </div>
      )}

      {/* Results */}
      {!loading && analysis && (
        <ResultsSection
          result={analysis.llmResponse}
          fileName={analysis.originalFileName}
          // No onReset here — this is a saved analysis detail view
        />
      )}
    </div>
  );
};

export default AnalysisDetailPage;