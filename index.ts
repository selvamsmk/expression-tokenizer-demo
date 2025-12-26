// Entry point demonstrating both tokenizer approaches

import { quickTokenize } from './src/quickTokenizer'
import { tokenize, tokenizeValues } from './src/extensibleTokenizer'

const expression = 'Bjaeq + kPlzs * qWeTt-(100/zzAbv)'

console.log('Expression Tokenizer Demo')
console.log(`Input: ${expression}`)
console.log()

// Quick tokenizer (simple string array output)
console.log('📦 Quick Tokenizer (fast, harder to extend):')
const quickResult = quickTokenize(expression)
console.log('Result:', quickResult)
console.log()

// Extensible tokenizer (full token objects with types)
console.log('🔧 Extensible Tokenizer (rule-driven, maintainable):')
const extensibleResult = tokenize(expression)
console.log('Tokens with types:', extensibleResult)
console.log()

// Extensible tokenizer (values only for comparison)
console.log('Extensible Tokenizer (values only):')
const extensibleValues = tokenizeValues(expression)
console.log('Result:', extensibleValues)
console.log()

// Compare outputs
const resultsMatch = JSON.stringify(quickResult) === JSON.stringify(extensibleValues)
console.log(`Results match: ${resultsMatch}`)

// Demonstrate error handling
console.log()
console.log('Error Handling Demo:')
try {
  tokenize('invalid@symbol')
} catch (error) {
  console.log('Caught error:', (error as Error).message)
}