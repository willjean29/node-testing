export enum PasswordErrors {
  Short = 'Password is too short!',
  NoUpperCase = 'Upper case letter required!',
  NoLowerCase = 'Lower case letter required!',
  NoNumber = "At least one number required!"
}

export interface CheckResult {
  valid: boolean;
  reasons: PasswordErrors[];
}

export class PasswordChecker {
  public checkPassword(password: string): CheckResult {
    const reasons: PasswordErrors[] = [];
    this.checkForLength(password, reasons);
    this.checkForUpperCase(password, reasons);
    this.checkForLowerCase(password, reasons);
    return {
      valid: reasons.length > 0 ? false : true,
      reasons
    };
  }

  public checkAdminPassword(password: string): CheckResult {
    const { reasons } = this.checkPassword(password);
    this.checkForNumber(password, reasons);
    return {
      valid: reasons.length > 0 ? false : true,
      reasons
    }
  }

  private checkForLength(password: string, reasons: PasswordErrors[]) {
    if (password.length < 8) {
      reasons.push(PasswordErrors.Short);
    }
  }

  private checkForUpperCase(password: string, reasons: PasswordErrors[]) {
    if (password === password.toLowerCase()) {
      reasons.push(PasswordErrors.NoUpperCase);
    }
  }

  private checkForLowerCase(password: string, reasons: PasswordErrors[]) {
    if (password === password.toUpperCase()) {
      reasons.push(PasswordErrors.NoLowerCase);
    }
  }

  private checkForNumber(password: string, reasons: PasswordErrors[]) {
    const regex = /\d+/;
    if (!regex.test(password)) {
      reasons.push(PasswordErrors.NoNumber);
    }
  }
}
