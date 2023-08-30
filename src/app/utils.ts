export function toUpperCase(value: string) {
  return value.toUpperCase();
}

export type stringInfo = {
  lowerCase: string,
  upperCase: string,
  characters: string[],
  length: number,
  extraInfo: Object | undefined
}

export function getStringInfo(value: string): stringInfo {
  return {
    lowerCase: value.toLowerCase(),
    upperCase: value.toUpperCase(),
    characters: Array.from(value),
    length: value.length,
    extraInfo: {}
  }
}

export class StringUtils {
  public toUpperCase(value: string): string {
    if (!value) {
      throw new Error("Invalid argument!")
    }
    return value.toUpperCase()
  }
}