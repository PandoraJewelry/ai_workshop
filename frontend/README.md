# Tea Store Frontend (React)

A React + TypeScript + Vite frontend for the Tea Store demo application.

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** for build tooling
- **Tailwind CSS 4** for styling
- **React Router DOM 7** for routing
- **Vitest** for unit testing
- **Playwright** for E2E testing (at project root)

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
The app will be available at http://localhost:4321

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Testing

### Unit Tests (Vitest)

Run all unit tests:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

### Test Structure

```
src/
├── test/
│   ├── setup.ts          # Test setup and mocks
│   └── test-utils.tsx    # Custom render with providers
├── services/
│   └── productService.test.ts
├── contexts/
│   └── CartContext.test.tsx
└── components/
    └── shared/
        └── ProductCard.test.tsx
```

### E2E Tests (Playwright)

E2E tests are located at the project root level (`/e2e`). See the root README for E2E testing instructions.

## Project Structure

```
src/
├── components/
│   ├── features/          # Feature-specific components
│   │   ├── home/          # Home page components
│   │   ├── wishlist/      # Wishlist page
│   │   └── customization/ # Product customization modal
│   └── shared/            # Reusable components
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── ProductCard.tsx
│       ├── CartSidebar.tsx
│       └── ...
├── contexts/              # React Context providers
│   ├── CartContext.tsx
│   ├── WishlistContext.tsx
│   ├── ThemeContext.tsx
│   └── NotificationContext.tsx
├── services/              # API services
│   ├── api.ts
│   ├── productService.ts
│   └── customizationService.ts
├── types/                 # TypeScript type definitions
└── test/                  # Test utilities
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |

## API Proxy

The development server proxies `/api` requests to the backend at `http://localhost:8765`. This is configured in `vite.config.ts`.

## Styling

The app uses Tailwind CSS with custom colors defined for the luxury tea theme:
- `gold` - Primary accent color
- `dark-gold` - Hover state for gold
- `luxury` - Dark luxury background color

## State Management

State is managed using React Context:
- **CartContext** - Shopping cart state with localStorage persistence
- **WishlistContext** - Wishlist state with localStorage persistence
- **ThemeContext** - Dark/light theme with system preference detection
- **NotificationContext** - Toast notifications

## Expanding the ESLint Configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules. See the [Vite React TypeScript template docs](https://github.com/vitejs/vite-plugin-react) for details.
