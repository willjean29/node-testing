import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { LoginHandler } from "../../../app/server_app/handlers/LoginHandler"
import { IncomingMessage, ServerResponse } from 'http';
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

const tokenMock = "dsfsdgdfg454454545";

describe('LoginHandler test suite', () => {
  let sut: LoginHandler
  const request = {
    method: undefined,
  }

  const responseMock = {
    statusCode: 0,
    writeHead: jest.fn(),
    write: jest.fn()
  }

  const authorizerMock = {
    login: jest.fn()
  }

  beforeEach(() => {
    sut = new LoginHandler(
      request as any as IncomingMessage,
      responseMock as any as ServerResponse,
      authorizerMock as any as Authorizer
    )
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should login with valid credentianls in request', async () => {
    request.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockResolvedValueOnce(accountMock);
    authorizerMock.login.mockResolvedValueOnce(tokenMock);
    await sut.handleRequest();
    expect(responseMock.statusCode).toEqual(HTTP_CODES.CREATED);
    expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' })
    expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify({ token: tokenMock }))
  });

  it('should login with invalid credentianls in request', async () => {
    request.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockResolvedValueOnce(accountMock);
    authorizerMock.login.mockResolvedValueOnce('');
    await sut.handleRequest();
    expect(responseMock.statusCode).toEqual(HTTP_CODES.NOT_fOUND);
    expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('wrong username or password'))
  });

  it('should throw error with invalid request', async () => {
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
    expect(responseMock.writeHead).not.toBeCalled();
    expect(responseMock.write).not.toBeCalled();
  });
})
