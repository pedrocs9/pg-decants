export function formatCLPAmount(value: number | string) {
  return Math.round(Number(value)).toLocaleString('es-CL');
}
