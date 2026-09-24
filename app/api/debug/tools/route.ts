import { NextResponse } from "next/server";

import {
  getIncident,
  getPayment,
  getCustomer,
  getPaymentHistory,
  getAvailableMethods,
} from "@/agent/tools";

export async function GET() {
  const incident = await getIncident("incident_1048");

  const payment = await getPayment(incident.paymentId);

  const customer = await getCustomer(payment.customerId);

  const history = await getPaymentHistory(payment.customerId);

  const methods = await getAvailableMethods(payment.customerId);

  return NextResponse.json({
    incident,
    payment,
    customer,
    history,
    methods,
  });
}