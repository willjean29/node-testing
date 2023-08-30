import { PasswordChecker, PasswordErrors } from "../../app/pass_checker/PasswordChecker"

describe('PasswordChecker test suite', () => {
  let sut: PasswordChecker;
  beforeEach(() => {
    sut = new PasswordChecker();
  });

  it('Password with less than 8 characters is invalid', () => {
    const actual = sut.checkPassword('1234567');
    expect(actual.valid).toBe(false);
    expect(actual.reasons).toContain(PasswordErrors.Short);
  });

  it('Password with more than 8 characters is valid', () => {
    const actual = sut.checkPassword('12345678Aa');
    expect(actual.valid).toBe(true);
    expect(actual.reasons).not.toContain(PasswordErrors.Short);
  });

  it('Password with no upper case letter is invalid', () => {
    const actual = sut.checkPassword('12345678abc');
    expect(actual.valid).toBe(false);
    expect(actual.reasons).toContain(PasswordErrors.NoUpperCase);
  });

  it('Password with upper case letter is valid', () => {
    const actual = sut.checkPassword('12345678abcD');
    expect(actual.valid).toBe(true);
    expect(actual.reasons).not.toContain(PasswordErrors.NoUpperCase);
  });

  it('Password with no lower case letter is invalid', () => {
    const actual = sut.checkPassword('12345678ABC');
    expect(actual.valid).toBe(false);
    expect(actual.reasons).toContain(PasswordErrors.NoLowerCase);
  });

  it('Password with lower case letter is valid', () => {
    const actual = sut.checkPassword('12345678abcD');
    expect(actual.valid).toBe(true);
    expect(actual.reasons).not.toContain(PasswordErrors.NoLowerCase);
  });

  it('Complex password is valid', () => {
    const actual = sut.checkPassword('12345678abcD');
    expect(actual.reasons).toHaveLength(0);
    expect(actual.valid).toBe(true);
  });

  it('Admin password with no number is invalid', () => {
    const actual = sut.checkAdminPassword('aaaaaaaabcD');
    expect(actual.reasons).toContain(PasswordErrors.NoNumber);
    expect(actual.valid).toBe(false);
  });

  it('Admin password with number is valid', () => {
    const actual = sut.checkAdminPassword('23445454abcD');
    expect(actual.reasons).not.toContain(PasswordErrors.NoNumber);
    expect(actual.valid).toBe(true);
  });

})