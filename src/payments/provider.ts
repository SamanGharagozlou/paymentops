import {
  Customer,
  CustomerPaymentMethod,
  Payment,
  RecoveryLink,
} from "@/lib/types";

export interface PaymentProvider {
  getPayment(paymentId: string): Promise<Payment | null>;

  getCustomer(customerId: string): Promise<Customer | null>;

  getPaymentHistory(customerId: string): Promise<Payment[]>;

  getAvailableMethods(
    customerId: string
  ): Promise<CustomerPaymentMethod[]>;

  createRecoveryLink(paymentId: string): Promise<RecoveryLink>;
}