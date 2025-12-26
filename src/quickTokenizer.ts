// Fast, single-pass, stack-based approach that is efficient but harder to extend

const OPERATORS = new Set(['+', '-', '*', '/'])

export function quickTokenize(expression: string): string[] {
  const tokens: string[] = []
  let buffer = ''

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i]

    // Skip whitespace and parentheses
    if (char === ' ' || char === '(' || char === ')') continue

    // Handle operators
    if (OPERATORS.has(char)) {
      if (buffer) {
        tokens.push(buffer)
        buffer = ''
      }
      tokens.push(char)
      continue
    }

    // Accumulate characters into buffer
    buffer += char
  }

  // Push final buffer if it exists
  if (buffer) tokens.push(buffer)
  
  return tokens
}