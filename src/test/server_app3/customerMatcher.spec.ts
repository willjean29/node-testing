import { Reservation } from "../../app/server_app/model/ReservationModel"

expect.extend({
  toBeValidReservation(reservation: Reservation) {
    const isValid = (reservation.id.length > 5) ? true : false;
    const isValidUser = (reservation.id.length > 5) ? true : false;

    return {
      pass: isValid && isValidUser,
      message: () => 'expected reservation to have valid id and user '
    }
  },
  toHaveUser(reservation: Reservation, user: string) {
    const hasRightUser = user === reservation.user;
    return {
      pass: hasRightUser,
      message: () => `expected reservation to have user ${user}, recived ${reservation.user}`
    }
  }
});

interface CustomerMatcher<R> {
  toBeValidReservation(): R,
  toHaveUser(user: string): R
}

declare global {
  namespace jest {
    interface Matchers<R> extends CustomerMatcher<R> { }
  }
}

const reservationMock: Reservation = {
  id: "123456",
  room: "abc",
  user: "jean",
  startDate: "2020/01/01",
  endDate: "2020/01/15"
}
describe('custom matcher test', () => {
  it('check for valid reservation', () => {
    expect(reservationMock).toBeValidReservation();
    expect(reservationMock).toHaveUser("jean");
  });
})
