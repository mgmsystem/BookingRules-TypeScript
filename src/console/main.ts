import type { CustomerRepository } from '../domain/customer-repository.js';
import { ReservationDecision } from '../domain/reservation-decision.js';
import { Reservation } from '../domain/reservation.js';
import { InMemoryCustomerRepository } from '../infrastructure/in-memory-customer-repository.js';

const repository = new InMemoryCustomerRepository();
repository.addCustomer(1, true, false);
repository.addCustomer(2, false, false);
repository.addCustomer(3, true, true);

console.log('========================================');
console.log(' BookingRules - Rule Demonstration');
console.log('========================================');
console.log();

demonstrateReservation(repository, 1, 3);
demonstrateReservation(repository, 1, 6);
demonstrateReservation(repository, 2, 2);
demonstrateReservation(repository, 3, 2);
demonstrateReservation(repository, 99, 2);

function demonstrateReservation(
  customerRepository: CustomerRepository,
  customerId: number,
  participantCount: number,
): void {
  const reservation = new Reservation(customerId, customerRepository);
  const decision = reservation.evaluate(participantCount);

  console.log(
    `Customer: ${customerId} | Participants: ${participantCount} | ` +
      `Result: ${decisionToText(decision)}`,
  );
}

function decisionToText(decision: ReservationDecision): string {
  switch (decision) {
    case ReservationDecision.Confirmed:
      return 'CONFIRMED';
    case ReservationDecision.InvalidParticipantCount:
      return 'REFUSED - invalid participant count';
    case ReservationDecision.RepositoryUnavailable:
      return 'REFUSED - repository unavailable';
    case ReservationDecision.CustomerNotFound:
      return 'REFUSED - customer not found';
    case ReservationDecision.CustomerInactive:
      return 'REFUSED - customer inactive';
    case ReservationDecision.CustomerBlocked:
      return 'REFUSED - customer blocked';
  }
}
