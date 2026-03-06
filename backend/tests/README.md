# Pandora Test Suite

Comprehensive testing framework for the Pandora luxury jewelry e-commerce PWA.

## Test Overview

The test suite includes 58+ tests covering:
- **API Endpoints** (18 tests) - Product CRUD and filtering
- **Data Models** (9 tests) - Pydantic validation
- **Customization API** (10 tests) - Product customization configuration
- **Wishlist Integration** (21 tests) - Wishlist functionality with backend integration

## Test Files

### Backend Tests (pytest)

#### `test_api.py`
Tests for FastAPI product endpoints (`app/api/routes.py:9-67`)
- Product retrieval (all products, by ID, by category)
- Multi-parameter filtering (category, price, material)
- Error handling (404, 400 errors)
- Data validation and schema compliance

#### `test_models.py`
Tests for Pydantic Product model (`app/models.py:5-27`)
- Field validation (price > 0, non-empty strings)
- Category and material enums
- Required fields enforcement

#### `test_customization_api.py`
Tests for product customization API (`app/api/routes.py:69-91`)
- Customization configuration retrieval
- Price modifiers and engraving rules
- Category-specific customization options

#### `test_wishlist.py`
Integration tests for wishlist feature
- HTML page loading and structure
- API integration for product data
- localStorage key consistency
- Cart integration (move-to-cart feature)
- Responsive design and PWA support
- UI components (counter badge, empty state, grid layout)

### Frontend Tests

#### `test_wishlist_frontend.html`
Browser-based unit tests for `static/js/wishlist.js`
- WishlistManager class functionality (27+ tests)
- localStorage persistence
- Add/remove/toggle operations
- Duplicate prevention
- Counter badge updates
- Integration with global wishlist singleton

**To run:** Open `tests/test_wishlist_frontend.html` in a web browser

## Running Tests

### Prerequisites
```bash
# Install dependencies
uv pip install -r requirements.txt
# or
pip install -r requirements.txt
```

### Run All Backend Tests
```bash
pytest tests/ -v
```

### Run Specific Test Files
```bash
# Product API tests
pytest tests/test_api.py -v

# Wishlist integration tests
pytest tests/test_wishlist.py -v

# Model validation tests
pytest tests/test_models.py -v

# Customization API tests
pytest tests/test_customization_api.py -v
```

### Run Specific Test Classes or Methods
```bash
# Run specific test class
pytest tests/test_api.py::TestProductAPI -v

# Run specific test method
pytest tests/test_api.py::TestProductAPI::test_get_all_products -v
```

### Run with Coverage
```bash
# Generate coverage report
pytest tests/ -v --cov=app

# Generate HTML coverage report
pytest tests/ -v --cov=app --cov-report=html

# View coverage report
open htmlcov/index.html
```

### Run Frontend Tests
```bash
# Open in browser
open tests/test_wishlist_frontend.html
# or on Linux
xdg-open tests/test_wishlist_frontend.html
```

## Test Results

### Current Status
✅ **58 tests passing** (as of last run)

- `test_api.py`: 18/18 passing
- `test_models.py`: 9/9 passing
- `test_customization_api.py`: 10/10 passing
- `test_wishlist.py`: 21/21 passing

### Frontend Tests
✅ **27+ tests passing** in `test_wishlist_frontend.html`

## Wishlist Feature Testing

The wishlist feature is **entirely client-side** using localStorage (no backend API endpoints). Tests cover:

### Backend Integration Tests (`test_wishlist.py`)
Tests verify that the wishlist feature can:
1. Load the wishlist HTML page successfully
2. Access the product API to fetch product data
3. Include necessary JavaScript files (wishlist.js, cart.js)
4. Display UI components correctly
5. Support move-to-cart functionality
6. Work with responsive design
7. Support PWA features

**Key Architecture Note:** The wishlist has no backend persistence - all data is stored in `localStorage['pandora_wishlist']`. Tests verify the backend provides necessary product data via `/api/products`.

### Frontend Unit Tests (`test_wishlist_frontend.html`)
Browser-based tests for WishlistManager class:
- **Initialization**: Empty wishlist, loading from localStorage
- **Add Operations**: Adding products, preventing duplicates
- **Remove Operations**: Removing by ID, graceful error handling
- **Toggle Operations**: Adding/removing based on state
- **Persistence**: localStorage save/load cycle
- **UI Updates**: Counter badge synchronization
- **Data Integrity**: Product field preservation
- **Edge Cases**: Invalid JSON, non-existent products

## Test Architecture

### Client-Side Wishlist Pattern
```
User Action → WishlistManager → localStorage → UI Update
                    ↓
              fetchProducts() from /api/products
```

The wishlist:
- Uses `localStorage['pandora_wishlist']` for persistence
- Fetches product data from `/api/products` endpoint
- Never makes API calls to save wishlist data
- Integrates with ShoppingCart for move-to-cart feature

### Test Coverage Areas

1. **API Layer** (`test_api.py`)
   - Tests that product endpoints work for wishlist to fetch data
   - No wishlist-specific endpoints (feature is client-side only)

2. **Integration Layer** (`test_wishlist.py`)
   - Tests wishlist page loads and includes necessary scripts
   - Verifies product API provides required data fields
   - Checks HTML structure and UI components

3. **Frontend Layer** (`test_wishlist_frontend.html`)
   - Tests WishlistManager class methods
   - Verifies localStorage operations
   - Tests UI synchronization

## Debugging Failed Tests

### Common Issues

#### 1. Import Errors
```bash
# If you see "ModuleNotFoundError: No module named 'playwright'"
# Skip UI tests that require playwright:
pytest tests/ -v --ignore=tests/test_customization_ui.py
```

#### 2. Server Not Running
Tests use `TestClient` from `fastapi.testclient` - no need to start server manually.

#### 3. Frontend Tests Not Loading
Make sure to open `test_wishlist_frontend.html` in a modern browser with JavaScript enabled.

#### 4. localStorage Tests Failing
Frontend tests use a mock localStorage - check browser console for errors.

## Writing New Tests

### Backend Test Template
```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

class TestFeature:
    def test_feature_works(self):
        response = client.get("/api/endpoint")
        assert response.status_code == 200
        data = response.json()
        assert "field" in data
```

### Frontend Test Template
Add to `test_wishlist_frontend.html`:
```javascript
runner.test('feature works', () => {
    const wl = new WishlistManager();
    const result = wl.someMethod();
    assertEqual(result, expectedValue, 'error message');
});
```

## Continuous Integration

To integrate with CI/CD:

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: |
    uv pip install -r requirements.txt
    pytest tests/ -v --ignore=tests/test_customization_ui.py
```

## Test Maintenance

### When Adding Wishlist Features
1. Update `test_wishlist.py` for any new HTML/API integration
2. Update `test_wishlist_frontend.html` for new WishlistManager methods
3. Verify localStorage key remains `pandora_wishlist`
4. Test integration with cart if adding cart-related features

### When Modifying Product API
1. Update `test_api.py` for endpoint changes
2. Update `test_wishlist.py` if product fields change
3. Verify wishlist still receives required product fields

## Resources

- FastAPI Testing: https://fastapi.tiangolo.com/tutorial/testing/
- Pytest Documentation: https://docs.pytest.org/
- localStorage API: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

## Contact

For test failures or questions, check:
1. Test output for specific error messages
2. `CLAUDE.md` for project architecture
3. Relevant source files referenced in test comments
