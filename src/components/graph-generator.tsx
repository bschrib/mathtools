"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useTheme } from 'next-themes'
import { Moon, Sun, Download, Shuffle, RefreshCw, Settings, Eye, EyeOff } from 'lucide-react'

interface Line {
  id: string
  equation: string
  color: string
  visible: boolean
  equationType: 'whole' | 'fraction' | 'decimal'
}

interface GraphSettings {
  axisMin: number
  axisMax: number
  showGrid: boolean
  showLabels: boolean
  lineWidth: number
  labelPosition: 'axis' | 'border'
  gridColor: string
  textColor: string
  axisColor: string
}

const DEFAULT_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#6366f1'
]

const PRESET_TEMPLATES = [
  { name: 'Simple Intersection', lines: ['y = x', 'y = -x + 4'] },
  { name: 'Parallel Lines', lines: ['y = 2x + 1', 'y = 2x - 2'] },
  { name: 'System of Equations', lines: ['y = x + 2', 'y = -2x + 8', 'y = 0.5x - 1'] },
  { name: 'Random Challenge', lines: [] }
]

export default function GraphGenerator() {
  const { theme, setTheme } = useTheme()
  const [lines, setLines] = useState<Line[]>([])
  const [settings, setSettings] = useState<GraphSettings>({
    axisMin: -10,
    axisMax: 10,
    showGrid: true,
    showLabels: true,
    lineWidth: 2.8,
    labelPosition: 'axis',
    gridColor: theme === 'dark' ? '#374151' : '#e5e7eb',
    textColor: theme === 'dark' ? '#f3f4f6' : 'black',
    axisColor: theme === 'dark' ? '#9ca3af' : 'black'
  })
  const [fileFormat, setFileFormat] = useState('png')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const graphRef = useRef<HTMLDivElement>(null)

  // Initialize with 2 random lines on mount
  useEffect(() => {
    generateRandomLines(2)
  }, [])

  // Generate equation based on type
  const generateEquation = (type: 'whole' | 'fraction' | 'decimal'): string => {
    let slope: number
    let intercept: number
    
    switch (type) {
      case 'whole':
        const wholeSlopes = [-3, -2, -1, 0, 1, 2, 3]
        slope = wholeSlopes[Math.floor(Math.random() * wholeSlopes.length)]
        intercept = Math.floor(Math.random() * 20) - 10
        break
      
      case 'fraction':
        const fractionSlopes = [-3/2, -2/3, -1/2, -1/3, 0, 1/3, 1/2, 2/3, 3/2]
        slope = fractionSlopes[Math.floor(Math.random() * fractionSlopes.length)]
        intercept = Math.floor(Math.random() * 20) - 10
        break
      
      case 'decimal':
        const decimalSlopes = [-2.5, -1.5, -0.5, 0, 0.5, 1.5, 2.5]
        slope = decimalSlopes[Math.floor(Math.random() * decimalSlopes.length)]
        intercept = Math.floor(Math.random() * 20) - 10
        break
    }
    
    // Format equation based on type
    let equation = ''
    if (slope === 0) {
      equation = `y = ${intercept}`
    } else if (Math.abs(slope) === 1) {
      const sign = slope < 0 ? '-' : ''
      if (intercept === 0) {
        equation = `y = ${sign}x`
      } else if (intercept > 0) {
        equation = `y = ${sign}x + ${intercept}`
      } else {
        equation = `y = ${sign}x - ${Math.abs(intercept)}`
      }
    } else {
      let slopeStr = ''
      if (type === 'fraction') {
        // Convert to fraction format
        const absSlope = Math.abs(slope)
        if (absSlope < 1) {
          const denominator = Math.round(1 / absSlope)
          slopeStr = slope < 0 ? `-1/${denominator}` : `1/${denominator}`
        } else {
          const wholePart = Math.floor(absSlope)
          const remainder = absSlope - wholePart
          if (remainder === 0) {
            slopeStr = slope < 0 ? `-${wholePart}` : `${wholePart}`
          } else {
            const denominator = Math.round(1 / remainder)
            slopeStr = slope < 0 ? `-${wholePart} ${1}/${denominator}` : `${wholePart} ${1}/${denominator}`
          }
        }
      } else {
        slopeStr = slope.toString()
      }
      
      if (intercept === 0) {
        equation = `y = ${slopeStr}x`
      } else if (intercept > 0) {
        equation = `y = ${slopeStr}x + ${intercept}`
      } else {
        equation = `y = ${slopeStr}x - ${Math.abs(intercept)}`
      }
    }
    
    return equation
  }

  // Generate truly random lines with varied slopes and directions
  const generateRandomLines = (count: number = lines.length) => {
    const newLines: Line[] = []
    const types: Array<'whole' | 'fraction' | 'decimal'> = ['whole', 'fraction', 'decimal']
    
    for (let i = 0; i < count; i++) {
      const equationType = types[Math.floor(Math.random() * types.length)]
      const equation = generateEquation(equationType)
      
      newLines.push({
        id: `line-${i}`,
        equation,
        color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        visible: true,
        equationType
      })
    }
    
    setLines(newLines)
  }

  // Parse equation to get slope and intercept
  const parseEquation = (eq: string) => {
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

  // Generate the graph using Plotly
  const generateGraph = () => {
    if (!graphRef.current) return
    
    setIsGenerating(true)
    
    const samples = 800
    const x = []
    for (let i = 0; i < samples; i++) {
      x.push(settings.axisMin + i * (settings.axisMax - settings.axisMin) / (samples - 1))
    }
    
    const data = []
    const shapes = []
    const annotations = []
    
    // Add grid lines if enabled
    if (settings.showGrid) {
      const step = Math.max(1, Math.floor((settings.axisMax - settings.axisMin) / 10))
      for (let i = Math.ceil(settings.axisMin / step) * step; i <= settings.axisMax; i += step) {
        // Vertical lines
        shapes.push({
          type: 'line',
          x0: i, y0: settings.axisMin,
          x1: i, y1: settings.axisMax,
          line: { color: settings.gridColor, width: 1 }
        })
        
        // Horizontal lines
        shapes.push({
          type: 'line',
          x0: settings.axisMin, y0: i,
          x1: settings.axisMax, y1: i,
          line: { color: settings.gridColor, width: 1 }
        })
      }
    }
    
    // Add labels if enabled
    if (settings.showLabels) {
      const step = Math.max(1, Math.floor((settings.axisMax - settings.axisMin) / 10))
      for (let i = Math.ceil(settings.axisMin / step) * step; i <= settings.axisMax; i += step) {
        if (i !== 0) {
          if (settings.labelPosition === 'axis') {
            // Position labels along the axes
            // X-axis labels
            annotations.push({
              x: i, y: -0.5,
              xref: 'x', yref: 'y',
              text: String(i),
              showarrow: false,
              font: { color: settings.textColor, size: 10 }
            })
            
            // Y-axis labels
            annotations.push({
              x: -0.5, y: i,
              xref: 'x', yref: 'y',
              text: String(i),
              showarrow: false,
              font: { color: settings.textColor, size: 10 }
            })
          } else {
            // Position labels at the borders (traditional plotly style)
            // X-axis labels at bottom
            annotations.push({
              x: i, y: settings.axisMin,
              xref: 'x', yref: 'y',
              text: String(i),
              showarrow: false,
              font: { color: settings.textColor, size: 10 },
              yshift: -15
            })
            
            // Y-axis labels at left
            annotations.push({
              x: settings.axisMin, y: i,
              xref: 'x', yref: 'y',
              text: String(i),
              showarrow: false,
              font: { color: settings.textColor, size: 10 },
              xshift: -15
            })
          }
        }
      }
    }
    
    // Draw axes
    shapes.push({
      type: 'line',
      x0: settings.axisMin, y0: 0,
      x1: settings.axisMax, y1: 0,
      line: { color: settings.axisColor, width: 1.5 }
    })
    
    shapes.push({
      type: 'line',
      x0: 0, y0: settings.axisMin,
      x1: 0, y1: settings.axisMax,
      line: { color: settings.axisColor, width: 1.5 }
    })
    
    // Origin label (only show when labels are positioned along axis)
    if (settings.showLabels && settings.labelPosition === 'axis') {
      annotations.push({
        x: -0.5, y: -0.5,
        xref: 'x', yref: 'y',
        text: '0',
        showarrow: false,
        font: { color: settings.textColor, size: 12 }
      })
    }
    
    // Add lines
    lines.filter(line => line.visible).forEach((line) => {
      const { m, b } = parseEquation(line.equation)
      const y = x.map(v => m * v + b)
      
      data.push({
        x, y,
        mode: 'lines',
        line: { color: line.color, width: settings.lineWidth },
        name: line.equation
      })
    })
    
    const layout = {
      xaxis: {
        range: [settings.axisMin, settings.axisMax],
        showgrid: false,
        zeroline: false,
        showticklabels: false,
        fixedrange: true
      },
      yaxis: {
        range: [settings.axisMin, settings.axisMax],
        showgrid: false,
        zeroline: false,
        showticklabels: false,
        fixedrange: true,
        scaleanchor: "x",
        scaleratio: 1
      },
      shapes: shapes,
      annotations: annotations,
      plot_bgcolor: theme === 'dark' ? '#1f2937' : 'white',
      paper_bgcolor: theme === 'dark' ? '#111827' : 'white',
      margin: { t: 30, b: 40, l: 50, r: 20 },
      showlegend: true,
      legend: {
        bgcolor: theme === 'dark' ? '#1f2937' : 'white',
        bordercolor: theme === 'dark' ? '#374151' : '#e5e7eb',
        borderwidth: 1
      }
    }
    
    // Use Plotly to render the graph
    if (window.Plotly) {
      window.Plotly.newPlot(graphRef.current, data, layout, { responsive: true })
    }
    
    setTimeout(() => setIsGenerating(false), 100)
  }

  // Download graph as image
  const downloadGraph = () => {
    if (!graphRef.current || !window.Plotly) return
    
    const filename = `linear-graph-${Date.now()}.${fileFormat}`
    
    // Create a temporary graph for download with modified legend if answers are hidden
    const tempDiv = document.createElement('div')
    tempDiv.style.width = '800px'
    tempDiv.style.height = '600px'
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    document.body.appendChild(tempDiv)
    
    // Get current graph data
    const samples = 800
    const x = []
    for (let i = 0; i < samples; i++) {
      x.push(settings.axisMin + i * (settings.axisMax - settings.axisMin) / (samples - 1))
    }
    
    const data = []
    const shapes = []
    const annotations = []
    
    // Recreate the graph structure (copy from generateGraph)
    if (settings.showGrid) {
      const step = Math.max(1, Math.floor((settings.axisMax - settings.axisMin) / 10))
      for (let i = Math.ceil(settings.axisMin / step) * step; i <= settings.axisMax; i += step) {
        shapes.push({
          type: 'line',
          x0: i, y0: settings.axisMin,
          x1: i, y1: settings.axisMax,
          line: { color: settings.gridColor, width: 1 }
        })
        shapes.push({
          type: 'line',
          x0: settings.axisMin, y0: i,
          x1: settings.axisMax, y1: i,
          line: { color: settings.gridColor, width: 1 }
        })
      }
    }
    
    if (settings.showLabels) {
      const step = Math.max(1, Math.floor((settings.axisMax - settings.axisMin) / 10))
      for (let i = Math.ceil(settings.axisMin / step) * step; i <= settings.axisMax; i += step) {
        if (i !== 0) {
          if (settings.labelPosition === 'axis') {
            annotations.push({
              x: i, y: -0.5,
              xref: 'x', yref: 'y',
              text: String(i),
              showarrow: false,
              font: { color: settings.textColor, size: 10 }
            })
            annotations.push({
              x: -0.5, y: i,
              xref: 'x', yref: 'y',
              text: String(i),
              showarrow: false,
              font: { color: settings.textColor, size: 10 }
            })
          } else {
            annotations.push({
              x: i, y: settings.axisMin,
              xref: 'x', yref: 'y',
              text: String(i),
              showarrow: false,
              font: { color: settings.textColor, size: 10 },
              yshift: -15
            })
            annotations.push({
              x: settings.axisMin, y: i,
              xref: 'x', yref: 'y',
              text: String(i),
              showarrow: false,
              font: { color: settings.textColor, size: 10 },
              xshift: -15
            })
          }
        }
      }
    }
    
    shapes.push({
      type: 'line',
      x0: settings.axisMin, y0: 0,
      x1: settings.axisMax, y1: 0,
      line: { color: settings.axisColor, width: 1.5 }
    })
    
    shapes.push({
      type: 'line',
      x0: 0, y0: settings.axisMin,
      x1: 0, y1: settings.axisMax,
      line: { color: settings.axisColor, width: 1.5 }
    })
    
    if (settings.showLabels && settings.labelPosition === 'axis') {
      annotations.push({
        x: -0.5, y: -0.5,
        xref: 'x', yref: 'y',
        text: '0',
        showarrow: false,
        font: { color: settings.textColor, size: 12 }
      })
    }
    
    // Add lines with modified legend based on showAnswer state
    lines.filter(line => line.visible).forEach((line, index) => {
      const { m, b } = parseEquation(line.equation)
      const y = x.map(v => m * v + b)
      
      data.push({
        x, y,
        mode: 'lines',
        line: { color: line.color, width: settings.lineWidth },
        name: showAnswer ? line.equation : `Line ${index + 1}`
      })
    })
    
    const layout = {
      xaxis: {
        range: [settings.axisMin, settings.axisMax],
        showgrid: false,
        zeroline: false,
        showticklabels: false,
        fixedrange: true
      },
      yaxis: {
        range: [settings.axisMin, settings.axisMax],
        showgrid: false,
        zeroline: false,
        showticklabels: false,
        fixedrange: true,
        scaleanchor: "x",
        scaleratio: 1
      },
      shapes: shapes,
      annotations: annotations,
      plot_bgcolor: theme === 'dark' ? '#1f2937' : 'white',
      paper_bgcolor: theme === 'dark' ? '#111827' : 'white',
      margin: { t: 30, b: 40, l: 50, r: 20 },
      showlegend: true,
      legend: {
        bgcolor: theme === 'dark' ? '#1f2937' : 'white',
        bordercolor: theme === 'dark' ? '#374151' : '#e5e7eb',
        borderwidth: 1
      }
    }
    
    // Create the temporary graph and download
    window.Plotly.newPlot(tempDiv, data, layout, { responsive: false }).then(() => {
      window.Plotly.toImage(tempDiv, {
        format: fileFormat,
        width: 800,
        height: 600
      }).then(function(imageData: string) {
        const link = document.createElement('a')
        link.href = imageData
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        document.body.removeChild(tempDiv)
      })
    })
  }

  // Update line equation
  const updateLine = (id: string, equation: string) => {
    setLines(prev => prev.map(line => 
      line.id === id ? { ...line, equation } : line
    ))
  }

  // Update line equation type
  const updateLineType = (id: string, equationType: 'whole' | 'fraction' | 'decimal') => {
    setLines(prev => prev.map(line => {
      if (line.id === id) {
        const newEquation = generateEquation(equationType)
        return { ...line, equationType, equation: newEquation }
      }
      return line
    }))
  }

  // Toggle line visibility
  const toggleLineVisibility = (id: string) => {
    setLines(prev => prev.map(line => 
      line.id === id ? { ...line, visible: !line.visible } : line
    ))
  }

  // Add new line
  const addLine = () => {
    const newLine: Line = {
      id: `line-${Date.now()}`,
      equation: 'y = x',
      color: DEFAULT_COLORS[lines.length % DEFAULT_COLORS.length],
      visible: true,
      equationType: 'whole'
    }
    setLines(prev => [...prev, newLine])
  }

  // Remove line
  const removeLine = (id: string) => {
    setLines(prev => prev.filter(line => line.id !== id))
  }

  // Apply preset template
  const applyTemplate = (template: typeof PRESET_TEMPLATES[0]) => {
    if (template.name === 'Random Challenge') {
      generateRandomLines(3)
    } else if (template.name === 'System of Equations') {
      // For System of Equations, create a proper mix: whole, fraction, decimal
      const equationTypes: Array<'whole' | 'fraction' | 'decimal'> = ['whole', 'fraction', 'decimal']
      const newLines = equationTypes.map((equationType, index) => {
        const generatedEquation = generateEquation(equationType)
        return {
          id: `line-${Date.now()}-${index}`,
          equation: generatedEquation,
          color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
          visible: true,
          equationType
        }
      })
      setLines(newLines)
    } else {
      // For other templates, use whole numbers
      const newLines = template.lines.map((equation, index) => ({
        id: `line-${Date.now()}-${index}`,
        equation,
        color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
        visible: true,
        equationType: 'whole' as const
      }))
      setLines(newLines)
    }
  }

  // Update colors when theme changes
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      gridColor: prev.gridColor.includes('#374151') || prev.gridColor.includes('#e5e7eb') 
        ? (theme === 'dark' ? '#374151' : '#e5e7eb')
        : prev.gridColor,
      textColor: prev.textColor.includes('#f3f4f6') || prev.textColor.includes('black')
        ? (theme === 'dark' ? '#f3f4f6' : 'black')
        : prev.textColor,
      axisColor: prev.axisColor.includes('#9ca3af') || prev.axisColor.includes('black')
        ? (theme === 'dark' ? '#9ca3af' : 'black')
        : prev.axisColor
    }))
  }, [theme])

  // Regenerate graph when dependencies change
  useEffect(() => {
    generateGraph()
  }, [lines, settings, theme])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Interactive Linear Graph Generator</h1>
              <p className="text-muted-foreground">Create professional graphs for math education</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => generateRandomLines(lines.length)} 
                  className="w-full"
                  variant="outline"
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  Randomize All Lines
                </Button>
                <Button onClick={addLine} className="w-full" variant="outline">
                  Add New Line
                </Button>
              </CardContent>
            </Card>

            {/* Line Equations */}
            <Card>
              <CardHeader>
                <CardTitle>Line Equations</CardTitle>
                <CardDescription>Enter equations in form y = mx + b</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <CardDescription>Configure equations and types for each line</CardDescription>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="flex items-center gap-2"
                  >
                    {showAnswer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showAnswer ? 'Hide in Download' : 'Show in Download'}
                  </Button>
                </div>
                {lines.map((line, index) => (
                  <div key={line.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: line.color }}
                      />
                      <Label htmlFor={line.id}>Line {index + 1}</Label>
                      <Badge variant="secondary" className="text-xs">
                        {line.equationType === 'whole' ? 'Whole Numbers' : line.equationType === 'fraction' ? 'Fractions' : 'Decimals'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLineVisibility(line.id)}
                        className="ml-auto"
                      >
                        {line.visible ? '👁️' : '👁️‍🗨️'}
                      </Button>
                      {lines.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLine(line.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id={line.id}
                        value={line.equation}
                        onChange={(e) => updateLine(line.id, e.target.value)}
                        placeholder="y = mx + b"
                        className="flex-1"
                      />
                      <Select 
                        value={line.equationType} 
                        onValueChange={(value: 'whole' | 'fraction' | 'decimal') => updateLineType(line.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="whole">Whole</SelectItem>
                          <SelectItem value="fraction">Fraction</SelectItem>
                          <SelectItem value="decimal">Decimal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Graph Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="axisMin">Axis Min</Label>
                    <Input
                      id="axisMin"
                      type="number"
                      value={settings.axisMin}
                      onChange={(e) => setSettings(prev => ({ ...prev, axisMin: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="axisMax">Axis Max</Label>
                    <Input
                      id="axisMax"
                      type="number"
                      value={settings.axisMax}
                      onChange={(e) => setSettings(prev => ({ ...prev, axisMax: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="lineWidth">Line Width</Label>
                  <Input
                    id="lineWidth"
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={settings.lineWidth}
                    onChange={(e) => setSettings(prev => ({ ...prev, lineWidth: Number(e.target.value) }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showGrid">Show Grid</Label>
                  <input
                    id="showGrid"
                    type="checkbox"
                    checked={settings.showGrid}
                    onChange={(e) => setSettings(prev => ({ ...prev, showGrid: e.target.checked }))}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showLabels">Show Labels</Label>
                  <input
                    id="showLabels"
                    type="checkbox"
                    checked={settings.showLabels}
                    onChange={(e) => setSettings(prev => ({ ...prev, showLabels: e.target.checked }))}
                    className="rounded"
                  />
                </div>

                <div>
                  <Label htmlFor="labelPosition">Label Position</Label>
                  <Select value={settings.labelPosition} onValueChange={(value: 'axis' | 'border') => setSettings(prev => ({ ...prev, labelPosition: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="axis">Along Axis</SelectItem>
                      <SelectItem value="border">Border</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="gridColor">Grid Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="gridColor"
                      type="color"
                      value={settings.gridColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, gridColor: e.target.value }))}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.gridColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, gridColor: e.target.value }))}
                      placeholder="#e5e7eb"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={settings.textColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, textColor: e.target.value }))}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.textColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, textColor: e.target.value }))}
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="axisColor">Axis Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="axisColor"
                      type="color"
                      value={settings.axisColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, axisColor: e.target.value }))}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.axisColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, axisColor: e.target.value }))}
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fileFormat">Format</Label>
                  <Select value={fileFormat} onValueChange={setFileFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                      <SelectItem value="svg">SVG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={downloadGraph} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Graph
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Graph Display */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Graph Preview</CardTitle>
                  <div className="flex gap-2">
                    {PRESET_TEMPLATES.map((template) => (
                      <Badge 
                        key={template.name}
                        variant="outline" 
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => applyTemplate(template)}
                      >
                        {template.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  ref={graphRef} 
                  className="w-full h-[600px] rounded-lg border bg-card"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}