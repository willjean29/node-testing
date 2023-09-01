import { DataBase } from "../../../app/server_app/data/DataBase";
import { SessionTokenDataAccess } from "../../../app/server_app/data/SessionTokenDataAccess";

const insertMock = jest.fn();
const updateMock = jest.fn();
const getByMock = jest.fn();

const accountMock = {
  id: "1",
  userName: "jean",
  password: "123456"
}

const tokenIdMock = "123456"

jest.mock('../../../app/server_app/data/DataBase.ts', () => {
  return {
    DataBase: jest.fn().mockImplementation(() => {
      return {
        insert: insertMock,
        update: updateMock,
        getBy: getByMock
      }
    })
  }
})

describe('SessionTokenDataAccess test suite', () => {
  let sut: SessionTokenDataAccess

  beforeEach(() => {
    sut = new SessionTokenDataAccess();
    expect(DataBase).toHaveBeenCalledTimes(1);
    jest.spyOn(global.Date, 'now').mockReturnValue(0);
  })

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add session token and return id', async () => {
    insertMock.mockResolvedValueOnce(tokenIdMock);
    const id = await sut.generateToken(accountMock);
    expect(insertMock).toHaveBeenCalledWith({
      id: '',
      userName: accountMock.userName,
      valid: true,
      expirationDate: new Date(60 * 60 * 1000)
    });
    expect(id).toBe(tokenIdMock);
  });

  it('should invalidate token', async () => {
    await sut.invalidateToken(tokenIdMock);
    expect(updateMock).toHaveBeenCalledWith(tokenIdMock, 'valid', false)
  });

  it('should check valid token', async () => {
    getByMock.mockResolvedValueOnce({ valid: true });
    const isValidToken = await sut.isValidToken(tokenIdMock);
    expect(isValidToken).toBe(true);
  });

  it('should check inexistent token', async () => {
    getByMock.mockResolvedValueOnce(undefined);
    const isValidToken = await sut.isValidToken(tokenIdMock);
    expect(isValidToken).toBe(false);
  });
})
