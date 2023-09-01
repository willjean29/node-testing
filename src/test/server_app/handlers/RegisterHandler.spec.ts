import { IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { RegisterHandler } from "../../../app/server_app/handlers/RegisterHandler";
import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel";

const getRequestBodyMock = jest.fn();
jest.mock('../../../app/server_app/utils/Utils.ts', () => {
  return {
    getRequestBody: () => getRequestBodyMock()
  }
})

const accountMock = {
  id: "12315",
  userName: "jean",
  password: "123456"
}

describe('RegisterHandler test suite', () => {
  let sut: RegisterHandler;

  const request = {
    method: undefined,
  }

  const responseMock = {
    statusCode: 0,
    writeHead: jest.fn(),
    write: jest.fn()
  }

  const authorizerMock = {
    registerUser: jest.fn()
  }

  beforeEach(() => {
    sut = new RegisterHandler(
      request as IncomingMessage,
      responseMock as any as ServerResponse,
      authorizerMock as any as Authorizer,
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });


  it('should register valid accounts in request', async () => {
    request.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockResolvedValueOnce(accountMock);
    authorizerMock.registerUser.mockResolvedValueOnce(accountMock.id);
    await sut.handleRequest();
    expect(responseMock.statusCode).toEqual(HTTP_CODES.CREATED);
    expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' })
    expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify({
      userId: accountMock.id
    }))
  });

  it('should throw error with invalid accounts in the request', async () => {
    request.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockResolvedValueOnce({});
    await sut.handleRequest();
    expect(responseMock.statusCode).toEqual(HTTP_CODES.BAD_REQUEST);
    expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.BAD_REQUEST, { 'Content-Type': 'application/json' })
    expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('userName and password required'))
  });

  it('should throw error with method http incorrect ', async () => {
    request.method = HTTP_METHODS.GET;
    await sut.handleRequest();
    expect(request.method).not.toBe(HTTP_METHODS.POST);
  });
})