export type PaymentStatus =
  | "paid"
  | "failed"
  | "pending"
  | "cancelled";

export type PaymentMethod =
  | "card"
  | "ideal"
  | "paypal"
  | "bank_transfer";

export type IncidentStatus =
  | "DETECTED"
  | "INVESTIGATING"
  | "DECISION_READY"
  | "AWAITING_APPROVAL"
  | "RECOVERY_ACTIVE"
  | "RECOVERED"
  | "ESCALATED";

export type RecoveryStrategy =
  | "RETRY_PAYMENT"
  | "ALTERNATIVE_METHOD"
  | "ESCALATE";

export type ProposedAction =
  | "CREATE_RECOVERY_LINK"
  | "SUGGEST_ALTERNATIVE_METHOD"
  | "HUMAN_REVIEW";

export interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  customerId: string;
  amount: number;
  currency: "EUR";
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
  failureReason?: string;
}

export interface CustomerPaymentMethod {
  customerId: string;
  method: PaymentMethod;
  available: boolean;
  historicallySuccessful: boolean;
}

export interface RecoveryDecision {
  strategy: RecoveryStrategy;
  confidence: number;
  evidence: string[];
  summary: string;
  proposedAction: ProposedAction;
  requiresApproval: boolean;
}

export interface AgentActivity {
  id: string;
  incidentId: string;
  type:
    | "SYSTEM"
    | "TOOL_CALL"
    | "TOOL_RESULT"
    | "DECISION"
    | "APPROVAL"
    | "ACTION"
    | "EVENT";
  message: string;
  timestamp: string;
}

export interface PaymentIncident {
  id: string;
  paymentId: string;
  status: IncidentStatus;
  title: string;
  createdAt: string;
  decision?: RecoveryDecision;
}

export interface RecoveryLink {
  id: string;
  paymentId: string;
  amount: number;
  currency: "EUR";
  status: "open" | "paid" | "failed";
  url: string;
}