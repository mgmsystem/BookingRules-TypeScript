import type { CustomerRepository } from './customer-repository.js';
import { ReservationDecision } from './reservation-decision.js';

export class Reservation {
  private static readonly maximumParticipantCount = 5;

  public constructor(
    private readonly customerId: number,
    private readonly customerRepository?: CustomerRepository,
  ) {}

  public evaluate(participantCount: number): ReservationDecision {
    if (
      !Number.isSafeInteger(participantCount) ||
      participantCount < 1 ||
      participantCount > Reservation.maximumParticipantCount
    ) {
      return ReservationDecision.InvalidParticipantCount;
    }

    if (this.customerRepository === undefined) {
      return ReservationDecision.RepositoryUnavailable;
    }

    const status = this.customerRepository.tryGetStatus(this.customerId);

    if (status === undefined) {
      return ReservationDecision.CustomerNotFound;
    }

    if (!status.active) {
      return ReservationDecision.CustomerInactive;
    }

    return status.blocked
      ? ReservationDecision.CustomerBlocked
      : ReservationDecision.Confirmed;
  }

  public canConfirm(participantCount: number): boolean {
    return this.evaluate(participantCount) === ReservationDecision.Confirmed;
  }
}
