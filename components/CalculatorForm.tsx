"use client";

import { useForm } from "react-hook-form";
import { PREFECTURES } from "@/lib/calculator";

export interface FormValues {
  monthlySalary: number;
  age: number;
  prefecture: string;
  bonus: number;
  employmentType: "full-time" | "part-time";
}

interface CalculatorFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: FormValues) => void;
}

export default function CalculatorForm({
  defaultValues,
  onSubmit,
}: CalculatorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      monthlySalary: defaultValues?.monthlySalary ?? undefined,
      age: defaultValues?.age ?? undefined,
      prefecture: defaultValues?.prefecture ?? "東京",
      bonus: defaultValues?.bonus ?? 0,
      employmentType: defaultValues?.employmentType ?? "full-time",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-2xl shadow-md p-6 space-y-5"
    >
      <h2 className="text-xl font-bold text-gray-800 border-b pb-3">
        入力項目
      </h2>

      {/* 月額給与 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          月額給与（基本給）
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            placeholder="例: 300000"
            className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.monthlySalary ? "border-red-500" : "border-gray-300"
            }`}
            {...register("monthlySalary", {
              required: "月額給与を入力してください",
              min: { value: 1, message: "1円以上を入力してください" },
              max: {
                value: 10000000,
                message: "1,000万円以下を入力してください",
              },
              valueAsNumber: true,
            })}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            円
          </span>
        </div>
        {errors.monthlySalary && (
          <p className="text-red-500 text-xs mt-1">
            {errors.monthlySalary.message}
          </p>
        )}
      </div>

      {/* 年齢 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          年齢
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            placeholder="例: 30"
            className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.age ? "border-red-500" : "border-gray-300"
            }`}
            {...register("age", {
              required: "年齢を入力してください",
              min: { value: 15, message: "15歳以上を入力してください" },
              max: { value: 100, message: "100歳以下を入力してください" },
              valueAsNumber: true,
            })}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            歳
          </span>
        </div>
        {errors.age && (
          <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          ※ 40歳以上は介護保険料が加算されます
        </p>
      </div>

      {/* 都道府県 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          都道府県（勤務地）
          <span className="text-red-500 ml-1">*</span>
        </label>
        <select
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
            errors.prefecture ? "border-red-500" : "border-gray-300"
          }`}
          {...register("prefecture", {
            required: "都道府県を選択してください",
          })}
        >
          {PREFECTURES.map((pref) => (
            <option key={pref} value={pref}>
              {pref}
            </option>
          ))}
        </select>
        {errors.prefecture && (
          <p className="text-red-500 text-xs mt-1">
            {errors.prefecture.message}
          </p>
        )}
      </div>

      {/* 雇用形態 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          雇用形態
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="full-time"
              className="w-4 h-4 text-blue-600"
              {...register("employmentType")}
            />
            <span className="text-sm text-gray-700">正社員</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="part-time"
              className="w-4 h-4 text-blue-600"
              {...register("employmentType")}
            />
            <span className="text-sm text-gray-700">パート・アルバイト</span>
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          ※ 正社員は厚生年金加入、パートは健康保険・雇用保険のみ計算
        </p>
      </div>

      {/* 賞与額 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          賞与額（任意）
        </label>
        <div className="relative">
          <input
            type="number"
            placeholder="例: 600000（0の場合は省略可）"
            className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.bonus ? "border-red-500" : "border-gray-300"
            }`}
            {...register("bonus", {
              min: { value: 0, message: "0円以上を入力してください" },
              max: {
                value: 100000000,
                message: "1億円以下を入力してください",
              },
              valueAsNumber: true,
            })}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            円
          </span>
        </div>
        {errors.bonus && (
          <p className="text-red-500 text-xs mt-1">{errors.bonus.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-base hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
      >
        計算する
      </button>
    </form>
  );
}
