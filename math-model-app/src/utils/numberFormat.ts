/** Format a number for display: trims trailing zeros, handles big/small values. */
export function formatNumber(value: number, digits = 3): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";
  const abs = Math.abs(value);
  if (abs >= 1e6 || abs < 1e-4) {
    return value.toExponential(2);
  }
  // Round to `digits` significant-ish decimals then strip trailing zeros.
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

/** Format with an optional unit suffix (e.g. "12.5 cm²"). */
export function formatWithUnit(value: number, unit?: string, digits = 3): string {
  const n = formatNumber(value, digits);
  return unit ? `${n} ${unit}` : n;
}
