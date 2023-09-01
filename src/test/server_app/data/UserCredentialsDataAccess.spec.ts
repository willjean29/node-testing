import { DataBase } from "../../../app/server_app/data/DataBase";
import { UserCredentialsDataAccess } from "../../../app/server_app/data/UserCredentialsDataAccess";

const insertMock = jest.fn();
const getByMock = jest.fn();
jest.mock('../../../app/server_app/data/DataBase', () => {
  return {
    DataBase: jest.fn().mockImplementation(() => {
      return {
        insert: insertMock,
        getBy: getByMock
      }
    })
  }
})

const userMock = {
  id: '122',
  userName: 'willjean',
  password: '123456',
}

describe('UserCredentialsDataAccess test suite', () => {
  let sut: UserCredentialsDataAccess;

  beforeEach(() => {
    sut = new UserCredentialsDataAccess();
    expect(DataBase).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add user and return the id', async () => {
    insertMock.mockResolvedValueOnce(userMock.id);
    const id = await sut.addUser(userMock);

    expect(id).toBe(userMock.id);
    expect(insertMock).toHaveBeenCalledWith(userMock);
  });

  it('should get user by id and return object', async () => {
    getByMock.mockResolvedValueOnce(userMock);
    const actual = await sut.getUserById(userMock.id);

    expect(actual).toEqual(userMock);
    expect(getByMock).toHaveBeenCalledWith('id', userMock.id);
  });

  it('should get user by name and return object', async () => {
    getByMock.mockResolvedValueOnce(userMock);
    const actual = await sut.getUserByUserName(userMock.userName);

    expect(actual).toEqual(userMock);
    expect(getByMock).toHaveBeenCalledWith('userName', userMock.userName);
  });

})
