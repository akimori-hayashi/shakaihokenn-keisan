// 2026年度（令和8年度）社会保険料計算ロジック

// 都道府県別健康保険料率（協会けんぽ 令和8年度 2026年3月分から）
// 料率は労使合計（本人負担は1/2）
// 出典: https://www.kyoukaikenpo.or.jp/g7/cat330/sb3150/r08/r8ryougakuhyou3gatukara/
// ✓ = 公式ソースで確認済み, * = 公式ソース未確認（推定値）
// 最新料率は協会けんぽ公式サイトでご確認ください
export const HEALTH_INSURANCE_RATES: Record<string, number> = {
  北海道: 10.28, // ✓ 確認済み
  青森: 9.85,   // ✓ 確認済み（据置き）
  岩手: 9.51,   // ✓ 確認済み
  宮城: 10.10,  // ✓ 確認済み
  秋田: 10.01,  // ✓ 確認済み（据置き）
  山形: 9.84,   // ✓ 確認済み（据置き）
  福島: 9.50,   // ✓ 確認済み
  茨城: 9.52,   // ✓ 確認済み
  栃木: 9.84,   // ✓ 確認済み（据置き）
  群馬: 9.68,   // ✓ 確認済み
  埼玉: 9.67,   // ✓ 確認済み
  千葉: 9.73,   // ✓ 確認済み
  東京: 9.85,   // ✓ 確認済み
  神奈川: 9.92, // ✓ 確認済み（据置き）
  新潟: 9.21,   // ✓ 確認済み
  富山: 9.46,   // * 推定値（要確認）
  石川: 9.90,   // * 推定値（要確認）
  福井: 9.68,   // * 推定値（要確認）
  山梨: 9.86,   // * 推定値（要確認）
  長野: 9.63,   // ✓ 確認済み
  岐阜: 9.70,   // * 推定値（要確認）
  静岡: 9.62,   // * 推定値（要確認）
  愛知: 9.93,   // ✓ 確認済み
  三重: 9.71,   // * 推定値（要確認）
  滋賀: 9.77,   // * 推定値（要確認）
  京都: 9.90,   // * 推定値（要確認）
  大阪: 10.13,  // ✓ 確認済み
  兵庫: 10.07,  // * 推定値（要確認）
  奈良: 10.11,  // * 推定値（要確認）
  和歌山: 9.87, // * 推定値（要確認）
  鳥取: 9.75,   // * 推定値（要確認）
  島根: 10.26,  // * 推定値（据置き・要確認）
  岡山: 10.05,  // ✓ 確認済み
  広島: 9.93,   // * 推定値（要確認）
  山口: 10.13,  // * 推定値（要確認）
  徳島: 10.24,  // ✓ 確認済み
  香川: 10.32,  // * 推定値（要確認）
  愛媛: 10.27,  // * 推定値（要確認）
  高知: 10.07,  // * 推定値（要確認）
  福岡: 10.31,  // * 参考値（要確認）
  佐賀: 10.55,  // ✓ 確認済み
  長崎: 10.41,  // * 参考値（要確認）
  熊本: 10.12,  // * 参考値（要確認）
  大分: 10.14,  // * 推定値（要確認）
  宮崎: 10.09,  // * 参考値（要確認）
  鹿児島: 10.31, // * 参考値（要確認）
  沖縄: 9.44,   // ✓ 確認済み（据置き）
};

export const PREFECTURES = Object.keys(HEALTH_INSURANCE_RATES);

// 介護保険料率（令和8年度）労使合計
export const NURSING_CARE_RATE = 1.62;

// 厚生年金保険料率（労使合計）
export const PENSION_RATE = 18.3;

// 雇用保険料率（一般事業、令和8年度）
export const EMPLOYMENT_INSURANCE_RATE_EMPLOYEE = 0.55;
export const EMPLOYMENT_INSURANCE_RATE_EMPLOYER = 0.90;

// 健康保険 標準報酬月額等級表（50等級）
// [下限, 上限, 標準報酬月額]
const HEALTH_STANDARD_REMUNERATION_TABLE: [number, number, number][] = [
  [0, 63000, 58000],
  [63000, 73000, 68000],
  [73000, 83000, 78000],
  [83000, 93000, 88000],
  [93000, 101000, 98000],
  [101000, 107000, 104000],
  [107000, 114000, 110000],
  [114000, 122000, 118000],
  [122000, 130000, 126000],
  [130000, 138000, 134000],
  [138000, 146000, 142000],
  [146000, 155000, 150000],
  [155000, 165000, 160000],
  [165000, 175000, 170000],
  [175000, 185000, 180000],
  [185000, 195000, 190000],
  [195000, 210000, 200000],
  [210000, 230000, 220000],
  [230000, 250000, 240000],
  [250000, 270000, 260000],
  [270000, 290000, 280000],
  [290000, 310000, 300000],
  [310000, 330000, 320000],
  [330000, 350000, 340000],
  [350000, 370000, 360000],
  [370000, 395000, 380000],
  [395000, 425000, 410000],
  [425000, 455000, 440000],
  [455000, 485000, 470000],
  [485000, 515000, 500000],
  [515000, 545000, 530000],
  [545000, 575000, 560000],
  [575000, 605000, 590000],
  [605000, 635000, 620000],
  [635000, 665000, 650000],
  [665000, 695000, 680000],
  [695000, 730000, 710000],
  [730000, 770000, 750000],
  [770000, 810000, 790000],
  [810000, 855000, 830000],
  [855000, 905000, 880000],
  [905000, 955000, 930000],
  [955000, 1005000, 980000],
  [1005000, 1055000, 1030000],
  [1055000, 1115000, 1090000],
  [1115000, 1175000, 1150000],
  [1175000, 1235000, 1210000],
  [1235000, 1295000, 1270000],
  [1295000, 1355000, 1330000],
  [1355000, Infinity, 1390000],
];

// 厚生年金 標準報酬月額（上限: 650,000円）
const PENSION_MAX_STANDARD = 650000;
const PENSION_MIN_STANDARD = 88000;

/**
 * 月給から健康保険用標準報酬月額を求める
 */
export function getHealthStandardRemuneration(salary: number): number {
  for (const [lower, upper, standard] of HEALTH_STANDARD_REMUNERATION_TABLE) {
    if (salary >= lower && salary < upper) {
      return standard;
    }
  }
  return 1390000;
}

/**
 * 月給から厚生年金用標準報酬月額を求める
 */
export function getPensionStandardRemuneration(salary: number): number {
  const healthStandard = getHealthStandardRemuneration(salary);
  if (healthStandard < PENSION_MIN_STANDARD) return PENSION_MIN_STANDARD;
  if (healthStandard > PENSION_MAX_STANDARD) return PENSION_MAX_STANDARD;
  return healthStandard;
}

// 賞与用標準賞与額（健康保険: 年間573万円上限、厚生年金: 1回150万円上限）
const BONUS_HEALTH_MAX_ANNUAL = 5730000;
const BONUS_PENSION_MAX_SINGLE = 1500000;

export interface InsuranceInput {
  monthlySalary: number;
  age: number;
  prefecture: string;
  bonus?: number;
  employmentType: "full-time" | "part-time";
}

export interface InsuranceResult {
  // 標準報酬月額
  standardRemuneration: number;
  // 健康保険料
  healthInsuranceEmployee: number;
  healthInsuranceEmployer: number;
  healthInsuranceTotal: number;
  // 介護保険料（40歳以上）
  nursingCareEmployee: number;
  nursingCareEmployer: number;
  nursingCareTotal: number;
  // 厚生年金保険料
  pensionEmployee: number;
  pensionEmployer: number;
  pensionTotal: number;
  // 雇用保険料
  employmentInsuranceEmployee: number;
  employmentInsuranceEmployer: number;
  employmentInsuranceTotal: number;
  // 合計
  totalEmployee: number;
  totalEmployer: number;
  totalCombined: number;
  // 手取り見込み額
  takeHomePay: number;
  // 賞与関連
  bonusHealthEmployee: number;
  bonusHealthEmployer: number;
  bonusPensionEmployee: number;
  bonusPensionEmployer: number;
  bonusNursingEmployee: number;
  bonusNursingEmployer: number;
  bonusEmploymentEmployee: number;
  bonusEmploymentEmployer: number;
  // 適用料率情報
  healthInsuranceRate: number;
  requiresNursingCare: boolean;
}

function roundDown(value: number): number {
  return Math.floor(value);
}

export function calculateInsurance(input: InsuranceInput): InsuranceResult {
  const { monthlySalary, age, prefecture, bonus = 0, employmentType } = input;

  const isPermanent = employmentType === "full-time";
  const requiresNursingCare = age >= 40;

  // 健康保険料率（都道府県別）
  const healthRate = HEALTH_INSURANCE_RATES[prefecture] ?? 9.98;
  const healthRateEmployee = healthRate / 2 / 100;

  // 標準報酬月額
  const healthStandard = getHealthStandardRemuneration(monthlySalary);
  const pensionStandard = isPermanent
    ? getPensionStandardRemuneration(monthlySalary)
    : 0;

  // 健康保険料
  const healthInsuranceTotal = roundDown(healthStandard * healthRate / 100);
  const healthInsuranceEmployee = roundDown(healthStandard * healthRateEmployee);
  const healthInsuranceEmployer = healthInsuranceTotal - healthInsuranceEmployee;

  // 介護保険料（40歳以上のみ）
  const nursingCareRateEmployee = NURSING_CARE_RATE / 2 / 100;
  const nursingCareEmployee = requiresNursingCare
    ? roundDown(healthStandard * nursingCareRateEmployee)
    : 0;
  const nursingCareEmployer = requiresNursingCare
    ? roundDown(healthStandard * (NURSING_CARE_RATE - NURSING_CARE_RATE / 2) / 100)
    : 0;
  const nursingCareTotal = nursingCareEmployee + nursingCareEmployer;

  // 厚生年金保険料（正社員のみ）
  const pensionRateEmployee = PENSION_RATE / 2 / 100;
  const pensionTotal = isPermanent
    ? roundDown(pensionStandard * PENSION_RATE / 100)
    : 0;
  const pensionEmployee = isPermanent
    ? roundDown(pensionStandard * pensionRateEmployee)
    : 0;
  const pensionEmployer = pensionTotal - pensionEmployee;

  // 雇用保険料
  const employmentInsuranceEmployee = roundDown(
    monthlySalary * EMPLOYMENT_INSURANCE_RATE_EMPLOYEE / 100
  );
  const employmentInsuranceEmployer = roundDown(
    monthlySalary * EMPLOYMENT_INSURANCE_RATE_EMPLOYER / 100
  );
  const employmentInsuranceTotal =
    employmentInsuranceEmployee + employmentInsuranceEmployer;

  // 合計（本人負担）
  const totalEmployee =
    healthInsuranceEmployee +
    nursingCareEmployee +
    pensionEmployee +
    employmentInsuranceEmployee;

  const totalEmployer =
    healthInsuranceEmployer +
    nursingCareEmployer +
    pensionEmployer +
    employmentInsuranceEmployer;

  const totalCombined = totalEmployee + totalEmployer;

  // 手取り見込み額（概算：所得税・住民税は含まない）
  const takeHomePay = monthlySalary - totalEmployee;

  // 賞与の計算
  let bonusHealthEmployee = 0;
  let bonusHealthEmployer = 0;
  let bonusPensionEmployee = 0;
  let bonusPensionEmployer = 0;
  let bonusNursingEmployee = 0;
  let bonusNursingEmployer = 0;
  let bonusEmploymentEmployee = 0;
  let bonusEmploymentEmployer = 0;

  if (bonus > 0) {
    // 賞与の標準賞与額（1000円未満切り捨て）
    const standardBonusHealth = Math.min(
      Math.floor(bonus / 1000) * 1000,
      BONUS_HEALTH_MAX_ANNUAL
    );
    const standardBonusPension = Math.min(
      Math.floor(bonus / 1000) * 1000,
      BONUS_PENSION_MAX_SINGLE
    );

    bonusHealthEmployee = roundDown(standardBonusHealth * healthRateEmployee);
    bonusHealthEmployer = roundDown(standardBonusHealth * healthRateEmployee);

    if (requiresNursingCare) {
      bonusNursingEmployee = roundDown(standardBonusHealth * nursingCareRateEmployee);
      bonusNursingEmployer = roundDown(standardBonusHealth * nursingCareRateEmployee);
    }

    if (isPermanent) {
      bonusPensionEmployee = roundDown(standardBonusPension * pensionRateEmployee);
      bonusPensionEmployer = roundDown(standardBonusPension * pensionRateEmployee);
    }

    bonusEmploymentEmployee = roundDown(
      bonus * EMPLOYMENT_INSURANCE_RATE_EMPLOYEE / 100
    );
    bonusEmploymentEmployer = roundDown(
      bonus * EMPLOYMENT_INSURANCE_RATE_EMPLOYER / 100
    );
  }

  return {
    standardRemuneration: healthStandard,
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
    healthInsuranceRate: healthRate,
    requiresNursingCare,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface ShareParams {
  salary: string;
  age: string;
  prefecture: string;
  bonus: string;
  employment: string;
}

export function encodeShareParams(params: ShareParams): string {
  const searchParams = new URLSearchParams();
  searchParams.set("salary", params.salary);
  searchParams.set("age", params.age);
  searchParams.set("prefecture", encodeURIComponent(params.prefecture));
  searchParams.set("bonus", params.bonus);
  searchParams.set("employment", params.employment);
  return searchParams.toString();
}

export function decodeShareParams(
  searchParams: URLSearchParams
): Partial<ShareParams> {
  const salary = searchParams.get("salary") ?? "";
  const age = searchParams.get("age") ?? "";
  const prefectureRaw = searchParams.get("prefecture") ?? "";
  const prefecture = decodeURIComponent(prefectureRaw);
  const bonus = searchParams.get("bonus") ?? "";
  const employment = searchParams.get("employment") ?? "";

  // バリデーション
  const salaryNum = Number(salary);
  const ageNum = Number(age);
  const bonusNum = Number(bonus);

  if (
    isNaN(salaryNum) ||
    salaryNum < 0 ||
    salaryNum > 10000000 ||
    isNaN(ageNum) ||
    ageNum < 15 ||
    ageNum > 100 ||
    !PREFECTURES.includes(prefecture) ||
    isNaN(bonusNum) ||
    bonusNum < 0 ||
    bonusNum > 100000000 ||
    !["full-time", "part-time"].includes(employment)
  ) {
    return {};
  }

  return { salary, age, prefecture, bonus, employment };
}
