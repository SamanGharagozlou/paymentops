import {
  customerPaymentMethods,
  customers,
  payments,
} from "@/data/synthetic-data";

import {
  Customer,
  CustomerPaymentMethod,
  Payment,
  RecoveryLink,
} from "@/lib/types";

import { PaymentProvider } from "@/payments/provider";

export class SyntheticPaymentProvider implements PaymentProvider {
  async getPayment(paymentId: string): Promise<Payment | null> {
    return payments.find((payment) => payment.id === paymentId) ?? null;
  }

  async getCustomer(customerId: string): Promise<Customer | null> {
    return customers.find((customer) => customer.id === customerId) ?? null;
  }

  async getPaymentHistory(customerId: string): Promise<Payment[]> {
    return payments
      .filter((payment) => payment.customerId === customerId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  async getAvailableMethods(
    customerId: string
  ): Promise<CustomerPaymentMethod[]> {
    return customerPaymentMethods.filter(
      (method) => method.customerId === customerId && method.available
    );
  }

  async createRecoveryLink(paymentId: string): Promise<RecoveryLink> {
    const payment = await this.getPayment(paymentId);

    if (!payment) {
      throw new Error(`Payment ${paymentId} not found`);
    }

    return {
      id: `recovery_${payment.id}`,
      paymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: "open",
      url: `/pay/recovery_${payment.id}`,
    };
  }
}