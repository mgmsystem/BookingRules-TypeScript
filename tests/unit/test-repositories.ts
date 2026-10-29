import type { CustomerRepository } from '../../src/domain/customer-repository.js';
import type { CustomerStatus } from '../../src/domain/customer-status.js';

export class FakeCustomerRepository implements CustomerRepository {
  public lastCustomerId = 0;

  public constructor(
    private readonly customerActive: boolean,
    private readonly customerBlocked = false,
  ) {}

  public tryGetStatus(customerId: number): CustomerStatus {
    this.lastCustomerId = customerId;
    return {
      active: this.customerActive,
      blocked: this.customerBlocked,
    };
  }
}

export class SpyCustomerRepository implements CustomerRepository {
  public statusCalls = 0;

  public constructor(private readonly customerActive = true) {}

  public tryGetStatus(_customerId: number): CustomerStatus {
    this.statusCalls += 1;
    return { active: this.customerActive, blocked: false };
  }
}

export class FailingCustomerRepository implements CustomerRepository {
  public tryGetStatus(_customerId: number): CustomerStatus {
    throw new Error('Failed to query customer');
  }
}
