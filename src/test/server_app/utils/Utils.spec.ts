import { getRequestBody } from "../../../app/server_app/utils/Utils";
import { IncomingMessage } from 'http';

const requestMock = {
  on: jest.fn(),
}

const someObject = {
  name: "Jean",
  age: 26,
  city: "Lima"
}

const someObjectAsString = JSON.stringify(someObject);

describe('getRequestBody test suite', () => {

  it('should return object for valid JSON', async () => {
    requestMock.on.mockImplementation((event, cb) => {
      if (event === 'data') {
        cb(someObjectAsString)
      } else {
        cb();
      }
    });

    const body = await getRequestBody(requestMock as any as IncomingMessage);
    expect(body).toEqual(someObject);
  });

  it('should throw error to invalid JSON', async () => {
    requestMock.on.mockImplementation((event, cb) => {
      if (event === 'data') {
        cb("some object")
      } else {
        cb();
      }
    });
    await expect(getRequestBody(requestMock as any as IncomingMessage)).rejects.toThrowError('Unexpected token s in JSON at position 0');
  });

  it('should throw error for unexpected error ', async () => {
    const errorMock = new Error("Something went wrong")
    requestMock.on.mockImplementation((event, cb) => {
      if (event === 'error') {
        cb(errorMock)
      }
    });
    await expect(getRequestBody(requestMock as any as IncomingMessage)).rejects.toThrowError(errorMock.message);
  });

})
