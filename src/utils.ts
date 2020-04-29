export class PsqlUtils {
  public static formatArray (arr: string[]) {
    return arr.reduce((acc, val) => `${acc},${val}`, '')
  }

  public static toArray (str: string) {
    return str === '' ? [] : str.split(',')
  }
}
