# Math Tools - Interactive Linear Graph Generator

A modern, feature-rich graph generator designed for math teachers to create professional linear graphs for worksheets and educational materials.

## Features

### Core Functionality
- **Interactive Graph Generation** - Create custom linear graphs with multiple lines
- **Real-time Updates** - See changes instantly as you modify equations
- **Multiple Export Formats** - PNG, JPEG, WebP, and SVG support
- **Dark Mode** - Toggle between light and dark themes

### Advanced Features
- **Label Positioning** - Choose between axis-aligned or border labels
- **Color Customization** - Customize grid, text, and axis colors
- **Preset Templates** - Quick access to common graph patterns
- **Line Management** - Add, remove, and toggle line visibility
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

### Graph Customization
- Adjustable axis ranges
- Configurable line width
- Toggle grid lines on/off
- Toggle labels on/off
- Custom color schemes

## Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build:static

# Run linting
npm run lint
```

## Deployment to Cloudflare Pages

### Option 1: GitHub Actions (Recommended)

1. **Fork or clone this repository to GitHub**
2. **Set up Cloudflare Pages**:
   - Go to Cloudflare Dashboard → Pages
   - Create a new project named "mathtools"
   - Connect your GitHub repository

3. **Configure GitHub Secrets**:
   - In your GitHub repo, go to Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
     - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

4. **Deploy**:
   - Push to the main branch
   - GitHub Actions will automatically build and deploy your site

### Option 2: Manual Deployment

1. **Build the project**:
   ```bash
   npm run build:static
   ```

2. **Deploy to Cloudflare Pages**:
   - Go to Cloudflare Dashboard → Pages
   - Create a new project
   - Upload the `out` directory
   - Or use Wrangler CLI:
     ```bash
     npx wrangler pages deploy out
     ```

### Option 3: Direct Git Integration

1. **Build the project**:
   ```bash
   npm run build:static
   ```

2. **Push to your repository**:
   ```bash
   git add .
   git commit -m "Deploy math tools"
   git push origin main
   ```

3. **Configure Cloudflare Pages**:
   - In Cloudflare Dashboard → Pages
   - Connect your GitHub repository
   - Set build command: `npm run build:static`
   - Set build output directory: `out`
   - Enable automatic deployments

## Project Structure

```
mathtools/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with theme provider
│   │   ├── page.tsx            # Main page component
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── graph-generator.tsx # Main graph generator component
│   │   ├── theme-provider.tsx  # Theme context provider
│   │   └── ui/                 # shadcn/ui components
│   ├── types/
│   │   └── plotly.d.ts         # Plotly type definitions
│   └── lib/
│       └── utils.ts            # Utility functions
├── public/                     # Static assets
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions workflow
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and scripts
├── wrangler.toml               # Cloudflare Pages configuration
└── README.md                   # This file
```

## Configuration

### Next.js Configuration
The project is configured for static export to work with Cloudflare Pages:
- `output: 'export'` - Generates static files
- `trailingSlash: true` - Ensures proper routing
- `images.unoptimized: true` - Optimizes for static hosting

### Cloudflare Pages Configuration
The `wrangler.toml` file configures:
- Build output directory: `./out`
- Compatibility date: `2024-10-21`

## Usage

1. **Open the application** in your browser
2. **Modify equations** using the input fields
3. **Customize appearance** using the settings panel
4. **Export your graph** using the download button

### Tips for Math Teachers
- Use preset templates for common graph patterns
- Adjust colors to match your worksheet theme
- Export in PNG format for best compatibility
- Use dark mode for presentations on projectors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.