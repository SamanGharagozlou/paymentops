import { NextResponse } from "next/server";
import { incidents } from "@/data/synthetic-data";
import { SyntheticPaymentProvider } from "@/payments/synthetic-provider";

export async function GET() {
  const provider = new SyntheticPaymentProvider();

  const incident = incidents.find(
    (item) => item.id === "incident_1048"
  );

  if (!incident) {
    return NextResponse.json(
      { error: "Incident not found" },
      { status: 404 }
    );
  }

  const payment = await provider.getPayment(incident.paymentId);

  if (!payment) {
    return NextResponse.json(
      { error: "Payment not found" },
      { status: 404 }
    );
  }

  const customer = await provider.getCustomer(payment.customerId);
  const history = await provider.getPaymentHistory(payment.customerId);
  const methods = await provider.getAvailableMethods(payment.customerId);

  return NextResponse.json({
    incident,
    payment,
    customer,
    history,
    methods,
  });
}