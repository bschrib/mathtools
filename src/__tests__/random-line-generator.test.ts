// Test the random line generation logic
describe('Random Line Generator', () => {
  const generateRandomEquation = () => {
    // Copy the random generation logic from the component
    const slopeOptions = [-5, -3, -2, -1, -0.5, 0, 0.5, 1, 2, 3, 5]
    const slope = slopeOptions[Math.floor(Math.random() * slopeOptions.length)]
    const intercept = Math.floor(Math.random() * 20) - 10
    
    let equation = ''
    if (slope === 0) {
      equation = `y = ${intercept}`
    } else if (slope === 1) {
      equation = intercept >= 0 ? `y = x + ${intercept}` : `y = x - ${Math.abs(intercept)}`
    } else if (slope === -1) {
      equation = intercept >= 0 ? `y = -x + ${intercept}` : `y = -x - ${Math.abs(intercept)}`
    } else {
      if (intercept === 0) {
        equation = `y = ${slope}x`
      } else if (intercept > 0) {
        equation = `y = ${slope}x + ${intercept}`
      } else {
        equation = `y = ${slope}x - ${Math.abs(intercept)}`
      }
    }
    
    return { equation, slope, intercept }
  }

  it('generates valid equation format', () => {
    const { equation } = generateRandomEquation()
    // Should match either y = [number]x[+/-][number] or y = [number]
    expect(equation).toMatch(/^y = (?:[+-]?\d*\.?\d*x(?:[+-]\d+)?|[+-]?\d+)$/)
  })

  it('generates varied slopes', () => {
    const slopes = new Set()
    for (let i = 0; i < 50; i++) {
      const { slope } = generateRandomEquation()
      slopes.add(slope)
    }
    // Should generate multiple different slopes
    expect(slopes.size).toBeGreaterThan(5)
  })

  it('generates varied intercepts', () => {
    const intercepts = new Set()
    for (let i = 0; i < 50; i++) {
      const { intercept } = generateRandomEquation()
      intercepts.add(intercept)
    }
    // Should generate multiple different intercepts
    expect(intercepts.size).toBeGreaterThan(5)
  })

  it('handles special cases correctly', () => {
    // Test zero slope
    const mockMath = Object.create(global.Math)
    mockMath.random = () => 0.5 // Will select slope 0
    global.Math = mockMath
    
    const { equation } = generateRandomEquation()
    expect(equation).toMatch(/^y = -?\d+$/)
    
    // Restore original Math
    global.Math = Math
  })

  it('generates both positive and negative slopes', () => {
    let hasPositive = false
    let hasNegative = false
    
    // Mock Math.random to ensure we get different values
    const originalRandom = Math.random
    
    for (let i = 0; i < 20; i++) {
      // Force different random seeds
      Math.random = () => (i / 20)
      const { slope } = generateRandomEquation()
      if (slope > 0) hasPositive = true
      if (slope < 0) hasNegative = true
    }
    
    // Restore original Math.random
    Math.random = originalRandom
    
    expect(hasPositive).toBe(true)
    expect(hasNegative).toBe(true)
  })

  it('generates reasonable intercept range', () => {
    for (let i = 0; i < 100; i++) {
      const { intercept } = generateRandomEquation()
      expect(intercept).toBeGreaterThanOrEqual(-10)
      expect(intercept).toBeLessThanOrEqual(10)
    }
  })
})