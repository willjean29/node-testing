import { ReservationsHandler } from "../../../app/server_app/handlers/ReservationsHandler";
import { Authorizer } from '../../../app/server_app/auth/Authorizer';
import { IncomingMessage, ServerResponse } from 'http';
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess";
import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel";

const getRequestBodyMock = jest.fn();
jest.mock('../../../app/server_app/utils/Utils.ts', () => {
  return {
    getRequestBody: () => getRequestBodyMock()
  }
})

const tokenMock = "sadasdas12354";

const requestMock = {
  method: '',
  url: '',
  headers: {
    authorization: ''
  }
}

const responseMock = {
  statusCode: 0,
  write: jest.fn(),
  writeHead: jest.fn()
}

const authorizerMock = {
  validateToken: jest.fn(),

}

const reservationsDataAccessMock = {
  getAllReservations: jest.fn(),
  getReservation: jest.fn(),
  createReservation: jest.fn(),
  updateReservation: jest.fn(),
  deleteReservation: jest.fn()
}

const reservationMock = {
  id: "123",
  room: "abc",
  user: "jean",
  startDate: "2020/01/01",
  endDate: "2020/01/15"
}

describe('ReservationsHandler test suite', () => {
  let sut: ReservationsHandler;

  beforeEach(() => {
    sut = new ReservationsHandler(
      requestMock as any as IncomingMessage,
      responseMock as any as ServerResponse,
      authorizerMock as any as Authorizer,
      reservationsDataAccessMock as any as ReservationsDataAccess
    );
    requestMock.headers.authorization = tokenMock;
    authorizerMock.validateToken.mockResolvedValueOnce(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST requests', () => {
    beforeEach(() => {
      requestMock.method = HTTP_METHODS.POST;
    });

    it('should throw error to handle post when body request is empty', async () => {
      getRequestBodyMock.mockResolvedValueOnce({});
      await sut.handleRequest();
      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Incomplete reservation!'))
    });

    it('should throw error to handle post with ivalid request', async () => {
      getRequestBodyMock.mockResolvedValueOnce({
        lastName: "user",
      });
      await sut.handleRequest();
      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Incomplete reservation!'))
    });

    it('should add reservation to handle post', async () => {
      getRequestBodyMock.mockResolvedValueOnce(reservationMock);
      reservationsDataAccessMock.createReservation.mockResolvedValueOnce(reservationMock.id)
      await sut.handleRequest();
      expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
      expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
      expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify({ reservationId: reservationMock.id }))
    });
  })

  describe('DELETE requests', () => {
    beforeEach(() => {
      requestMock.method = HTTP_METHODS.DELETE;
    });

    it('should throw error to delete reservation by id to handle delete', async () => {
      requestMock.url = 'localhost:8080/reservations';
      await sut.handleRequest();
      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(
        'Please provide an ID!'
      ))
    });

    it('should delete reservation by id to handle delete', async () => {
      requestMock.url = `localhost:8080/reservations/${reservationMock.id}`;
      await sut.handleRequest();
      expect(responseMock.statusCode).toBe(HTTP_CODES.OK);
      expect(reservationsDataAccessMock.deleteReservation).toHaveBeenCalledWith(reservationMock.id)
      expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Deleted reservation with id ${reservationMock.id}`))
    });
  })

  describe('GET requests', () => {
    beforeEach(() => {
      requestMock.method = HTTP_METHODS.GET;
    });

    it('should get all reservations', async () => {
      requestMock.url = `localhost:8080/reservations/all`;
      reservationsDataAccessMock.getAllReservations.mockResolvedValueOnce([reservationMock])
      await sut.handleRequest();
      expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
      expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify([reservationMock]));
    });

    it('should get reservation by id', async () => {
      requestMock.url = `localhost:8080/reservations/${reservationMock.id}`;
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(reservationMock);
      await sut.handleRequest();
      expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
      expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(reservationMock));
    });

    it('should throw error when getting reservation by id not found', async () => {
      requestMock.url = `localhost:8080/reservations/${reservationMock.id}`;
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(null);
      await sut.handleRequest();
      expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
      expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Reservation with id ${reservationMock.id} not found`));
    });

    it('should throw an error when getting reservation by id, when id is not provided', async () => {
      requestMock.url = `localhost:8080/reservations`;
      await sut.handleRequest();
      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(
        'Please provide an ID!'
      ));
    });
  })

  describe('PUT requests', () => {
    beforeEach(() => {
      requestMock.method = HTTP_METHODS.PUT;
    });

    it('should update reservation by id', async () => {
      const requestBody = {
        user: "willjean"
      }
      requestMock.url = `localhost:8080/reservations/${reservationMock.id}`;
      getRequestBodyMock.mockResolvedValueOnce(requestBody);
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(reservationMock);
      await sut.handleRequest();
      expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
      expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Updated ${Object.keys(requestBody)} of reservation ${reservationMock.id}`));
    });

    it('should throw error when updating reservation by id and empty request', async () => {
      requestMock.url = `localhost:8080/reservations/${reservationMock.id}`;
      getRequestBodyMock.mockResolvedValueOnce({});
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(reservationMock);
      await sut.handleRequest();
      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(
        'Please provide valid fields to update!'
      ));
    });

    it('should throw error when updating reservation by id and invalid request', async () => {
      requestMock.url = `localhost:8080/reservations/${reservationMock.id}`;
      getRequestBodyMock.mockResolvedValueOnce({
        lastName: "John",
      });
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(reservationMock);
      await sut.handleRequest();
      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(
        'Please provide valid fields to update!'
      ));
    });

    it('should throw error when updating reservation by id not found', async () => {
      requestMock.url = `localhost:8080/reservations/${reservationMock.id}`;
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(null);
      await sut.handleRequest();
      expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
      expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Reservation with id ${reservationMock.id} not found`));
    });

    it('should throw an error when updating reservation by id, when id is not provided', async () => {
      requestMock.url = `localhost:8080/reservations`;
      await sut.handleRequest();
      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(
        'Please provide an ID!'
      ));
    });
  })

  it('should throw error to unauthorized', async () => {
    requestMock.headers.authorization = '';
    await sut.handleRequest();
    expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
    expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Unauthorized operation!'))
  });

  it('should do nothing for not supported http methods', async () => {
    requestMock.method = 'SOME-METHOD'
    requestMock.headers.authorization = tokenMock;
    authorizerMock.validateToken.mockResolvedValueOnce(true);
    await sut.handleRequest();

    expect(responseMock.write).not.toBeCalled();
    expect(responseMock.writeHead).not.toBeCalled();
  });
})
