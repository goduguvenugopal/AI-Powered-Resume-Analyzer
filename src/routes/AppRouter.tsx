import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";
import Layout from "../layout/Layout";
import LoginPage from "../pages/LoginPage";
import PageLoader from "../components/loaders/PageLoader";

// Lazy-load all protected pages for better initial bundle size
const HomePage = React.lazy(() => import("../pages/HomePage"));
 
const AnalysisDetailPage = React.lazy(() => import("../pages/AnalysisDetailPage"));

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <React.Suspense fallback={<PageLoader message="Loading…" />}>
    {children}
  </React.Suspense>
);

export const AppRouter = createBrowserRouter([
  // ── Public ──────────────────────────────────────────────────────────────
  {
    path: "/login",
    element: <LoginPage />,
  },

  // ── Protected (requires auth) ────────────────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: "/",
            element: (
              <SuspenseWrapper>
                <HomePage />
              </SuspenseWrapper>
            ),
          },
           
          {
            path: "/analysis/:id",
            element: (
              <SuspenseWrapper>
                <AnalysisDetailPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },

  // ── Catch-all ────────────────────────────────────────────────────────────
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);