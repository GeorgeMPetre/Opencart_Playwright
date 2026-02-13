// Convert both to numbers with 2 decimal places for comparison

export function moneyEq(a: string | number, b: string | number): boolean {
  const numA = Number(parseFloat(a as string).toFixed(2));
  const numB = Number(parseFloat(b as string).toFixed(2));
  return numA === numB;
}