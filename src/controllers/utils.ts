export function isEmpty (str: string | undefined): boolean {
  return !str || str === undefined || str.length === 0
}

export function isAnyEmpty (arr: (string | undefined)[]) {
  return arr.filter(s => isEmpty(s)).length !== 0
}
