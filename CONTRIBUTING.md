# Contributing to YouTube Downloader

Thank you for your interest in contributing to YouTube Downloader! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - System information (OS, Node version, etc.)
   - Screenshots if applicable

### Suggesting Features

1. Check existing feature requests
2. Create an issue describing:
   - The problem you're trying to solve
   - Your proposed solution
   - Alternative solutions considered
   - Additional context

### Pull Requests

1. Fork the repository
2. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes:
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation as needed

4. Test your changes:
   ```bash
   npm run dev
   ```

5. Commit with clear messages:
   ```bash
   git commit -m "Add: feature description"
   ```

6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Open a Pull Request with:
   - Description of changes
   - Related issue numbers
   - Screenshots (if UI changes)
   - Testing performed

## Development Setup

1. Install Node.js 18 or higher
2. Install yt-dlp
3. Clone the repository
4. Run `npm install`
5. Run `npm run dev` to start development mode

## Code Style

- Use meaningful variable and function names
- Keep functions small and focused
- Add JSDoc comments for public APIs
- Use ES6+ features
- Indent with 4 spaces

## Testing

- Test on your platform before submitting
- If possible, test on multiple platforms
- Document any platform-specific behavior

## Building

Before submitting, ensure the app builds:

```bash
npm run build
```

## Commit Message Guidelines

Format: `Type: Description`

Types:
- `Add:` New feature
- `Fix:` Bug fix
- `Update:` Improvement to existing feature
- `Refactor:` Code restructuring
- `Docs:` Documentation changes
- `Style:` Formatting changes
- `Test:` Adding tests
- `Build:` Build system changes

Examples:
- `Add: support for playlist downloads`
- `Fix: incorrect file size display`
- `Update: improve error messages`

## Release Process

Maintainers will:
1. Review and merge PRs
2. Update version in package.json
3. Create release tag
4. GitHub Actions builds and publishes

## Questions?

Feel free to open an issue for questions or join discussions!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
