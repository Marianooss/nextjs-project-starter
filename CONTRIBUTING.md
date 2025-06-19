# Contributing to XYNERA IA

Thank you for your interest in contributing to XYNERA IA! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing Guidelines](#testing-guidelines)
8. [Documentation](#documentation)
9. [Community](#community)

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn
- Git

### Setup Development Environment

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/your-username/xynera-ia.git
cd xynera-ia
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/original/xynera-ia.git
```

4. Install dependencies:
```bash
npm install
```

5. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

1. Keep your fork up to date:
```bash
git fetch upstream
git rebase upstream/main
```

2. Make your changes:
- Write clean, modular code
- Follow the coding standards
- Add/update tests as needed
- Update documentation

3. Test your changes:
```bash
npm run test
npm run lint
```

4. Commit your changes:
```bash
git add .
git commit -m "feat: add new feature"
```

5. Push to your fork:
```bash
git push origin feature/your-feature-name
```

## Coding Standards

### TypeScript Guidelines

```typescript
// Use interfaces for object types
interface User {
  id: string;
  name: string;
  email: string;
}

// Use type for unions/intersections
type Status = 'active' | 'inactive';

// Use meaningful variable names
const userCount = users.length; // Good
const n = users.length; // Bad

// Use async/await over promises
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// Use early returns
function processUser(user: User | null): string {
  if (!user) return 'No user found';
  return user.name;
}
```

### React Guidelines

```typescript
// Use functional components
const UserProfile: React.FC<UserProps> = ({ user }) => {
  return (
    <div>
      <h1>{user.name}</h1>
    </div>
  );
};

// Use hooks for state management
const [user, setUser] = useState<User | null>(null);

// Use custom hooks for reusable logic
function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    fetchUser(id).then(setUser);
  }, [id]);
  
  return user;
}
```

### File Structure

```
src/
├── app/                    # Next.js pages
├── components/            # React components
│   ├── ui/              # UI components
│   └── features/        # Feature components
├── hooks/               # Custom hooks
├── lib/                 # Utilities
├── types/               # TypeScript types
└── styles/              # CSS styles
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Adding or updating tests
- chore: Maintenance tasks

Examples:
```
feat(auth): add user authentication
fix(api): handle null response
docs(readme): update installation instructions
```

## Pull Request Process

1. Create a descriptive PR title following commit guidelines
2. Fill out the PR template
3. Ensure all checks pass
4. Request review from maintainers
5. Address review feedback
6. Maintain PR up to date with main branch

### PR Template

```markdown
## Description
[Describe your changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing performed

## Screenshots
[If applicable]

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Commits follow guidelines
```

## Testing Guidelines

1. Write tests for new features
2. Maintain test coverage above 80%
3. Include unit and integration tests
4. Test edge cases and error scenarios

Example:
```typescript
describe('UserProfile', () => {
  it('renders user information', () => {
    const user = { id: '1', name: 'John' };
    render(<UserProfile user={user} />);
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('handles missing user', () => {
    render(<UserProfile user={null} />);
    expect(screen.getByText('No user found')).toBeInTheDocument();
  });
});
```

## Documentation

1. Update README.md for new features
2. Add JSDoc comments to functions
3. Update API documentation
4. Include usage examples

Example:
```typescript
/**
 * Fetches user data from the API
 * @param {string} id - User ID
 * @returns {Promise<User>} User data
 * @throws {Error} When user not found
 */
async function fetchUser(id: string): Promise<User> {
  // Implementation
}
```

## Community

- Join our [Discord](https://discord.gg/xynera)
- Follow us on [Twitter](https://twitter.com/xyneraai)
- Read our [Blog](https://blog.xynera.ai)
- Subscribe to our [Newsletter](https://xynera.ai/newsletter)

### Getting Help

- Check existing issues and documentation
- Ask in Discord community
- Create a new issue
- Email support@xynera.ai

Thank you for contributing to XYNERA IA! 🚀
