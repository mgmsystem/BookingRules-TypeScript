import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { ReservationDecision } from '../../src/domain/reservation-decision.js';
import { Reservation } from '../../src/domain/reservation.js';
import { InMemoryCustomerRepository } from '../../src/infrastructure/in-memory-customer-repository.js';

describe('Reservation integration tests', () => {
  test('confirms for an active customer', () => {
    const reservation = createReservation(true, false);

    assert.equal(reservation.canConfirm(1), true);
  });

  test('does not confirm for a blocked customer', () => {
    const reservation = createReservation(true, true);

    assert.equal(reservation.canConfirm(1), false);
  });

  test('does not confirm for a missing customer', () => {
    const reservation = new Reservation(
      99,
      new InMemoryCustomerRepository(),
    );

    assert.equal(reservation.canConfirm(1), false);
  });

  test('reports an inactive customer', () => {
    const reservation = createReservation(false, false);

    assert.equal(
      reservation.evaluate(1),
      ReservationDecision.CustomerInactive,
    );
  });

  test('reports a blocked customer', () => {
    const reservation = createReservation(true, true);

    assert.equal(
      reservation.evaluate(1),
      ReservationDecision.CustomerBlocked,
    );
  });

  test('reports a missing customer', () => {
    const reservation = new Reservation(
      99,
      new InMemoryCustomerRepository(),
    );

    assert.equal(
      reservation.evaluate(1),
      ReservationDecision.CustomerNotFound,
    );
  });
});

function createReservation(active: boolean, blocked: boolean): Reservation {
  const repository = new InMemoryCustomerRepository();
  repository.addCustomer(25, active, blocked);
  return new Reservation(25, repository);
}
