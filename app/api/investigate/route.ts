import { NextRequest, NextResponse } from "next/server";

import { runIncidentInvestigation } from "@/state/investigation-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const incidentId = body.incidentId;

    if (!incidentId || typeof incidentId !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "incidentId is required",
        },
        { status: 400 }
      );
    }

    const result = await runIncidentInvestigation(incidentId);

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