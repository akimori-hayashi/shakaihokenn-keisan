"use client";

import { InsuranceResult, formatCurrency } from "@/lib/calculator";

interface ResultTableProps {
  result: InsuranceResult;
  monthlySalary: number;
  bonus: number;
}

interface TableRowProps {
  label: string;
  employee: number;
  employer: number;
  total: number;
  highlight?: boolean;
  sublabel?: string;
}

function TableRow({
  label,
  employee,
  employer,
  total,
  highlight,
  sublabel,
}: TableRowProps) {
  return (
    <tr className={highlight ? "bg-blue-50 font-semibold" : "hover:bg-gray-50"}>
      <td className="px-4 py-3 text-sm text-gray-700 border-b">
        {label}
        {sublabel && (
          <span className="block text-xs text-gray-500 font-normal">
            {sublabel}
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-right text-gray-800 border-b tabular-nums">
        {formatCurrency(employee)}
      </td>
      <td className="px-4 py-3 text-sm text-right text-gray-800 border-b tabular-nums">
        {formatCurrency(employer)}
      </td>
      <td className="px-4 py-3 text-sm text-right text-gray-800 border-b tabular-nums">
        {formatCurrency(total)}
      </td>
    </tr>
  );
}

export default function ResultTable({
  result,
  monthlySalary,
  bonus,
}: ResultTableProps) {
  const {
    standardRemuneration,
    healthInsuranceEmployee,
    healthInsuranceEmployer,
    healthInsuranceTotal,
    nursingCareEmployee,
    nursingCareEmployer,
    nursingCareTotal,
    pensionEmployee,
    pensionEmployer,
    pensionTotal,
    employmentInsuranceEmployee,
    employmentInsuranceEmployer,
    employmentInsuranceTotal,
    totalEmployee,
    totalEmployer,
    totalCombined,
    takeHomePay,
    bonusHealthEmployee,
    bonusHealthEmployer,
    bonusPensionEmployee,
    bonusPensionEmployer,
    bonusNursingEmployee,
    bonusNursingEmployer,
    bonusEmploymentEmployee,
    bonusEmploymentEmployer,
    healthInsuranceRate,
    requiresNursingCare,
  } = result;

  const hasBonus = bonus > 0;
  const hasPension = pensionTotal > 0;

  return (
    <div className="space-y-6">
      {/* 適用条件サマリー */}
      <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 space-y-1">
        <p>
          <span className="font-semibold">標準報酬月額：</span>
          {formatCurrency(standardRemuneration)}
        </p>
        <p>
          <span className="font-semibold">健康保険料率（{result.healthInsuranceRate.toFixed(2)}%）：</span>
          都道府県別協会けんぽ 2025年度
        </p>
        {requiresNursingCare && (
          <p>
            <span className="font-semibold">介護保険料率：</span>
            1.60%（40歳以上適用）
          </p>
        )}
        {hasPension && (
          <p>
            <span className="font-semibold">厚生年金保険料率：</span>
            18.3%
          </p>
        )}
        <p>
          <span className="font-semibold">雇用保険料率：</span>
          労働者 0.6% / 事業主 0.95%
        </p>
      </div>

      {/* 月額給与の保険料表 */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">
          月額保険料（月給 {formatCurrency(monthlySalary)} の場合）
        </h3>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">
                  保険の種類
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 border-b">
                  本人負担
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 border-b">
                  会社負担
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 border-b">
                  合計
                </th>
              </tr>
            </thead>
            <tbody>
              <TableRow
                label="健康保険料"
                sublabel={`料率: ${healthInsuranceRate.toFixed(2)}%`}
                employee={healthInsuranceEmployee}
                employer={healthInsuranceEmployer}
                total={healthInsuranceTotal}
              />
              {requiresNursingCare && (
                <TableRow
                  label="介護保険料"
                  sublabel="40歳以上"
                  employee={nursingCareEmployee}
                  employer={nursingCareEmployer}
                  total={nursingCareTotal}
                />
              )}
              {hasPension ? (
                <TableRow
                  label="厚生年金保険料"
                  sublabel="料率: 18.3%"
                  employee={pensionEmployee}
                  employer={pensionEmployer}
                  total={pensionTotal}
                />
              ) : (
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500 border-b italic">
                    厚生年金保険料
                    <span className="block text-xs">パート・アルバイトは対象外</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-400 border-b">—</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-400 border-b">—</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-400 border-b">—</td>
                </tr>
              )}
              <TableRow
                label="雇用保険料"
                sublabel="労働者 0.6% / 事業主 0.95%"
                employee={employmentInsuranceEmployee}
                employer={employmentInsuranceEmployer}
                total={employmentInsuranceTotal}
              />
              <TableRow
                label="合計"
                employee={totalEmployee}
                employer={totalEmployer}
                total={totalCombined}
                highlight
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* 賞与の保険料表 */}
      {hasBonus && (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            賞与の保険料（賞与 {formatCurrency(bonus)} の場合）
          </h3>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">
                    保険の種類
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 border-b">
                    本人負担
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 border-b">
                    会社負担
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 border-b">
                    合計
                  </th>
                </tr>
              </thead>
              <tbody>
                <TableRow
                  label="健康保険料"
                  employee={bonusHealthEmployee}
                  employer={bonusHealthEmployer}
                  total={bonusHealthEmployee + bonusHealthEmployer}
                />
                {requiresNursingCare && (
                  <TableRow
                    label="介護保険料"
                    employee={bonusNursingEmployee}
                    employer={bonusNursingEmployer}
                    total={bonusNursingEmployee + bonusNursingEmployer}
                  />
                )}
                {hasPension && (
                  <TableRow
                    label="厚生年金保険料"
                    sublabel="上限: 1回150万円"
                    employee={bonusPensionEmployee}
                    employer={bonusPensionEmployer}
                    total={bonusPensionEmployee + bonusPensionEmployer}
                  />
                )}
                <TableRow
                  label="雇用保険料"
                  employee={bonusEmploymentEmployee}
                  employer={bonusEmploymentEmployer}
                  total={bonusEmploymentEmployee + bonusEmploymentEmployer}
                />
                <TableRow
                  label="合計"
                  employee={
                    bonusHealthEmployee +
                    bonusNursingEmployee +
                    bonusPensionEmployee +
                    bonusEmploymentEmployee
                  }
                  employer={
                    bonusHealthEmployer +
                    bonusNursingEmployer +
                    bonusPensionEmployer +
                    bonusEmploymentEmployer
                  }
                  total={
                    bonusHealthEmployee +
                    bonusHealthEmployer +
                    bonusNursingEmployee +
                    bonusNursingEmployer +
                    bonusPensionEmployee +
                    bonusPensionEmployer +
                    bonusEmploymentEmployee +
                    bonusEmploymentEmployer
                  }
                  highlight
                />
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 手取り見込み額 */}
      <div className="bg-green-50 rounded-xl p-5 border border-green-200">
        <h3 className="text-base font-semibold text-green-800 mb-3">
          手取り見込み額（月額・概算）
        </h3>
        <div className="flex items-end gap-3">
          <div className="text-3xl font-bold text-green-700">
            {formatCurrency(takeHomePay)}
          </div>
        </div>
        <div className="mt-3 text-sm text-green-700 space-y-1">
          <div className="flex justify-between">
            <span>月額給与</span>
            <span className="tabular-nums">{formatCurrency(monthlySalary)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>社会保険料（本人負担）</span>
            <span className="tabular-nums">− {formatCurrency(totalEmployee)}</span>
          </div>
          <div className="border-t border-green-300 pt-1 flex justify-between font-semibold">
            <span>手取り見込み</span>
            <span className="tabular-nums">{formatCurrency(takeHomePay)}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          ※ 所得税・住民税は含まれていません。実際の手取りはこれより少なくなります。
        </p>
      </div>
    </div>
  );
}
