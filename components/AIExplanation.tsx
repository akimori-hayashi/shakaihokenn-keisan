"use client";

import { useState } from "react";
import { InsuranceResult } from "@/lib/calculator";
import { FormValues } from "./CalculatorForm";

interface AIExplanationProps {
  result: InsuranceResult;
  formValues: FormValues;
}

export default function AIExplanation({
  result,
  formValues,
}: AIExplanationProps) {
  const [explanation, setExplanation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [activeModel, setActiveModel] = useState<"haiku" | "sonnet" | null>(
    null
  );

  const fetchExplanation = async (modelType: "haiku" | "sonnet") => {
    setLoading(true);
    setError("");
    setExplanation("");
    setActiveModel(modelType);

    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelType,
          calculationData: {
            monthlySalary: formValues.monthlySalary,
            age: formValues.age,
            prefecture: formValues.prefecture,
            bonus: formValues.bonus ?? 0,
            employmentType: formValues.employmentType,
            healthInsuranceEmployee: result.healthInsuranceEmployee,
            nursingCareEmployee: result.nursingCareEmployee,
            pensionEmployee: result.pensionEmployee,
            employmentInsuranceEmployee: result.employmentInsuranceEmployee,
            totalEmployee: result.totalEmployee,
            takeHomePay: result.takeHomePay,
            healthInsuranceRate: result.healthInsuranceRate,
            requiresNursingCare: result.requiresNursingCare,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "エラーが発生しました");
        return;
      }

      setExplanation(data.explanation);
    } catch {
      setError("ネットワークエラーが発生しました。再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
        AI解説
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        計算結果についてAIが解説します。
      </p>

      <div className="flex flex-wrap gap-3 mb-5">
        <button
          onClick={() => fetchExplanation("haiku")}
          disabled={loading}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm ${
            activeModel === "haiku" && !loading
              ? "bg-indigo-600 text-white"
              : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading && activeModel === "haiku" ? (
            <>
              <LoadingSpinner />
              解説中...
            </>
          ) : (
            "簡単に解説"
          )}
        </button>

        <button
          onClick={() => fetchExplanation("sonnet")}
          disabled={loading}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm ${
            activeModel === "sonnet" && !loading
              ? "bg-purple-600 text-white"
              : "bg-purple-100 text-purple-700 hover:bg-purple-200"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading && activeModel === "sonnet" ? (
            <>
              <LoadingSpinner />
              解説中...
            </>
          ) : (
            "詳しく解説"
          )}
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-3 py-6 text-gray-500">
          <LoadingSpinner className="w-5 h-5" />
          <span className="text-sm">AIが解説を生成しています...</span>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          <span className="font-semibold">エラー：</span> {error}
        </div>
      )}

      {explanation && !loading && (
        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap border border-gray-200">
          {explanation}
        </div>
      )}
    </div>
  );
}

function LoadingSpinner({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
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
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
