import { DataBase } from "../../../app/server_app/data/DataBase"
import * as IdGenerator from "../../../app/server_app/data/IdGenerator";
type someTypeWithId = {
  id: string,
  name: string,
  color: string,
}

const someObjectMock: someTypeWithId = {
  id: '1',
  name: "table",
  color: "black",
}

const someObjectMock2: someTypeWithId = {
  id: '1',
  name: "table",
  color: "blue",
}

describe('Batabase test suite', () => {
  let sut: DataBase<someTypeWithId>

  beforeEach(() => {
    sut = new DataBase<someTypeWithId>;
    jest.spyOn(IdGenerator, 'generateRandomId').mockReturnValue(someObjectMock.id);
  });

  it('should return id after insert', async () => {
    const id = await sut.insert(someObjectMock);
    expect(id).toBe(someObjectMock.id);
  });

  it('should get element after insert', async () => {
    const id = await sut.insert(someObjectMock);
    const element = await sut.getBy('id', id)
    expect(element).toEqual(someObjectMock);
  });

  it('should get all elements with the same property', async () => {
    await sut.insert(someObjectMock);
    const elements = await sut.findAllBy('name', someObjectMock.name);
    expect(elements).toHaveLength(1);
  });

  it('should change color on object', async () => {
    const id = await sut.insert(someObjectMock);
    const expectedColor = 'green';

    await sut.update(id, 'color', expectedColor);
    const element = await sut.getBy('id', id);
    expect(element.color).toEqual(expectedColor);
  });

  it('should delete object', async () => {
    const id = await sut.insert(someObjectMock);

    await sut.delete(id);
    const element = await sut.getBy('id', id);
    expect(element).toBeUndefined();
  });

  it('should get all elements', async () => {
    await sut.insert(someObjectMock);
    await sut.insert(someObjectMock2);
    const expectedResult = [someObjectMock, someObjectMock2];

    const elements = await sut.getAllElements();

    expect(elements).toEqual(expectedResult)
  });
})
