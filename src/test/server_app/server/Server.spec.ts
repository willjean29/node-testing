import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess";
import { Server } from "../../../app/server_app/server/Server"
import { RegisterHandler } from '../../../app/server_app/handlers/RegisterHandler';
import { LoginHandler } from '../../../app/server_app/handlers/LoginHandler';
import { ReservationsHandler } from "../../../app/server_app/handlers/ReservationsHandler";
import { HTTP_CODES } from "../../../app/server_app/model/ServerModel";

jest.mock("../../../app/server_app/auth/Authorizer");
jest.mock("../../../app/server_app/data/ReservationsDataAccess");
jest.mock("../../../app/server_app/handlers/LoginHandler");
jest.mock("../../../app/server_app/handlers/RegisterHandler");
jest.mock("../../../app/server_app/handlers/ReservationsHandler");


const requestMock = {
  url: '',
  headers: {
    'user-agent': 'jest-test'
  }
};
const responseMock = {
  end: jest.fn(),
  writeHead: jest.fn()
};
const serverMock = {
  listen: jest.fn(),
  close: jest.fn()
};

jest.mock('http', () => (
  {
    createServer: (cb: Function) => {
      cb(requestMock, responseMock);
      return serverMock;
    }
  }
))

describe('Server tes t suite', () => {
  let sut: Server;

  beforeEach(() => {
    sut = new Server();
    expect(Authorizer).toBeCalledTimes(1);
    expect(ReservationsDataAccess).toBeCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should start server on port 8080 and end the request', async () => {
    await sut.startServer();
    expect(serverMock.listen).toHaveBeenCalledWith(8080);
    expect(responseMock.end).toBeCalled();
  })

  it('should handle register request', async () => {
    requestMock.url = 'localhost:8080/register';
    const handleRequestSpy = jest.spyOn(RegisterHandler.prototype, 'handleRequest');
    await sut.startServer();

    expect(handleRequestSpy).toBeCalledTimes(1);
    expect(RegisterHandler).toBeCalledWith(requestMock, responseMock, expect.any(Authorizer))
  })

  it('should handle login request', async () => {
    requestMock.url = 'localhost:8080/login';
    const handleRequestSpy = jest.spyOn(LoginHandler.prototype, 'handleRequest');
    await sut.startServer();

    expect(handleRequestSpy).toBeCalledTimes(1);
    expect(LoginHandler).toBeCalledWith(requestMock, responseMock, expect.any(Authorizer))
  })

  it('should handle reservation request', async () => {
    requestMock.url = 'localhost:8080/reservation';
    const handleRequestSpy = jest.spyOn(ReservationsHandler.prototype, 'handleRequest');
    await sut.startServer();

    expect(handleRequestSpy).toBeCalledTimes(1);
    expect(ReservationsHandler).toBeCalledWith(requestMock, responseMock, expect.any(Authorizer), expect.any(ReservationsDataAccess))
  })

  it('should throw error to exception in handle request method', async () => {
    requestMock.url = 'localhost:8080/reservation';
    const handleRequestSpy = jest.spyOn(ReservationsHandler.prototype, 'handleRequest');
    const errorMock = new Error("Unexpected error")
    handleRequestSpy.mockRejectedValueOnce(errorMock);

    await sut.startServer();

    expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.INTERNAL_SERVER_ERROR, JSON.stringify(`Internal server error: ${errorMock.message}`))
  });

  it('should stop server', async () => {
    await sut.startServer();
    await sut.stopServer();
    expect(serverMock.close).toBeCalled();
  });
})
