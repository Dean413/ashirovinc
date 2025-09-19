// SpinnerButton.tsx
"use client";
import React, { ReactNode } from "react";

interface SpinnerButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export default function SpinnerButton({
  onClick,
  loading = false,
  disabled = false,
  children,
  className = "",
}: SpinnerButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-2 py-1 bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center w-8 h-8 ${className}`}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
          />
        </svg>
      ) : (
        children
      )}
    </button>
  );
}
