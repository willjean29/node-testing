import { StringUtils, getStringInfo, toUpperCase } from "../app/utils"


describe('utils test suite', () => {

  describe.only('StringUtils test', () => {
    let sut: StringUtils;
    beforeEach(() => {
      sut = new StringUtils();
    });

    it.only('Should return correct upperCase', () => {
      const actual = sut.toUpperCase('abc');
      expect(actual).toEqual('ABC');
    })

    it.only('Should throw error on invalid argument - function', () => {
      function expectError() {
        const actual = sut.toUpperCase('');
      }
      expect(expectError).toThrow();
      expect(expectError).toThrowError('Invalid argument!');
    })

    it.only('Should throw error on invalid argument - arrow function', () => {
      expect(() => {
        const actual = sut.toUpperCase('');
      }).toThrow();
      expect(() => {
        const actual = sut.toUpperCase('');
      }).toThrowError('Invalid argument!');
    })

    it.only('Should throw error on invalid argument - try catch block', () => {
      try {
        sut.toUpperCase('');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'Invalid argument!');
      }
    })

  })

  it('should return uppercase of valid string', () => {
    const sut = toUpperCase;
    const expected = 'ABC';
    const actual = sut('abc');
    expect(actual).toBe(expected);
  })

  it('should return info for valid string ', () => {
    const actual = getStringInfo('My-String');

    expect(actual.lowerCase).toBe('my-string');
    expect(actual.upperCase).toBe('MY-STRING');

    expect(actual.length).toBe(9);

    expect(actual.characters).toHaveLength(9);
    expect(actual.characters).toEqual(Array.from('My-String'))
    expect(actual.extraInfo).toEqual({})

    expect(actual.extraInfo).not.toBe(undefined);
    expect(actual.extraInfo).not.toBeUndefined();
    expect(actual.extraInfo).toBeDefined()
  })
})

describe('ToUpperCase', () => {
  it.each([
    { input: 'abc', expected: 'ABC' },
    { input: 'My-String', expected: 'MY-STRING' },
    { input: 'def', expected: 'DEF' }
  ])('$input toUpperCase should be $expected', ({ input, expected }) => {
    const actual = toUpperCase(input);
    expect(actual).toBe(expected);
  })
})