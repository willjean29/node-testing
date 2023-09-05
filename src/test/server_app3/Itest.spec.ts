import { HTTP_CODES, HTTP_METHODS } from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server";
import { makeAwesomeRequest } from "./utils/http-client";

describe('Server app integraction test', () => {
  let sut: Server;

  beforeAll(() => {
    sut = new Server();
    sut.startServer();
  });

  afterAll(() => {
    sut.stopServer();
  });

  const userMock = {
    userName: 'jean',
    password: "123456"
  }

  const reservationMock = {
    id: "",
    room: "abc",
    user: "jean",
    startDate: "2020/01/01",
    endDate: "2020/01/15"
  }

  let token: string = '';
  let createdReservationId: string = '';

  it('should register new user', async () => {
    const result = await fetch('http://localhost:8080/register', {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(userMock)
    })

    const resultBody = await result.json();

    expect(result.status).toEqual(HTTP_CODES.CREATED);
    expect(resultBody.userId).toBeDefined();
  });

  it('should register new user with awesomeRequest', async () => {
    const result = await makeAwesomeRequest({
      host: 'localhost',
      port: 8080,
      method: HTTP_METHODS.POST,
      path: '/register'
    }, userMock)

    expect(result.statusCode).toEqual(HTTP_CODES.CREATED);
    expect(result.body.userId).toBeDefined();
  });

  it('should login a register user', async () => {
    const result = await fetch('http://localhost:8080/login', {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(userMock)
    })

    const resultBody = await result.json();

    expect(result.status).toEqual(HTTP_CODES.CREATED);
    expect(resultBody.token).toBeDefined();
    token = resultBody.token;
  });

  it('should create reservation if authorized', async () => {
    const result = await fetch('http://localhost:8080/reservation', {
      method: HTTP_METHODS.POST,
      headers: { 'authorization': token },
      body: JSON.stringify(reservationMock)
    })

    const resultBody = await result.json();

    expect(result.status).toEqual(HTTP_CODES.CREATED);
    expect(resultBody.reservationId).toBeDefined();
    createdReservationId = resultBody.reservationId;
  });

  it('should get reservation by id  if authorized', async () => {
    const result = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
      method: HTTP_METHODS.GET,
      headers: { 'authorization': token }
    })

    const resultBody = await result.json();
    const expectedReservation = structuredClone(reservationMock);
    expectedReservation.id = createdReservationId;

    expect(result.status).toEqual(HTTP_CODES.OK);
    expect(resultBody).toEqual(expectedReservation);
  });

  it('should create and retrieve multiple reservations if authorized', async () => {
    await fetch('http://localhost:8080/reservation', {
      method: HTTP_METHODS.POST,
      headers: { 'authorization': token },
      body: JSON.stringify(reservationMock)
    })
    await fetch('http://localhost:8080/reservation', {
      method: HTTP_METHODS.POST,
      headers: { 'authorization': token },
      body: JSON.stringify(reservationMock)
    })
    await fetch('http://localhost:8080/reservation', {
      method: HTTP_METHODS.POST,
      headers: { 'authorization': token },
      body: JSON.stringify(reservationMock)
    })

    const result = await fetch('http://localhost:8080/reservation/all', {
      method: HTTP_METHODS.GET,
      headers: { 'authorization': token },
    })

    const resultBody = await result.json();
    expect(result.status).toBe(HTTP_CODES.OK);
    expect(resultBody).toHaveLength(4);
  });

  it('should update reservation by id if authorized', async () => {
    const updateMock = {
      user: "willjean",
    }
    const result = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
      method: HTTP_METHODS.PUT,
      headers: { 'authorization': token },
      body: JSON.stringify(updateMock)
    })

    const resultBody = await result.json();

    expect(result.status).toEqual(HTTP_CODES.OK);
    expect(resultBody).toContain(createdReservationId);
  });

  it('should delete reservation by id if authorized', async () => {
    const updateMock = {
      user: "willjean",
    }
    const result = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
      method: HTTP_METHODS.DELETE,
      headers: { 'authorization': token },
      body: JSON.stringify(updateMock)
    })

    const resultBody = await result.json();

    expect(result.status).toEqual(HTTP_CODES.OK);
    expect(resultBody).toContain(createdReservationId);
  });
})
