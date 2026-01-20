export function isPlainObject(x) {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}

export function deepMerge(target, source) {
  if (!isPlainObject(target) || !isPlainObject(source)) return source;

  const out = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (key in out && isPlainObject(out[key]) && isPlainObject(value)) {
      out[key] = deepMerge(out[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}
