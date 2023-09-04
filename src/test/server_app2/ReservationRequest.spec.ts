import { DataBase } from "../../app/server_app/data/DataBase";
import { HTTP_CODES, HTTP_METHODS } from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server";
import { RequestTestWrapper } from "./test_utils/RequestTestWrapper";
import { ResponseTestWraper } from "./test_utils/ResponseTestWrapper";

const requestWrapper = new RequestTestWrapper();
const responseWrapper = new ResponseTestWraper();

const fakeServer = {
  listen: () => { },
  close: () => { },
}

jest.mock("http", () => {
  return {
    createServer: (cb: Function) => {
      cb(requestWrapper, responseWrapper);
      return fakeServer;
    }
  }
});

const insertSpy = jest.spyOn(DataBase.prototype, 'insert');
const getBySpy = jest.spyOn(DataBase.prototype, 'getBy');
const getAllElementsSpy = jest.spyOn(DataBase.prototype, 'getAllElements');
const updateSpy = jest.spyOn(DataBase.prototype, 'update');

const reservationMock = {
  id: "123",
  room: "abc",
  user: "jean",
  startDate: "2020/01/01",
  endDate: "2020/01/15"
}

const sessionTokenMock = {
  id: "12345",
  userName: "jean",
  valid: true,
  expirationDate: "2020/01/15"
};

describe('Reservation requests test suite', () => {
  beforeEach(() => {
    requestWrapper.headers['user-agent'] = 'jest tests';
    requestWrapper.headers['authorization'] = sessionTokenMock.id;
  })

  afterEach(() => {
    requestWrapper.clearFields();
    responseWrapper.clearFields();
    jest.clearAllMocks();
  });

  describe('POST requests', () => {
    beforeEach(() => {
      requestWrapper.method = HTTP_METHODS.POST;
    });

    it('should throw error to handle post when body request is empty', async () => {
      getBySpy.mockResolvedValueOnce(sessionTokenMock);
      requestWrapper.url = 'localhost:8080/reservation';
      requestWrapper.body = {};

      await new Server().startServer();
      await new Promise(process.nextTick);

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    });

    it('should throw error to handle post with ivalid request', async () => {
      getBySpy.mockResolvedValueOnce(sessionTokenMock);
      requestWrapper.url = 'localhost:8080/reservation';
      requestWrapper.body = {
        lastName: "user",
      };

      await new Server().startServer();
      await new Promise(process.nextTick);

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    });

    it('should add reservation to handle post', async () => {
      getBySpy.mockResolvedValueOnce(sessionTokenMock);
      requestWrapper.url = 'localhost:8080/reservation';
      requestWrapper.body = reservationMock;
      insertSpy.mockResolvedValueOnce(reservationMock.id);
      await new Server().startServer();
      await new Promise(process.nextTick);
      expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
    });
  })

  describe('DELETE requests', () => {
    beforeEach(() => {
      requestWrapper.method = HTTP_METHODS.DELETE;
    });

    it('should throw error to delete reservation by id to handle delete', async () => {
      getBySpy.mockResolvedValueOnce(sessionTokenMock);
      requestWrapper.url = 'localhost:8080/reservation';

      await new Server().startServer();
      await new Promise(process.nextTick);
      expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    });

    it('should delete reservation by id to handle delete', async () => {
      getBySpy.mockResolvedValueOnce(sessionTokenMock);

      requestWrapper.url = `localhost:8080/reservation/${reservationMock.id}`;

      await new Server().startServer();
      await new Promise(process.nextTick);
      expect(responseWrapper.statusCode).toBe(HTTP_CODES.OK);
    });
  })

  describe('GET requests', () => {
    beforeEach(() => {
      requestWrapper.method = HTTP_METHODS.GET;
    });

    it('should get all reservations', async () => {
      getBySpy.mockResolvedValueOnce(sessionTokenMock);
      getAllElementsSpy.mockResolvedValueOnce([reservationMock])
      requestWrapper.url = `localhost:8080/reservation/all`;

      await new Server().startServer();
      await new Promise(process.nextTick);

      expect(getAllElementsSpy).toHaveBeenCalled();
    });

    it('should get reservation by id', async () => {
      getBySpy.mockResolvedValueOnce(sessionTokenMock).mockResolvedValueOnce(reservationMock);
      requestWrapper.url = `localhost:8080/reservation/${reservationMock.id}`;

      await new Server().startServer();
      await new Promise(process.nextTick);

      expect(getBySpy).toHaveBeenCalledWith('id', reservationMock.id);
    });

    it('should throw error when getting reservation by id not found', async () => {
      getBySpy.mockResolvedValueOnce(sessionTokenMock).mockResolvedValueOnce(null);
      requestWrapper.url = `localhost:8080/reservation/${reservationMock.id}`;

      await new Server().startServer();
      await new Promise(process.nextTick);

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.NOT_fOUND);
    });

    it('should throw an error when getting reservation by id, when id is not provided', async () => {
      getBySpy.mockResolvedValueOnce(sessionTokenMock);
      requestWrapper.url = `localhost:8080/reservation`;

      await new Server().startServer();
      await new Promise(process.nextTick);
      expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    });
  })

  describe('PUT requests', () => {
    beforeEach(() => {
      requestWrapper.method = HTTP_METHODS.PUT;
    });

    it('should update reservation by id', async () => {
      requestWrapper.body = {
        user: "willjean"
      }
      getBySpy.mockResolvedValueOnce(sessionTokenMock).mockResolvedValueOnce(reservationMock);
      requestWrapper.url = `localhost:8080/reservation/${reservationMock.id}`;

      await new Server().startServer();
      await new Promise(process.nextTick);

      expect(updateSpy).toHaveBeenCalled();
    });

    it('should throw error when updating reservation by id and empty request', async () => {
      getBySpy.mockResolvedValueOnce(sessionTokenMock).mockResolvedValueOnce(reservationMock);
      requestWrapper.url = `localhost:8080/reservation/${reservationMock.id}`;
      requestWrapper.body = {};

      await new Server().startServer();
      await new Promise(process.nextTick);

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    });

    it('should throw error when updating reservation by id and invalid request', async () => {
      getBySpy.mockResolvedValueOnce(sessionTokenMock).mockResolvedValueOnce(reservationMock);
      requestWrapper.url = `localhost:8080/reservation/${reservationMock.id}`;
      requestWrapper.body = {
        lastName: "John"
      };

      await new Server().startServer();
      await new Promise(process.nextTick);

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    });

    it('should throw error when updating reservation by id not found', async () => {
      getBySpy.mockResolvedValueOnce(sessionTokenMock).mockResolvedValueOnce(null);
      requestWrapper.url = `localhost:8080/reservation/${reservationMock.id}`;

      await new Server().startServer();
      await new Promise(process.nextTick);

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.NOT_fOUND);
    });

    it('should throw an error when updating reservation by id, when id is not provided', async () => {
      getBySpy.mockResolvedValueOnce(sessionTokenMock);
      requestWrapper.url = `localhost:8080/reservation`;

      await new Server().startServer();
      await new Promise(process.nextTick);

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    });
  })

  it('should throw error to unauthorized', async () => {
    requestWrapper.headers['authorization'] = '';
    requestWrapper.method = HTTP_METHODS.POST;
    requestWrapper.url = 'localhost:8080/reservation';

    await new Server().startServer();
    await new Promise(process.nextTick);

    expect(responseWrapper.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
  });

  it('should do nothing for not supported http methods', async () => {
    requestWrapper.method = HTTP_METHODS.OPTIONS;
    getBySpy.mockResolvedValueOnce(sessionTokenMock);
    requestWrapper.url = 'localhost:8080/reservation';

    await new Server().startServer();
    await new Promise(process.nextTick);

    expect(responseWrapper.statusCode).toBeUndefined();
  });
});