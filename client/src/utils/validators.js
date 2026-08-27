export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isStrongEnoughPassword(value) {
  return value.length >= 8
}
