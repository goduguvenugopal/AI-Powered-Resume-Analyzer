import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileSearch, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ButtonLoader from "../components/loaders/ButtonLoader";

const features = [
  {
    icon: FileSearch,
    label: "Deep resume analysis",
    desc: "AI reads every line and scores your resume out of 100.",
  },
  {
    icon: TrendingUp,
    label: "Track your improvement",
    desc: "See how your score changes with every revision.",
  },
  {
    icon: Sparkles,
    label: "Actionable suggestions",
    desc: "Clear steps, not vague advice.",
  },
  {
    icon: ShieldCheck,
    label: "Private & secure",
    desc: "Your data stays yours. Always.",
  },
];

const LoginPage = () => {
  const { loginWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/", { replace: true });
  }, [user, loading, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setIsSigningIn(true);
      await loginWithGoogle();
      toast.success("Welcome back!");
      navigate("/", { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (!msg.includes("popup-closed")) {
        toast.error("Sign-in failed. Please try again.");
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* ── Left hero panel (desktop only) ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 right-0 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <FileSearch size={17} className="text-white" />
          </div>
          <span className="font-semibold text-zinc-100 text-sm tracking-tight">
            Resume<span className="text-indigo-400">Analyser</span>
          </span>
        </div>

        {/* Copy */}
        <div className="relative space-y-6 mt-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
            <Sparkles size={11} />
            Powered by Groq LLM
          </span>
          <h1 className="text-5xl font-bold text-zinc-100 leading-tight tracking-tight">
            Land the job
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              you deserve.
            </span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
            Upload your resume and get instant AI-powered feedback — score,
            strengths, weaknesses, and exactly what to fix.
          </p>
          <div className="grid gap-4 pt-2">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">{label}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-zinc-700">
          © {new Date().getFullYear()} ResumeAI · All rights reserved.
        </p>
      </div>

      {/* ── Right sign-in panel ─────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 bg-zinc-900 border-l border-zinc-800/60">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <FileSearch size={15} className="text-white" />
            </div>
            <span className="text-base font-bold text-zinc-100">
              Resume<span className="text-indigo-400">Analyser</span>
            </span>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">
              Sign in
            </h2>
            <p className="text-zinc-500 text-sm mt-1.5">
              Continue with your Google account to get started.
            </p>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isSigningIn}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-zinc-900 font-medium text-sm py-3 px-4 rounded-xl transition-all duration-150 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSigningIn ? (
              <>
                <ButtonLoader size={17} className="text-zinc-500" />
                <span className="text-zinc-500">Signing in…</span>
              </>
            ) : (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-xs text-zinc-600">
              Secure · Firebase Auth
            </span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          {/* Trust note */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
            <ShieldCheck
              size={15}
              className="text-indigo-400 mt-0.5 shrink-0"
            />
            <p className="text-xs text-zinc-400 leading-relaxed">
              We only request your name, email, and profile photo. Resume data
              is never sold or shared.
            </p>
          </div>

          <p className="text-xs text-zinc-700 text-center">
            By continuing you agree to our{" "}
            <span className="text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors">
              Terms
            </span>{" "}
            and{" "}
            <span className="text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
