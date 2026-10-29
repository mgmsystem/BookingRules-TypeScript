import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { ReservationDecision } from '../../src/domain/reservation-decision.js';
import { Reservation } from '../../src/domain/reservation.js';
import {
  FailingCustomerRepository,
  FakeCustomerRepository,
  SpyCustomerRepository,
} from './test-repositories.js';

describe('Reservation unit tests', () => {
  test('does not confirm for an inactive customer', () => {
    const reservation = createReservation(false);

    assert.equal(reservation.canConfirm(1), false);
  });

  test('does not confirm for a blocked customer', () => {
    const reservation = createReservation(true, true);

    assert.equal(reservation.canConfirm(1), false);
  });

  test('does not confirm without a repository', () => {
    const reservation = new Reservation(1);

    assert.equal(reservation.canConfirm(1), false);
  });

  test('queries the reservation customer', () => {
    const repository = new FakeCustomerRepository(true);
    const reservation = new Reservation(25, repository);

    assert.equal(reservation.canConfirm(1), true);
    assert.equal(repository.lastCustomerId, 25);
  });

  test('propagates repository failures', () => {
    const reservation = new Reservation(
      1,
      new FailingCustomerRepository(),
    );

    assert.throws(() => reservation.canConfirm(1), {
      message: 'Failed to query customer',
    });
  });

  test('does not query the repository for invalid participant count', () => {
    const repository = new SpyCustomerRepository();
    const reservation = new Reservation(1, repository);

    assert.equal(reservation.canConfirm(0), false);
    assert.equal(repository.statusCalls, 0);
  });

  test('queries the repository once for a valid reservation', () => {
    const repository = new SpyCustomerRepository();
    const reservation = new Reservation(1, repository);

    assert.equal(reservation.canConfirm(1), true);
    assert.equal(repository.statusCalls, 1);
  });

  test('reports confirmed for a valid reservation', () => {
    const reservation = createReservation(true);

    assert.equal(
      reservation.evaluate(1),
      ReservationDecision.Confirmed,
    );
  });

  test('does not query the repository for non-integer or non-finite counts', () => {
    const repository = new SpyCustomerRepository();
    const reservation = new Reservation(1, repository);
    const invalidCounts = [2.5, Number.NaN, Infinity, -Infinity];

    for (const participantCount of invalidCounts) {
      assert.equal(
        reservation.evaluate(participantCount),
        ReservationDecision.InvalidParticipantCount,
      );
    }

    assert.equal(repository.statusCalls, 0);
  });

  test('reports basic refusal reasons', () => {
    const reservation = createReservation(true);
    assert.equal(
      reservation.evaluate(0),
      ReservationDecision.InvalidParticipantCount,
    );

    const reservationWithoutRepository = new Reservation(1);
    assert.equal(
      reservationWithoutRepository.evaluate(1),
      ReservationDecision.RepositoryUnavailable,
    );
  });

  const participantCases: ReadonlyArray<
    readonly [name: string, participantCount: number, expected: boolean]
  > = [
    ['zero participants', 0, false],
    ['negative participants', -1, false],
    ['one participant', 1, true],
    ['maximum capacity', 5, true],
    ['above capacity', 6, false],
    ['fractional participants', 2.5, false],
    ['NaN participants', Number.NaN, false],
    ['positive infinity participants', Infinity, false],
    ['negative infinity participants', -Infinity, false],
  ];

  for (const [name, participantCount, expected] of participantCases) {
    test(`validates participant count: ${name}`, () => {
      const reservation = createReservation(true);

      assert.equal(reservation.canConfirm(participantCount), expected);
    });
  }
});

function createReservation(
  customerActive: boolean,
  customerBlocked = false,
): Reservation {
  return new Reservation(
    1,
    new FakeCustomerRepository(customerActive, customerBlocked),
  );
}
