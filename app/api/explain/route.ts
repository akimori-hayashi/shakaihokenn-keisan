import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ExplainRequest {
  modelType: "haiku" | "sonnet";
  calculationData: {
    monthlySalary: number;
    age: number;
    prefecture: string;
    bonus: number;
    employmentType: string;
    healthInsuranceEmployee: number;
    nursingCareEmployee: number;
    pensionEmployee: number;
    employmentInsuranceEmployee: number;
    totalEmployee: number;
    takeHomePay: number;
    healthInsuranceRate: number;
    requiresNursingCare: boolean;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: ExplainRequest = await request.json();
    const { modelType, calculationData } = body;

    if (!modelType || !calculationData) {
      return NextResponse.json(
        { error: "modelType と calculationData は必須です" },
        { status: 400 }
      );
    }

    if (modelType !== "haiku" && modelType !== "sonnet") {
      return NextResponse.json(
        { error: "modelType は haiku または sonnet を指定してください" },
        { status: 400 }
      );
    }

    const model =
      modelType === "haiku"
        ? "claude-haiku-4-5"
        : "claude-sonnet-4-5";

    const {
      monthlySalary,
      age,
      prefecture,
      bonus,
      employmentType,
      healthInsuranceEmployee,
      nursingCareEmployee,
      pensionEmployee,
      employmentInsuranceEmployee,
      totalEmployee,
      takeHomePay,
      healthInsuranceRate,
      requiresNursingCare,
    } = calculationData;

    const employmentLabel =
      employmentType === "full-time" ? "正社員" : "パート・アルバイト";

    const prompt =
      modelType === "haiku"
        ? `以下の社会保険料計算結果を、日本語で簡潔に150文字程度で解説してください。難しい専門用語は避け、わかりやすく説明してください。

計算条件:
- 月額給与: ${monthlySalary.toLocaleString()}円
- 年齢: ${age}歳
- 都道府県: ${prefecture}
- 雇用形態: ${employmentLabel}
${bonus > 0 ? `- 賞与: ${bonus.toLocaleString()}円` : ""}

計算結果（本人負担分）:
- 健康保険料: ${healthInsuranceEmployee.toLocaleString()}円（${prefecture}の料率 ${healthInsuranceRate}%）
${requiresNursingCare ? `- 介護保険料: ${nursingCareEmployee.toLocaleString()}円` : ""}
- 厚生年金保険料: ${pensionEmployee.toLocaleString()}円
- 雇用保険料: ${employmentInsuranceEmployee.toLocaleString()}円
- 合計社会保険料: ${totalEmployee.toLocaleString()}円
- 手取り見込み額: ${takeHomePay.toLocaleString()}円`
        : `以下の社会保険料計算結果を、日本語で詳しく400文字程度で解説してください。各保険の目的や特徴、節税や将来受け取れる給付についても触れながら、わかりやすく説明してください。

計算条件:
- 月額給与: ${monthlySalary.toLocaleString()}円
- 年齢: ${age}歳
- 都道府県: ${prefecture}
- 雇用形態: ${employmentLabel}
${bonus > 0 ? `- 賞与: ${bonus.toLocaleString()}円` : ""}

計算結果（本人負担分）:
- 健康保険料: ${healthInsuranceEmployee.toLocaleString()}円（${prefecture}の料率 ${healthInsuranceRate}%）
${requiresNursingCare ? `- 介護保険料: ${nursingCareEmployee.toLocaleString()}円` : ""}
- 厚生年金保険料: ${pensionEmployee.toLocaleString()}円
- 雇用保険料: ${employmentInsuranceEmployee.toLocaleString()}円
- 合計社会保険料: ${totalEmployee.toLocaleString()}円
- 手取り見込み額: ${takeHomePay.toLocaleString()}円`;

    const message = await client.messages.create({
      model,
      max_tokens: 700,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json(
        { error: "AIからの応答が取得できませんでした" },
        { status: 500 }
      );
    }

    return NextResponse.json({ explanation: textContent.text });
  } catch (error) {
    console.error("AI explain error:", error);

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `APIエラー: ${error.message}` },
        { status: error.status ?? 500 }
      );
    }

    return NextResponse.json(
      { error: "内部サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
