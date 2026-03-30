import React, { useState, useRef, useCallback, useEffect } from "react";
import { Upload, FileText, X, AlignLeft } from "lucide-react";
import { toast } from "react-toastify";
import {
  analyzeResumeApi,
  analyzeResumeTextApi,
} from "../api/resumeAnalysis.api";
import type { ILlmResponse } from "../types";
import ButtonLoader from "../components/loaders/ButtonLoader";
import ResultsSection from "../components/resumeResults/ResultsSection";

const MAX_SIZE_MB = 5;

const validatePDF = (file: File): string | null => {
  if (file.type !== "application/pdf")
    return "Only PDF files are accepted. Please upload a .pdf file.";
  if (file.size > MAX_SIZE_MB * 1024 * 1024)
    return `File exceeds the ${MAX_SIZE_MB}MB limit. Please compress your PDF.`;
  return null;
};

type InputTab = "upload" | "paste";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<InputTab>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ILlmResponse | null>(null);
  const [analyzedFileName, setAnalyzedFileName] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // "New Analysis" event from sidebar
  useEffect(() => {
    const handler = () => handleReset();
    window.addEventListener("analysis:new", handler);
    return () => window.removeEventListener("analysis:new", handler);
  }, []);

  // Scroll to results
  useEffect(() => {
    if (result)
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, [result]);

  const handleFileDrop = useCallback((dropped: File | null) => {
    if (!dropped) return;
    const err = validatePDF(dropped);
    if (err) {
      toast.error(err);
      return;
    }
    setFile(dropped);
    setResult(null);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileDrop(e.dataTransfer.files[0] ?? null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileDrop(e.target.files?.[0] ?? null);
    e.target.value = "";
  };

  const handleAnalyze = async () => {
    const isUpload = activeTab === "upload";
    const isPaste = activeTab === "paste";

    if (isUpload && !file) {
      toast.warning("Please select a PDF file first.");
      return;
    }
    if (isPaste && !resumeText.trim()) {
      toast.warning("Please paste your resume text first.");
      return;
    }

    try {
      setIsAnalyzing(true);
      toast.info("Analyzing your resume…", { autoClose: 2000 });

      let res
      if (isUpload && file) {
        res = await analyzeResumeApi(file);
        setAnalyzedFileName(file.name);
      } else {
        // analyzeResumeTextApi — implement in your API layer
        res = await analyzeResumeTextApi(resumeText.trim());
        setAnalyzedFileName("Pasted Resume");
      }

      setResult(res.data.llmResponse);
      toast.success("Analysis complete!");
      window.dispatchEvent(new CustomEvent("analysis:refresh"));
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Analysis failed. Please try again.";
      toast.error(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResumeText("");
    setResult(null);
    setAnalyzedFileName("");
  };

  const canAnalyze =
    (activeTab === "upload" && !!file) ||
    (activeTab === "paste" && resumeText.trim().length > 50);

  return (
    <div className="min-h-full  p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
          Resume Analyzer
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Upload a PDF or paste your resume text for instant AI-powered
          feedback.
        </p>
      </div>

      {/* ── Upload / Paste section (hidden once results shown) ─────────── */}
      {!result && (
        <div className="space-y-4 mb-8">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "upload"
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Upload size={14} />
              Upload PDF
            </button>
            <button
              onClick={() => setActiveTab("paste")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "paste"
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <AlignLeft size={14} />
              Paste Text
            </button>
          </div>

          {/* ── Upload tab ── */}
          {activeTab === "upload" && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !file && inputRef.current?.click()}
              className={`
                relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer
                ${
                  file
                    ? "border-zinc-700 bg-zinc-900 cursor-default"
                    : isDragOver
                      ? "border-indigo-500 bg-indigo-500/5 scale-[1.01]"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-600 hover:bg-zinc-800/50"
                }
              `}
            >
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleInputChange}
              />

              {file ? (
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center">
                      <FileText size={18} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-100 max-w-[220px] sm:max-w-xs truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {(file.size / 1024).toFixed(0)} KB · PDF
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                      isDragOver
                        ? "bg-indigo-600"
                        : "bg-zinc-800 border border-zinc-700"
                    }`}
                  >
                    <Upload
                      size={22}
                      className={isDragOver ? "text-white" : "text-zinc-400"}
                    />
                  </div>
                  <p className="text-sm font-medium text-zinc-200 mb-1">
                    {isDragOver ? "Drop it here!" : "Drop your resume here"}
                  </p>
                  <p className="text-xs text-zinc-500">
                    or{" "}
                    <span className="text-indigo-400 underline underline-offset-2">
                      click to browse
                    </span>{" "}
                    · PDF only · max {MAX_SIZE_MB}MB
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Paste tab ── */}
          {activeTab === "paste" && (
            <div className="relative">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here…&#10;&#10;Include your work experience, skills, education, and any other relevant sections."
                rows={12}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:border-zinc-600 transition-colors leading-relaxed"
              />
              {resumeText && (
                <button
                  onClick={() => setResumeText("")}
                  className="absolute top-3 right-3 p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
              <p className="text-xs text-zinc-600 mt-2 px-1">
                {resumeText.trim().length} characters
                {resumeText.trim().length > 0 &&
                  resumeText.trim().length < 50 && (
                    <span className="text-amber-600 ml-2">
                      — add more content for a better analysis
                    </span>
                  )}
              </p>
            </div>
          )}

          {/* Analyze button */}
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze || isAnalyzing}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-medium text-sm transition-all duration-150 shadow-lg shadow-indigo-500/20 disabled:shadow-none active:scale-[0.98] disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <ButtonLoader size={16} />
                Analyzing…
              </>
            ) : (
              <>
                <FileText size={16} />
                Analyze Resume
              </>
            )}
          </button>
        </div>
      )}

      {/* ── Results ───────────────────────────────────────────────────── */}
      {result && (
        <div ref={resultsRef}>
          <ResultsSection
            result={result}
            fileName={analyzedFileName}
            onReset={handleReset}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
