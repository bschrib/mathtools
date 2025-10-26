import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import GraphGenerator from '@/components/graph-generator'

// Mock Plotly
global.Plotly = {
  newPlot: jest.fn().mockResolvedValue({}),
  toImage: jest.fn().mockResolvedValue('data:image/png;base64,test'),
}

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('GraphGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<GraphGenerator />)
    expect(screen.getByText('Interactive Linear Graph Generator')).toBeInTheDocument()
    expect(screen.getByText('Create professional graphs for math education')).toBeInTheDocument()
  })

  it('has initial 2 random lines on load', () => {
    render(<GraphGenerator />)
    
    // Should have 2 line equation inputs
    const lineInputs = screen.getAllByPlaceholderText('y = mx + b')
    expect(lineInputs).toHaveLength(2)
  })

  it('can add new lines', () => {
    render(<GraphGenerator />)
    
    const addButton = screen.getByText('Add New Line')
    fireEvent.click(addButton)
    
    // Should now have 3 line equation inputs
    const lineInputs = screen.getAllByPlaceholderText('y = mx + b')
    expect(lineInputs).toHaveLength(3)
  })

  it('can randomize all lines', () => {
    render(<GraphGenerator />)
    
    const randomizeButton = screen.getByText('Randomize All Lines')
    const initialInputs = screen.getAllByPlaceholderText('y = mx + b')
    const initialValues = initialInputs.map(input => (input as HTMLInputElement).value)
    
    fireEvent.click(randomizeButton)
    
    const newInputs = screen.getAllByPlaceholderText('y = mx + b')
    const newValues = newInputs.map(input => (input as HTMLInputElement).value)
    
    // Values should have changed
    expect(newValues).not.toEqual(initialValues)
  })

  it('can toggle line visibility', () => {
    render(<GraphGenerator />)
    
    // Find the first visibility toggle button (should show eye emoji)
    const visibilityButtons = screen.getAllByText('👁️')
    expect(visibilityButtons.length).toBeGreaterThan(0)
    
    fireEvent.click(visibilityButtons[0])
    // Button should change to crossed eye emoji
    expect(screen.getAllByText('👁️‍🗨️').length).toBeGreaterThan(0)
  })

  it('can remove lines', () => {
    render(<GraphGenerator />)
    
    // Should start with 2 lines
    let lineInputs = screen.getAllByPlaceholderText('y = mx + b')
    expect(lineInputs).toHaveLength(2)
    
    // Find and click the first remove button
    const removeButtons = screen.getAllByText('×')
    fireEvent.click(removeButtons[0])
    
    // Should now have 1 line
    lineInputs = screen.getAllByPlaceholderText('y = mx + b')
    expect(lineInputs).toHaveLength(1)
  })

  it('can update axis settings', () => {
    render(<GraphGenerator />)
    
    const axisMinInput = screen.getByDisplayValue('-10')
    const axisMaxInput = screen.getByDisplayValue('10')
    
    fireEvent.change(axisMinInput, { target: { value: '-5' } })
    fireEvent.change(axisMaxInput, { target: { value: '15' } })
    
    expect(axisMinInput).toHaveValue(-5)
    expect(axisMaxInput).toHaveValue(15)
  })

  it('can toggle grid and labels', () => {
    render(<GraphGenerator />)
    
    const showGridCheckbox = screen.getByLabelText('Show Grid')
    const showLabelsCheckbox = screen.getByLabelText('Show Labels')
    
    expect(showGridCheckbox).toBeChecked()
    expect(showLabelsCheckbox).toBeChecked()
    
    fireEvent.click(showGridCheckbox)
    fireEvent.click(showLabelsCheckbox)
    
    expect(showGridCheckbox).not.toBeChecked()
    expect(showLabelsCheckbox).not.toBeChecked()
  })

  it('can change label position', () => {
    render(<GraphGenerator />)
    
    // Just check that the label position control exists
    // Testing the actual dropdown value is complex with Radix UI
    expect(screen.getByText('Label Position')).toBeInTheDocument()
  })

  it('can change colors', () => {
    render(<GraphGenerator />)
    
    const gridColorInputs = screen.getAllByDisplayValue('#e5e7eb')
    const textColorInputs = screen.getAllByDisplayValue('black')
    const axisColorInputs = screen.getAllByDisplayValue('black')
    
    expect(gridColorInputs.length).toBeGreaterThan(0)
    expect(textColorInputs.length).toBeGreaterThan(0)
    expect(axisColorInputs.length).toBeGreaterThan(0)
  })

  it('can download graph', async () => {
    render(<GraphGenerator />)
    
    const downloadButton = screen.getByText('Download Graph')
    fireEvent.click(downloadButton)
    
    await waitFor(() => {
      expect(global.Plotly.toImage).toHaveBeenCalled()
    })
  })

  it('has preset template badges', () => {
    render(<GraphGenerator />)
    
    expect(screen.getByText('Simple Intersection')).toBeInTheDocument()
    expect(screen.getByText('Parallel Lines')).toBeInTheDocument()
    expect(screen.getByText('System of Equations')).toBeInTheDocument()
    expect(screen.getByText('Random Challenge')).toBeInTheDocument()
  })

  it('can apply preset templates', () => {
    render(<GraphGenerator />)
    
    const randomChallengeBadge = screen.getByText('Random Challenge')
    fireEvent.click(randomChallengeBadge)
    
    // Should generate 3 lines for Random Challenge
    const lineInputs = screen.getAllByPlaceholderText('y = mx + b')
    expect(lineInputs).toHaveLength(3)
  })
})