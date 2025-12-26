# Expression Tokenizer Demo

This repo demonstrates two approaches to tokenizing math-like expressions containing components, numbers, operators, and special component variants. It is intentionally small and focused to showcase design tradeoffs, readability, and extensibility.

The goal is to convert a raw expression like:

```
Bjaeq + kPlzs * qWeTt-(100/zzAbv)
```

Into a flat list of tokens:

```
[Bjaeq, +, kPlzs, *, qWeTt, -, 100, /, zzAbv]
```

---

## Repo Structure

```
expression-tokenizer-demo/
├─ src/
│  ├─ quickTokenizer.ts      # Fast, single-pass, hard-to-extend version
│  └─ extensibleTokenizer.ts # Clear, rule-driven, extensible version
├─ index.ts                  # Entry point
├─ package.json
└─ README.md
```

---

## Why Two Implementations

This repo intentionally contains **two tokenizers**:

* `quickTokenizer.ts` mirrors a fast, single-pass, stack-based approach that is efficient but harder to extend
* `extensibleTokenizer.ts` prioritizes clarity, explicit rules, and ease of adding new token types

This reflects a real production tradeoff I made earlier between speed of delivery and long-term maintainability.

---

## Token Shape

```ts
interface Token {
  value: string
  type: 'component' | 'number' | 'operator'
}
```

---

## Quick Single-Pass Tokenizer (Harder to Extend)

```ts
// src/quickTokenizer.ts

const OPERATORS = new Set(['+', '-', '*', '/'])

export function quickTokenize(expression: string): string[] {
  const tokens: string[] = []
  let buffer = ''

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i]

    if (char === ' ' || char === '(' || char === ')') continue

    if (OPERATORS.has(char)) {
      if (buffer) {
        tokens.push(buffer)
        buffer = ''
      }
      tokens.push(char)
      continue
    }

    buffer += char
  }

  if (buffer) tokens.push(buffer)
  return tokens
}
```

**Characteristics**

* Single iteration
* Minimal allocations
* Fast to implement
* Logic tightly coupled to rules
* Adding new patterns makes it harder to reason about

---

## Extensible Rule-Based Tokenizer (Preferred)

```ts
// src/extensibleTokenizer.ts

type TokenType = 'component' | 'number' | 'operator'

interface TokenRule {
  type: TokenType
  regex: RegExp
}

const RULES: TokenRule[] = [
  { type: 'number', regex: /^\d+/ },
  { type: 'operator', regex: /^[+\-*/]/ },
  { type: 'component', regex: /^[a-zA-Z]{5}(~R\+)?(->[^+\-*/() ]+)?/ }
]

export function tokenize(expression: string) {
  const cleaned = expression.replace(/[()\s]/g, '')
  const tokens: { value: string; type: TokenType }[] = []

  let index = 0

  while (index < cleaned.length) {
    let matched = false

    for (const rule of RULES) {
      const slice = cleaned.slice(index)
      const match = slice.match(rule.regex)

      if (match) {
        tokens.push({ value: match[0], type: rule.type })
        index += match[0].length
        matched = true
        break
      }
    }

    if (!matched) {
      throw new Error(`Unexpected token at position ${index}`)
    }
  }

  return tokens
}
```

**Characteristics**

* Explicit parsing rules
* Easier to read and reason about
* New token types are added by introducing new rules
* Slightly more overhead, but predictable and safe

---

## Entry Point

```ts
// index.ts
import { quickTokenize } from './src/quickTokenizer'
import { tokenize } from './src/extensibleTokenizer'

const expression = 'Bjaeq + kPlzs * qWeTt-(100/zzAbv)'

console.log('Quick:', quickTokenize(expression))
console.log('Extensible:', tokenize(expression))
```

---

## Running with Bun

```bash
# Install dependencies (if any)
bun install

# Run the demo
bun run index.ts

# Or use the npm script
bun start
```

---

## Design Tradeoff Highlight

The quick tokenizer was faster to build and worked well initially, but adding support for repeatable components, dataset components, or future variants required touching tightly coupled logic.

The extensible tokenizer makes each rule explicit, easier to test independently, and safer to evolve as new token patterns are introduced. This version trades a small amount of performance for clarity and long-term maintainability, which is usually the right choice once requirements stabilize.

---

## Notes

* This repo intentionally focuses only on tokenization
* Entity resolution and metadata enrichment would happen in a later pass
* The code mirrors real production constraints without exposing proprietary logic
