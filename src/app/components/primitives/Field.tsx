"use client";

import React from "react";

const Field: React.FC<{
  title?: string | React.ReactNode;
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ title, label, description, required, children, className }) => (
  <div className={`block ${className || ""}`}>
    <div className="mb-1 text-md semibold text-stone-700">
      {required && <span className="text-rose-600">* </span>}
      {title}
    </div>
    {description && (
      <div className="mb-2 text-sm text-stone-500 italic max-w-4xl">
        {description}
      </div>
    )}
    <div className="mb-1 text-sm semibold text-stone-700">{label}</div>
    {children}
  </div>
);

export default Field;
