import type { CustomerStatus } from './customer-status.js';

export interface CustomerRepository {
  tryGetStatus(customerId: number): CustomerStatus | undefined;
}
