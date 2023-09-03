import { Authorizer } from "../../../app/server_app/auth/Authorizer"
import { SessionTokenDataAccess } from "../../../app/server_app/data/SessionTokenDataAccess";
import { UserCredentialsDataAccess } from "../../../app/server_app/data/UserCredentialsDataAccess";

const isValidTokenMock = jest.fn();
const generateTokenMock = jest.fn();
const invalidateTokenMock = jest.fn();

jest.mock("../../../app/server_app/data/SessionTokenDataAccess", () => {
  return {
    SessionTokenDataAccess: jest.fn().mockImplementation(() => {
      return {
        isValidToken: isValidTokenMock,
        generateToken: generateTokenMock,
        invalidateToken: invalidateTokenMock
      }
    })
  }
});

const addUserMock = jest.fn();
const getUserByUserNameMock = jest.fn();

jest.mock("../../../app/server_app/data/UserCredentialsDataAccess", () => {
  return {
    UserCredentialsDataAccess: jest.fn().mockImplementation(() => {
      return {
        addUser: addUserMock,
        getUserByUserName: getUserByUserNameMock
      }
    })
  }
});


const userCredentialsDataAccessMock = {
  addUser: jest.fn(),
  getUserByUserName: jest.fn(),
}

const tokenMock = "sfsdf156";

const userMock = {
  id: "12345",
  userName: "jean",
  password: "123456"
}

describe('Authorizer test suite', () => {
  let sut: Authorizer;

  beforeEach(() => {
    sut = new Authorizer();
    expect(SessionTokenDataAccess).toBeCalledTimes(1);
    expect(UserCredentialsDataAccess).toBeCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Test', () => {

  });


  it('should validate token', async () => {
    isValidTokenMock.mockResolvedValueOnce(true);

    const isValid = await sut.validateToken(tokenMock);

    expect(isValidTokenMock).toHaveBeenCalledWith(tokenMock)
    expect(isValid).toBe(true);
  });

  it('should register user', async () => {
    addUserMock.mockResolvedValueOnce(userMock.id);

    const id = await sut.registerUser(userMock.userName, userMock.password);

    expect(addUserMock).toHaveBeenCalledWith({
      id: "",
      userName: userMock.userName,
      password: userMock.password
    })
    expect(id).toBe(userMock.id);
  });

  it('should login user', async () => {
    getUserByUserNameMock.mockResolvedValueOnce(userMock);
    generateTokenMock.mockResolvedValueOnce(tokenMock);
    const token = await sut.login(userMock.userName, userMock.password);

    expect(token).toBe(tokenMock);
  });

  it('should logout user', async () => {
    await sut.logout(tokenMock);
    expect(invalidateTokenMock).toHaveBeenCalledWith(tokenMock);
  });
})
