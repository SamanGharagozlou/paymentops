import { NextResponse } from "next/server";
import { investigateIncident } from "@/agent/recovery-agent";

export async function GET() {
  try {
    const result = await investigateIncident("incident_1048");

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
            : "Unknown agent error",
      },
      { status: 500 }
    );
  }
}