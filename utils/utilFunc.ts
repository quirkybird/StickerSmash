export function clamp(val: number, min: number, max: number) {
  if (typeof val !== 'number' || isNaN(val)) {
    console.warn('Invalid value passed to clamp:', val);
    return val; // 返回默认值
  }
  return Math.min(Math.max(val, min), max);
}
