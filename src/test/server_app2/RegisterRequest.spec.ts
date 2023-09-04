import { DataBase } from "../../app/server_app/data/DataBase"
import { HTTP_CODES, HTTP_METHODS } from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server";
import { RequestTestWrapper } from './test_utils/RequestTestWrapper';
import { ResponseTestWraper } from "./test_utils/ResponseTestWrapper";

// jest.mock("../../app/server_app/data/DataBase");

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

describe('Register requests test suite', () => {
  afterEach(() => {
    requestWrapper.clearFields();
    responseWrapper.clearFields();
  });

  it('should register new users', async () => {
    requestWrapper.method = HTTP_METHODS.POST;
    requestWrapper.url = 'localhost:8080/register';
    requestWrapper.body = {
      userName: "jean",
      password: "123456"
    };
    jest.spyOn(DataBase.prototype, 'insert').mockResolvedValueOnce("1234")

    await new Server().startServer();
    await new Promise(process.nextTick);

    expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
    expect(responseWrapper.body).toEqual(expect.objectContaining({
      userId: expect.any(String)
    }));
    expect(DataBase.prototype.insert).toHaveBeenCalledTimes(1);
  });

  it('should rejest request with no userName and password', async () => {
    requestWrapper.method = HTTP_METHODS.POST;
    requestWrapper.url = 'localhost:8080/register';
    requestWrapper.body = {};
    await new Server().startServer();
    await new Promise(process.nextTick);

    expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
  });

  it('should do nothing for not supported methods', async () => {
    requestWrapper.method = HTTP_METHODS.DELETE;
    requestWrapper.url = 'localhost:8080/register';
    requestWrapper.body = {};
    await new Server().startServer();
    await new Promise(process.nextTick);

    expect(responseWrapper.statusCode).toBeUndefined();
  });
})
