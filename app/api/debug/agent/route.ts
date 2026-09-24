import { NextResponse } from "next/server";
import { runIncidentInvestigation } from "@/state/investigation-service";

export async function GET() {
  try {
    const result = await runIncidentInvestigation(
      "incident_1048"
    );

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown investigation error",
      },
      { status: 500 }
    );
  }
}