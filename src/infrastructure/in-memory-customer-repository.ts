import type { CustomerRepository } from '../domain/customer-repository.js';
import type { CustomerStatus } from '../domain/customer-status.js';

export class InMemoryCustomerRepository implements CustomerRepository {
  private readonly customers = new Map<number, CustomerStatus>();

  public addCustomer(id: number, active: boolean, blocked: boolean): void {
    this.customers.set(id, { active, blocked });
  }

  public tryGetStatus(customerId: number): CustomerStatus | undefined {
    return this.customers.get(customerId);
  }
}
