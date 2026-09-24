import { investigateIncident } from "@/agent/recovery-agent";
import { RecoveryDecision } from "@/lib/types";
import {
  getIncidentState,
  saveIncidentDecision,
  updateIncidentStatus,
} from "@/state/incident-store";

export async function runIncidentInvestigation(incidentId: string) {
  const incident = getIncidentState(incidentId);

  if (!incident) {
    throw new Error(`Incident ${incidentId} not found`);
  }

  updateIncidentStatus(incidentId, "INVESTIGATING");

  try {
    const result = await investigateIncident(incidentId);

    const decision = result.decision as RecoveryDecision;

    const updatedIncident = saveIncidentDecision(
      incidentId,
      decision
    );

    return {
      incident: updatedIncident,
      decision,
      trace: result.trace,
    };
  } catch (error) {
    updateIncidentStatus(incidentId, "DETECTED");
    throw error;
  }
}