import { incidents as initialIncidents } from "@/data/synthetic-data";
import {
  PaymentIncident,
  RecoveryDecision,
  IncidentStatus,
} from "@/lib/types";

const incidents: PaymentIncident[] = structuredClone(initialIncidents);

export function getIncidentState(
  incidentId: string
): PaymentIncident | null {
  return (
    incidents.find((incident) => incident.id === incidentId) ?? null
  );
}

export function getAllIncidentStates(): PaymentIncident[] {
  return incidents;
}

export function updateIncidentStatus(
  incidentId: string,
  status: IncidentStatus
): PaymentIncident {
  const incident = incidents.find(
    (item) => item.id === incidentId
  );

  if (!incident) {
    throw new Error(`Incident ${incidentId} not found`);
  }

  incident.status = status;

  return incident;
}

export function saveIncidentDecision(
  incidentId: string,
  decision: RecoveryDecision
): PaymentIncident {
  const incident = incidents.find(
    (item) => item.id === incidentId
  );

  if (!incident) {
    throw new Error(`Incident ${incidentId} not found`);
  }

  incident.decision = decision;
  incident.status = decision.requiresApproval
    ? "AWAITING_APPROVAL"
    : "DECISION_READY";

  return incident;
}

export function resetIncidentStore() {
  incidents.splice(
    0,
    incidents.length,
    ...structuredClone(initialIncidents)
  );
}