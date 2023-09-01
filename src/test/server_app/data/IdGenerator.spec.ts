import { generateRandomId } from "../../../app/server_app/data/IdGenerator";

describe('IdGenerator test suite', () => {
  it('should generate and return random id ', () => {
    const id = generateRandomId();
    expect(id).toBeDefined();
  });

})
