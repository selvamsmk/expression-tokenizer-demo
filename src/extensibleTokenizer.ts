// Clear, rule-driven, extensible version that prioritizes clarity and ease of adding new token types

export type TokenType = 'component' | 'number' | 'operator'

export interface Token {
  value: string
  type: TokenType
}

interface TokenRule {
  type: TokenType
  regex: RegExp
}

// Parsing rules in order of precedence
const RULES: TokenRule[] = [
  { type: 'number', regex: /^\d+/ },
  { type: 'operator', regex: /^[+\-*/]/ },
  { type: 'component', regex: /^[a-zA-Z]{5}(~R\+)?(->[^+\-*/() ]+)?/ }
]

export function tokenize(expression: string): Token[] {
  // Clean expression by removing parentheses and whitespace
  const cleaned = expression.replace(/[()\s]/g, '')
  const tokens: Token[] = []

  let index = 0

  while (index < cleaned.length) {
    let matched = false

    // Try each rule until we find a match
    for (const rule of RULES) {
      const slice = cleaned.slice(index)
      const match = slice.match(rule.regex)

      if (match) {
        tokens.push({ 
          value: match[0], 
          type: rule.type 
        })
        index += match[0].length
        matched = true
        break
      }
    }

    if (!matched) {
      throw new Error(`Unexpected token at position ${index}: "${cleaned[index]}"`)
    }
  }

  return tokens
}

// Convenience function that returns just the values (for compatibility)
export function tokenizeValues(expression: string): string[] {
  return tokenize(expression).map(token => token.value)
}