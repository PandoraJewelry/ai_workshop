# Tea Store Demo

A full-stack premium tea e-commerce application with a React frontend and FastAPI backend.

## Features

- **Modern UI** - Clean design with Tailwind CSS
- **Responsive Design** - Mobile-first design that works on all devices
- **Shopping Cart** - Full-featured cart with add/remove items and quantity management
- **Wishlist** - Save favorite teas for later
- **Product Filtering** - Filter by category, price range, and origin
- **Product Customization** - Multi-step wizard for customizing select teas
- **Dark Mode** - Toggle between light and dark themes
- **Persistent State** - Cart and wishlist saved in localStorage

## Technology Stack

### Backend
- **Python 3.12** + **FastAPI**
- **Pydantic** for data validation
- **Uvicorn** ASGI server
- **Pytest** for testing

### Frontend
- **React 19** with **TypeScript**
- **Vite 7** for build tooling
- **Tailwind CSS 4**
- **React Context** for state management
- **Vitest** for unit testing
- **Playwright** for E2E testing

## Project Structure

```
tea-store-demo/
├── backend/                    # FastAPI Python backend
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py       # API endpoints
│   │   ├── main.py             # FastAPI app with CORS
│   │   ├── models.py           # Pydantic models
│   │   ├── mock_data.py        # Product data
│   │   └── customization_config.py
│   ├── tests/
│   ├── main.py                 # Uvicorn entry point
│   ├── requirements.txt
│   └── pytest.ini
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── features/       # Feature components
│   │   │   └── shared/         # Reusable components
│   │   ├── contexts/           # React Context providers
│   │   ├── services/           # API services
│   │   ├── types/              # TypeScript types
│   │   └── test/               # Test utilities
│   ├── package.json
│   └── vite.config.ts
│
├── e2e/                        # Playwright E2E tests
├── test.js                     # Cross-platform test runner
├── playwright.config.ts
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm

### Quick Start

The easiest way to run the application:

```bash
# macOS/Linux
./start.sh

# Windows
start.bat
```

This will:
1. Create a Python virtual environment (if needed)
2. Install backend dependencies
3. Install frontend dependencies
4. Start both services

Press `Ctrl+C` to stop all services.

### Manual Installation

If you prefer to set up manually:

```bash
# Backend
cd backend
python -m venv venv

# Activate virtual environment
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate.bat       # Windows

pip install -r requirements.txt

# Frontend
cd frontend
npm install

# E2E tests (from project root)
npm install
```

### Running Manually

```bash
# Backend (port 8765)
cd backend
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate.bat       # Windows
python main.py

# Frontend (port 4321) - in a separate terminal
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:4321
- **Backend API**: http://localhost:8765
- **API Docs**: http://localhost:8765/docs

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (supports filtering) |
| GET | `/api/products/{id}` | Get product by ID |
| GET | `/api/products/category/{category}` | Get products by category |
| GET | `/api/customization-config/{category}` | Get customization options |
| GET | `/health` | Health check |

### Query Parameters for `/api/products`

- `category` - Filter by category (green, black, oolong, herbal)
- `price_max` - Maximum price filter
- `material` - Filter by origin (China, Japan, India, Taiwan)

## Frontend Architecture

### Context Providers
- **CartContext** - Shopping cart state with localStorage persistence
- **WishlistContext** - Wishlist state with localStorage persistence
- **ThemeContext** - Dark/light mode with system preference detection
- **NotificationContext** - Toast notifications

### Services
- **productService** - API calls for products
- **customizationService** - Tea customization API calls

### Components
- **features/** - Home, Wishlist, Customization modal
- **shared/** - Header, Footer, ProductCard, CartSidebar, LoadingSpinner

## Testing

### Test Runner Script

The `test.js` script runs all tests (cross-platform):

```bash
# Using node directly
node test.js              # Run backend + frontend unit tests
node test.js --e2e        # Include E2E tests
node test.js --e2e --headed  # Run E2E tests with visible browser
node test.js --coverage   # Run with coverage reports
node test.js --help       # Show all options

# Or using npm scripts
npm test                  # Run backend + frontend unit tests
npm run test:all          # Include E2E tests
npm run test:coverage     # Run with coverage reports
```

| Option | Description |
|--------|-------------|
| `--e2e` | Run E2E tests (Playwright) |
| `--headed` | Run E2E tests in headed mode (visible browser) |
| `--coverage` | Run tests with coverage reports |

### Running Tests Individually

```bash
# Backend tests
cd backend && pytest -v

# Frontend unit tests
cd frontend && npm run test

# E2E tests
npx playwright test
npx playwright test --headed  # With visible browser
npx playwright test --ui      # With Playwright UI
```

> **Note for Linux users:** Playwright may require system dependencies. If browser installation fails, run:
> ```bash
> npx playwright install-deps chromium
> ```

## Product Data

The application includes 15 premium teas:
- **5 Green Teas** - Including Dragon Well, Matcha, Sencha, Jasmine Pearl, and Gyokuro
- **4 Black Teas** - Darjeeling, Assam, Earl Grey, and Pu-erh
- **3 Oolong Teas** - High Mountain, Tie Guan Yin, and Oriental Beauty
- **3 Herbal Teas** - Chamomile, Peppermint, and Rooibos

Teas range from $18 to $85 with origins including China, Japan, India, and Taiwan.

## Development Notes

- Frontend proxies `/api` requests to backend during development
- CORS is configured for `localhost:4321`
- State is persisted to localStorage (cart, wishlist, theme)

---

**Built with React, FastAPI, and Tailwind CSS**
