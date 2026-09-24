import { incidents } from "@/data/synthetic-data";
import { SyntheticPaymentProvider } from "@/payments/synthetic-provider";

const provider = new SyntheticPaymentProvider();

export async function getIncident(incidentId: string) {
  const incident = incidents.find((item) => item.id === incidentId);

  if (!incident) {
    throw new Error(`Incident ${incidentId} not found`);
  }

  return incident;
}

export async function getPayment(paymentId: string) {
  const payment = await provider.getPayment(paymentId);

  if (!payment) {
    throw new Error(`Payment ${paymentId} not found`);
  }

  return payment;
}

export async function getCustomer(customerId: string) {
  const customer = await provider.getCustomer(customerId);

  if (!customer) {
    throw new Error(`Customer ${customerId} not found`);
  }

  return customer;
}

export async function getPaymentHistory(customerId: string) {
  return provider.getPaymentHistory(customerId);
}

export async function getAvailableMethods(customerId: string) {
  return provider.getAvailableMethods(customerId);
}