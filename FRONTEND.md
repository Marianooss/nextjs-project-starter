# XYNERA IA Frontend Development Guide

## Component Architecture

### Module Layout
Each module follows a consistent layout pattern using the `ModuleLayout` component:
```tsx
// src/components/module-layout.tsx
export default function ModuleLayout({ children }) {
  return (
    <div className="flex-1 space-y-4 p-8">
      {children}
    </div>
  )
}
```

### Page Structure
Each module page follows this structure:
```tsx
"use client"

import { ModuleLayout } from "@/components/module-layout"
import { Card, Tabs, Button } from "@/components/ui"
import { useModuleHook } from "@/hooks/use-module"

export default function ModulePage() {
  // State and hooks
  const { data, loading, error } = useModuleHook()

  // Loading and error states
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ModuleLayout>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Module Title</h2>
        <Actions />
      </div>

      {/* Content */}
      <Tabs>
        <Overview />
        <Details />
        <Analytics />
      </Tabs>
    </ModuleLayout>
  )
}
```

## Custom Hooks

### API Client Hook Pattern
```typescript
"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"

export function useModuleHook() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchData() {
    try {
      setLoading(true)
      const response = await apiClient.get("endpoint")
      setData(response)
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, refreshData: fetchData }
}
```

## UI Components

### Cards
Used for displaying metrics and content blocks:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">{value}</div>
    <p className="text-xs text-muted-foreground">{description}</p>
  </CardContent>
</Card>
```

### Tabs
Used for organizing content:
```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    <Overview />
  </TabsContent>
  <TabsContent value="details">
    <Details />
  </TabsContent>
</Tabs>
```

### Dialogs
Used for forms and confirmations:
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    <Form />
  </DialogContent>
</Dialog>
```

## State Management

### Data Fetching Pattern
```typescript
// 1. Define interface
interface ModuleData {
  metric1: number
  metric2: string
  items: Item[]
}

// 2. Create hook
function useModuleData() {
  const [data, setData] = useState<ModuleData | null>(null)
  // ... implementation
}

// 3. Use in component
function ModuleComponent() {
  const { data } = useModuleData()
  return <div>{data?.metric1}</div>
}
```

### Form Handling Pattern
```typescript
function FormComponent() {
  const [formData, setFormData] = useState({})
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiClient.post("endpoint", formData)
      // Handle success
    } catch (error) {
      // Handle error
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

## Styling Guidelines

### Tailwind CSS Classes
Common patterns:
```tsx
// Layout
"flex flex-col space-y-4"
"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
"flex items-center justify-between"

// Typography
"text-3xl font-bold tracking-tight"
"text-sm text-muted-foreground"

// Cards
"rounded-lg border bg-card text-card-foreground shadow-sm"

// Spacing
"p-4 md:p-6 lg:p-8"
"space-y-2 space-x-4"
```

### Responsive Design
```tsx
// Mobile-first approach
<div className="
  grid
  grid-cols-1          // Mobile: 1 column
  md:grid-cols-2       // Tablet: 2 columns
  lg:grid-cols-4       // Desktop: 4 columns
  gap-4
">
```

## Error Handling

### API Error Pattern
```typescript
try {
  await apiAction()
} catch (error) {
  if (error instanceof ApiError) {
    // Handle specific API errors
    switch (error.status) {
      case 401:
        // Handle unauthorized
        break
      case 404:
        // Handle not found
        break
      default:
        // Handle other errors
    }
  } else {
    // Handle unexpected errors
  }
}
```

### Loading States
```tsx
function Component() {
  const { data, loading, error } = useData()

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  return <Content data={data} />
}
```

## Performance Optimization

### Memoization Pattern
```typescript
// Memoize expensive calculations
const memoizedValue = useMemo(() => {
  return expensiveCalculation(data)
}, [data])

// Memoize callbacks
const memoizedCallback = useCallback(() => {
  handleAction(data)
}, [data])

// Memoize components
const MemoizedComponent = memo(Component)
```

### Data Fetching Optimization
```typescript
// Use SWR for caching and revalidation
const { data, error } = useSWR("/api/data", fetcher)

// Implement pagination
const { data, fetchMore } = useInfiniteScroll("/api/items")
```

## Testing

### Component Testing Pattern
```typescript
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

describe("Component", () => {
  it("renders correctly", () => {
    render(<Component />)
    expect(screen.getByText("Title")).toBeInTheDocument()
  })

  it("handles user interaction", async () => {
    render(<Component />)
    await userEvent.click(screen.getByRole("button"))
    expect(screen.getByText("Result")).toBeInTheDocument()
  })
})
```

## Accessibility

### ARIA Attributes Pattern
```tsx
<button
  aria-label="Action description"
  aria-expanded={isOpen}
  aria-controls="panel-id"
>
  Action
</button>

<div
  id="panel-id"
  role="region"
  aria-labelledby="heading-id"
>
  Content
</div>
```

## Best Practices

1. Use TypeScript for type safety
2. Follow the component architecture pattern
3. Implement proper error handling
4. Optimize performance with memoization
5. Write comprehensive tests
6. Ensure accessibility compliance
7. Use consistent styling patterns
8. Document component APIs
9. Follow Git workflow guidelines
10. Review code before deployment

For more information, refer to the [API Documentation](./API.md) and [README](./README.md).
