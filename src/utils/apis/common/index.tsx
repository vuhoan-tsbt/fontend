export function formatNumber(value: number): string {
  let str = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return str;
}
