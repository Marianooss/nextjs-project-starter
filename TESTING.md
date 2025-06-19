# XYNERA IA Testing Guide

## Testing Stack

- Jest: Testing framework
- React Testing Library: Component testing
- Cypress: End-to-end testing
- MSW (Mock Service Worker): API mocking
- Playwright: Cross-browser testing

## Unit Testing

### Component Testing Pattern

```typescript
// src/__tests__/components/QueryOptimization.test.tsx
import { render, screen, fireEvent } from "@testing-library/react"
import { QueryOptimization } from "@/app/query-optimization/page"
import { useQueryOptimization } from "@/hooks/use-query-optimization"

// Mock the custom hook
jest.mock("@/hooks/use-query-optimization")

describe("QueryOptimization", () => {
  const mockData = {
    performance: 400,
    costReduction: 60,
    queriesOptimized: 1234,
    activeOptimizations: 24,
    recentOptimizations: []
  }

  beforeEach(() => {
    (useQueryOptimization as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null
    })
  })

  it("renders metrics correctly", () => {
    render(<QueryOptimization />)
    expect(screen.getByText("400%")).toBeInTheDocument()
    expect(screen.getByText("60%")).toBeInTheDocument()
  })

  it("handles loading state", () => {
    (useQueryOptimization as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      error: null
    })
    render(<QueryOptimization />)
    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("handles error state", () => {
    (useQueryOptimization as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: new Error("Test error")
    })
    render(<QueryOptimization />)
    expect(screen.getByText("Error: Test error")).toBeInTheDocument()
  })
})
```

### Hook Testing Pattern

```typescript
// src/__tests__/hooks/useQueryOptimization.test.ts
import { renderHook, act } from "@testing-library/react-hooks"
import { useQueryOptimization } from "@/hooks/use-query-optimization"
import { apiClient } from "@/lib/api-client"

jest.mock("@/lib/api-client")

describe("useQueryOptimization", () => {
  const mockData = {
    performance: 400,
    costReduction: 60
  }

  beforeEach(() => {
    (apiClient.get as jest.Mock).mockResolvedValue(mockData)
  })

  it("fetches data successfully", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useQueryOptimization())

    expect(result.current.loading).toBe(true)
    await waitForNextUpdate()

    expect(result.current.data).toEqual(mockData)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it("handles error", async () => {
    const error = new Error("API Error")
    (apiClient.get as jest.Mock).mockRejectedValue(error)

    const { result, waitForNextUpdate } = renderHook(() => useQueryOptimization())
    await waitForNextUpdate()

    expect(result.current.error).toBe(error)
    expect(result.current.loading).toBe(false)
  })
})
```

## Integration Testing

### API Route Testing

```typescript
// src/__tests__/api/query-optimization.test.ts
import { createMocks } from "node-mocks-http"
import { GET, POST } from "@/app/api/query-optimization/route"

describe("Query Optimization API", () => {
  it("GET returns optimization data", async () => {
    const { req, res } = createMocks({
      method: "GET"
    })

    await GET(req, res)

    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data).toHaveProperty("performance")
  })

  it("POST optimizes query", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        query: "SELECT * FROM users"
      }
    })

    await POST(req, res)

    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data).toHaveProperty("message")
  })
})
```

## End-to-End Testing

### Cypress Tests

```typescript
// cypress/e2e/query-optimization.cy.ts
describe("Query Optimization", () => {
  beforeEach(() => {
    cy.visit("/query-optimization")
  })

  it("displays metrics dashboard", () => {
    cy.get("[data-testid=performance-metric]")
      .should("be.visible")
      .and("contain", "400%")

    cy.get("[data-testid=cost-reduction-metric]")
      .should("be.visible")
      .and("contain", "60%")
  })

  it("optimizes query", () => {
    cy.get("[data-testid=query-input]")
      .type("SELECT * FROM users")

    cy.get("[data-testid=optimize-button]")
      .click()

    cy.get("[data-testid=optimization-result]")
      .should("be.visible")
  })
})
```

### Playwright Tests

```typescript
// tests/query-optimization.spec.ts
import { test, expect } from "@playwright/test"

test.describe("Query Optimization", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/query-optimization")
  })

  test("displays metrics correctly", async ({ page }) => {
    await expect(page.locator("[data-testid=performance-metric]"))
      .toContainText("400%")
  })

  test("handles form submission", async ({ page }) => {
    await page.fill("[data-testid=query-input]", "SELECT * FROM users")
    await page.click("[data-testid=optimize-button]")
    await expect(page.locator("[data-testid=success-message]"))
      .toBeVisible()
  })
})
```

## API Mocking

### MSW Setup

```typescript
// src/mocks/handlers.ts
import { rest } from "msw"

export const handlers = [
  rest.get("/api/query-optimization", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        performance: 400,
        costReduction: 60,
        queriesOptimized: 1234,
        activeOptimizations: 24
      })
    )
  }),

  rest.post("/api/query-optimization", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: "Query optimized successfully"
      })
    )
  })
]
```

### MSW Browser Setup

```typescript
// src/mocks/browser.ts
import { setupWorker } from "msw"
import { handlers } from "./handlers"

export const worker = setupWorker(...handlers)
```

## Performance Testing

### Lighthouse CI Configuration

```yaml
# lighthouserc.js
module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start",
      url: ["http://localhost:8000/query-optimization"]
    },
    assert: {
      assertions: {
        "first-contentful-paint": ["warn", { maxNumericValue: 2000 }],
        "interactive": ["error", { maxNumericValue: 3000 }],
        "performance-budget": ["error", { resourceSizes: [{ resourceType: "script", budget: 300 }] }]
      }
    },
    upload: {
      target: "temporary-public-storage"
    }
  }
}
```

## Test Coverage

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/mocks/**"
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

## Best Practices

1. Write tests before implementing features (TDD)
2. Keep tests focused and isolated
3. Use meaningful test descriptions
4. Mock external dependencies
5. Test error scenarios
6. Maintain high test coverage
7. Run tests before committing
8. Use continuous integration
9. Review test results regularly
10. Update tests when requirements change

## Test Scripts

Add these scripts to package.json:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress run",
    "test:e2e:dev": "cypress open",
    "test:playwright": "playwright test",
    "test:lighthouse": "lhci autorun"
  }
}
```

For more information, refer to:
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io)
- [Playwright Documentation](https://playwright.dev/docs/intro)
