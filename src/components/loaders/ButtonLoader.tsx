import React from "react";

interface ButtonLoaderProps {
  size?: number;
  className?: string;
}

/**
 * Inline spinner for buttons.
 * Usage: <button disabled={loading}>{loading ? <ButtonLoader /> : "Submit"}</button>
 */
const ButtonLoader = ({ size = 16, className = "" }: ButtonLoaderProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    className={`animate-spin ${className}`}
    aria-label="Loading"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default ButtonLoader;