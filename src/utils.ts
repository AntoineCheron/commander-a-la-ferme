export class PsqlUtils {
  public static formatArray (arr: string[]) {
    if (arr.length === 1) {
      return arr[0]
    } else if (arr.length > 1) {
      return arr.slice(1).reduce((acc, val) => `${acc},${val}`, arr[0])
    } else {
      return ''
    }
  }

  public static toArray (str: string) {
    if (str === undefined || str === '') {
      return []
    } else {
      return str.split(',')
    }
  }
}
