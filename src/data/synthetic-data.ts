import {
  Customer,
  CustomerPaymentMethod,
  Payment,
  PaymentIncident,
} from "@/lib/types";

export const customers: Customer[] = [
  {
    id: "cus_001",
    name: "Sophie van Dijk",
    email: "sophie@example.com",
    createdAt: "2025-01-14T10:00:00Z",
  },
  {
    id: "cus_002",
    name: "Noah Janssen",
    email: "noah@example.com",
    createdAt: "2025-05-08T09:30:00Z",
  },
  {
    id: "cus_003",
    name: "Mila de Boer",
    email: "mila@example.com",
    createdAt: "2026-09-20T14:20:00Z",
  },
];

export const payments: Payment[] = [
  // Sophie — isolated failure, strong history
  {
    id: "pay_1048",
    customerId: "cus_001",
    amount: 149,
    currency: "EUR",
    method: "card",
    status: "failed",
    createdAt: "2026-09-24T16:30:00Z",
    failureReason: "card_declined",
  },
  {
    id: "pay_sophie_1",
    customerId: "cus_001",
    amount: 129,
    currency: "EUR",
    method: "card",
    status: "paid",
    createdAt: "2026-09-01T11:00:00Z",
  },
  {
    id: "pay_sophie_2",
    customerId: "cus_001",
    amount: 199,
    currency: "EUR",
    method: "card",
    status: "paid",
    createdAt: "2026-08-10T13:00:00Z",
  },
  {
    id: "pay_sophie_3",
    customerId: "cus_001",
    amount: 79,
    currency: "EUR",
    method: "ideal",
    status: "paid",
    createdAt: "2026-07-18T10:00:00Z",
  },

  // Noah — repeated card failures, iDEAL worked before
  {
    id: "pay_1051",
    customerId: "cus_002",
    amount: 89,
    currency: "EUR",
    method: "card",
    status: "failed",
    createdAt: "2026-09-24T16:35:00Z",
    failureReason: "card_declined",
  },
  {
    id: "pay_noah_fail_2",
    customerId: "cus_002",
    amount: 89,
    currency: "EUR",
    method: "card",
    status: "failed",
    createdAt: "2026-09-22T15:00:00Z",
    failureReason: "card_declined",
  },
  {
    id: "pay_noah_fail_3",
    customerId: "cus_002",
    amount: 89,
    currency: "EUR",
    method: "card",
    status: "failed",
    createdAt: "2026-09-20T15:00:00Z",
    failureReason: "card_declined",
  },
  {
    id: "pay_noah_paid_1",
    customerId: "cus_002",
    amount: 89,
    currency: "EUR",
    method: "ideal",
    status: "paid",
    createdAt: "2026-08-20T12:00:00Z",
  },
  {
    id: "pay_noah_paid_2",
    customerId: "cus_002",
    amount: 89,
    currency: "EUR",
    method: "ideal",
    status: "paid",
    createdAt: "2026-07-20T12:00:00Z",
  },

  // Mila — new customer, high-value repeated failures
  {
    id: "pay_1062",
    customerId: "cus_003",
    amount: 1850,
    currency: "EUR",
    method: "card",
    status: "failed",
    createdAt: "2026-09-24T16:40:00Z",
    failureReason: "multiple_failed_attempts",
  },
  {
    id: "pay_mila_fail_2",
    customerId: "cus_003",
    amount: 1850,
    currency: "EUR",
    method: "card",
    status: "failed",
    createdAt: "2026-09-24T16:36:00Z",
    failureReason: "card_declined",
  },
];

export const customerPaymentMethods: CustomerPaymentMethod[] = [
  {
    customerId: "cus_001",
    method: "card",
    available: true,
    historicallySuccessful: true,
  },
  {
    customerId: "cus_001",
    method: "ideal",
    available: true,
    historicallySuccessful: true,
  },
  {
    customerId: "cus_002",
    method: "card",
    available: true,
    historicallySuccessful: false,
  },
  {
    customerId: "cus_002",
    method: "ideal",
    available: true,
    historicallySuccessful: true,
  },
  {
    customerId: "cus_003",
    method: "card",
    available: true,
    historicallySuccessful: false,
  },
  {
    customerId: "cus_003",
    method: "bank_transfer",
    available: true,
    historicallySuccessful: false,
  },
];

export const incidents: PaymentIncident[] = [
  {
    id: "incident_1048",
    paymentId: "pay_1048",
    status: "DETECTED",
    title: "Failed payment — €149",
    createdAt: "2026-09-24T16:30:05Z",
  },
  {
    id: "incident_1051",
    paymentId: "pay_1051",
    status: "DETECTED",
    title: "Repeated payment failures — €89",
    createdAt: "2026-09-24T16:35:05Z",
  },
  {
    id: "incident_1062",
    paymentId: "pay_1062",
    status: "DETECTED",
    title: "High-value payment failure — €1,850",
    createdAt: "2026-09-24T16:40:05Z",
  },
];