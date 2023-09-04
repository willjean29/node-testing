import { Authorizer } from "../../app/server_app/auth/Authorizer";
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

const userMock = {
  id: "123",
  userName: "jean",
  password: "123456"
}

const tokenMock = "123sdsd";

describe('Login requests test suite', () => {

  beforeEach(() => {
    requestWrapper.headers['user-agent'] = 'jest tests'
  })

  afterEach(() => {
    requestWrapper.clearFields();
    responseWrapper.clearFields();
    jest.clearAllMocks();
  });

  it('should login user', async () => {
    requestWrapper.method = HTTP_METHODS.POST;
    requestWrapper.url = 'localhost:8080/login';
    requestWrapper.body = userMock;
    getBySpy.mockResolvedValue(userMock);
    insertSpy.mockResolvedValueOnce(tokenMock);

    await new Server().startServer();
    await new Promise(process.nextTick);

    expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
  });

  it('should reject request with user not found', async () => {
    requestWrapper.method = HTTP_METHODS.POST;
    requestWrapper.url = 'localhost:8080/login';
    requestWrapper.body = userMock;
    getBySpy.mockResolvedValue(null);

    await new Server().startServer();
    await new Promise(process.nextTick);

    expect(responseWrapper.statusCode).toBe(HTTP_CODES.NOT_fOUND);
  });

  it('should reject request with no userName and password', async () => {
    requestWrapper.method = HTTP_METHODS.POST;
    requestWrapper.url = 'localhost:8080/login';
    requestWrapper.body = {};
    await new Server().startServer();
    await new Promise(process.nextTick);

    expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
  });

  it('should do nothing for not supported methods', async () => {
    requestWrapper.method = HTTP_METHODS.DELETE;
    requestWrapper.url = 'localhost:8080/login';
    requestWrapper.body = {};
    await new Server().startServer();
    await new Promise(process.nextTick);

    expect(responseWrapper.statusCode).toBeUndefined();
  });

})
