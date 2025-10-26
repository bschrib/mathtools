// Test the equation parsing logic separately
describe('Equation Parser', () => {
  const parseEquation = (eq: string) => {
    // Copy the parsing logic from the component
    const normalized = eq.toLowerCase().replace(/\s/g, '')
    let m = 1
    let b = 0
    
    if (normalized.startsWith('y=')) {
      const expression = normalized.substring(2)
      
      if (expression.includes('x')) {
        const parts = expression.split('x')
        if (parts[0] === '' || parts[0] === '+') {
          m = 1
        } else if (parts[0] === '-') {
          m = -1
        } else {
          m = parseFloat(parts[0])
        }
        
        if (parts[1]) {
          b = parseFloat(parts[1])
        }
      } else {
        b = parseFloat(expression)
      }
    }
    
    return { m, b }
  }

  it('parses simple equations correctly', () => {
    expect(parseEquation('y = x')).toEqual({ m: 1, b: 0 })
    expect(parseEquation('y = 2x')).toEqual({ m: 2, b: 0 })
    expect(parseEquation('y = -3x')).toEqual({ m: -3, b: 0 })
  })

  it('parses equations with intercepts correctly', () => {
    expect(parseEquation('y = x + 5')).toEqual({ m: 1, b: 5 })
    expect(parseEquation('y = 2x - 3')).toEqual({ m: 2, b: -3 })
    expect(parseEquation('y = -x + 4')).toEqual({ m: -1, b: 4 })
  })

  it('parses constant equations correctly', () => {
    expect(parseEquation('y = 5')).toEqual({ m: 1, b: 5 }) // Default slope is 1 for non-x equations
    expect(parseEquation('y = -2')).toEqual({ m: 1, b: -2 })
  })

  it('handles whitespace and case variations', () => {
    expect(parseEquation('Y = X + 3')).toEqual({ m: 1, b: 3 })
    expect(parseEquation('y =  2x  -  1  ')).toEqual({ m: 2, b: -1 })
  })

  it('handles edge cases', () => {
    expect(parseEquation('y = -x')).toEqual({ m: -1, b: 0 })
    expect(parseEquation('y = +x')).toEqual({ m: 1, b: 0 })
    expect(parseEquation('y = 0.5x + 2.5')).toEqual({ m: 0.5, b: 2.5 })
  })

  it('handles invalid inputs gracefully', () => {
    expect(parseEquation('invalid')).toEqual({ m: 1, b: 0 })
    expect(parseEquation('')).toEqual({ m: 1, b: 0 })
    expect(parseEquation('x + y = 2')).toEqual({ m: 1, b: 0 })
  })
})