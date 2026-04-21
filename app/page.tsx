"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CalculatorForm, { FormValues } from "@/components/CalculatorForm";
import ResultTable from "@/components/ResultTable";
import AIExplanation from "@/components/AIExplanation";
import {
  calculateInsurance,
  InsuranceResult,
  decodeShareParams,
  encodeShareParams,
} from "@/lib/calculator";

function ShareButton({
  formValues,
}: {
  formValues: FormValues;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const params = encodeShareParams({
      salary: String(formValues.monthlySalary),
      age: String(formValues.age),
      prefecture: formValues.prefecture,
      bonus: String(formValues.bonus ?? 0),
      employment: formValues.employmentType,
    });

    const baseUrl =
      typeof window !== "undefined"
        ? `${window.location.protocol}//${window.location.host}/`
        : "https://your-app.vercel.app/";

    const shareUrl = `${baseUrl}?${params}`;

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // クリップボードが使えない場合はアラートで表示
        window.prompt("以下のURLをコピーしてください：", shareUrl);
      });
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
    >
      {copied ? (
        <>
          <CheckIcon />
          コピーしました！
        </>
      ) : (
        <>
          <ShareIcon />
          URLをシェア
        </>
      )}
    </button>
  );
}

function ShareIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function CalculatorApp() {
  const searchParams = useSearchParams();
  const resultRef = useRef<HTMLDivElement>(null);

  const [result, setResult] = useState<InsuranceResult | null>(null);
  const [currentFormValues, setCurrentFormValues] =
    useState<FormValues | null>(null);
  const [defaultValues, setDefaultValues] = useState<
    Partial<FormValues> | undefined
  >(undefined);

  // URLパラメータから初期値を設定
  useEffect(() => {
    const decoded = decodeShareParams(searchParams);
    if (decoded.salary) {
      const initValues: Partial<FormValues> = {
        monthlySalary: Number(decoded.salary),
        age: Number(decoded.age),
        prefecture: decoded.prefecture,
        bonus: Number(decoded.bonus ?? 0),
        employmentType: decoded.employment as "full-time" | "part-time",
      };
      setDefaultValues(initValues);

      // 自動計算を実行
      const calcResult = calculateInsurance({
        monthlySalary: Number(decoded.salary),
        age: Number(decoded.age),
        prefecture: decoded.prefecture ?? "東京",
        bonus: Number(decoded.bonus ?? 0),
        employmentType: (decoded.employment as "full-time" | "part-time") ?? "full-time",
      });
      setResult(calcResult);
      setCurrentFormValues(initValues as FormValues);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (data: FormValues) => {
    const calcResult = calculateInsurance({
      monthlySalary: data.monthlySalary,
      age: data.age,
      prefecture: data.prefecture,
      bonus: data.bonus ?? 0,
      employmentType: data.employmentType,
    });
    setResult(calcResult);
    setCurrentFormValues(data);

    // 結果へスクロール
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                社会保険料計算ツール
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                2026年度（令和8年度）協会けんぽ料率対応
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                2026年度対応
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左カラム：入力フォーム */}
          <div className="space-y-4">
            <CalculatorForm
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
            />

            {/* 注意事項 */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-1">
              <p className="font-semibold">ご注意</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>本ツールは概算計算です。実際の保険料と異なる場合があります。</li>
                <li>2026年度（令和8年度）の協会けんぽ料率を使用しています。</li>
                <li>所得税・住民税は含まれていません。</li>
                <li>会社独自の健保組合の場合は料率が異なります。</li>
              </ul>
            </div>
          </div>

          {/* 右カラム：計算結果 */}
          <div ref={resultRef} className="space-y-6">
            {result && currentFormValues ? (
              <>
                {/* シェアボタン */}
                <div className="flex justify-end">
                  <ShareButton formValues={currentFormValues} />
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-5">
                    計算結果
                  </h2>
                  <ResultTable
                    result={result}
                    monthlySalary={currentFormValues.monthlySalary}
                    bonus={currentFormValues.bonus ?? 0}
                  />
                </div>

                <AIExplanation
                  result={result}
                  formValues={currentFormValues}
                />
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-400">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-lg font-medium text-gray-500">
                  入力項目を入力して
                </p>
                <p className="text-lg font-medium text-gray-500">
                  「計算する」ボタンを押してください
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="mt-12 py-6 border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-gray-400 space-y-1">
          <p>社会保険料計算ツール — 2026年度（令和8年度）対応</p>
          <p>本ツールの計算結果は参考値です。正確な保険料は所轄の年金事務所・健康保険組合にご確認ください。</p>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-gray-500 text-lg">読み込み中...</div>
        </div>
      }
    >
      <CalculatorApp />
    </Suspense>
  );
}
