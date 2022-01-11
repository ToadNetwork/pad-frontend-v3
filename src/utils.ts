async function delay(ms: number) {
  await new Promise(res => setTimeout(res, ms))
}

function equalsInsensitive(s1: string, s2: string) {
  if (s1 == null || s2 == null) {
    return s1 === s2
  }
  return s1.toLowerCase() == s2.toLowerCase()
}

export {
  delay,
  equalsInsensitive
}