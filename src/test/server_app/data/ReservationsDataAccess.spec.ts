import { DataBase } from "../../../app/server_app/data/DataBase";
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess";

const insertMock = jest.fn();
const updateMock = jest.fn();
const getByMock = jest.fn();
const deleteMock = jest.fn();
const getAllElementsMock = jest.fn();

const reservationMock = {
  id: "123456",
  room: "AD",
  user: "222",
  startDate: "02/01/2015",
  endDate: "10/01/2015"
}

jest.mock('../../../app/server_app/data/DataBase.ts', () => {
  return {
    DataBase: jest.fn().mockImplementation(() => {
      return {
        insert: insertMock,
        update: updateMock,
        getBy: getByMock,
        delete: deleteMock,
        getAllElements: getAllElementsMock
      }
    })
  }
})

describe('ReservationsDataAccess test suite', () => {
  let sut: ReservationsDataAccess
  beforeEach(() => {
    sut = new ReservationsDataAccess();
    expect(DataBase).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create reservation and return id', async () => {
    insertMock.mockResolvedValueOnce(reservationMock.id);
    const id = await sut.createReservation(reservationMock);
    expect(insertMock).toHaveBeenCalledWith(reservationMock);
    expect(id).toBe(reservationMock.id)
  });

  it('should get reservation and return element', async () => {
    getByMock.mockResolvedValueOnce(reservationMock);
    const reservation = await sut.getReservation(reservationMock.id);
    expect(getByMock).toHaveBeenCalledWith('id', reservationMock.id);
    expect(reservation).toEqual(reservationMock)
  });

  it('should get all reservation and return array', async () => {
    getAllElementsMock.mockResolvedValueOnce([reservationMock]);
    const reservations = await sut.getAllReservations();
    expect(getAllElementsMock).toHaveBeenCalled();
    expect(reservations).toContain(reservationMock)
  });

  it('should update reservation by id', async () => {
    await sut.updateReservation(reservationMock.id, 'room', 'CD');
    expect(updateMock).toHaveBeenCalledWith(reservationMock.id, 'room', 'CD');
  });

  it('should delete reservation by id ', async () => {
    await sut.deleteReservation(reservationMock.id,);
    expect(deleteMock).toHaveBeenCalledWith(reservationMock.id);
  });

})
