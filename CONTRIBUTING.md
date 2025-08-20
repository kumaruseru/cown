# Contributing to COWN1

We love your input! We want to make contributing to COWN1 as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using GitHub's [issues](https://github.com/kumaruseru/cown/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/kumaruseru/cown/issues/new); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Development Setup

1. Clone the repository
```bash
git clone https://github.com/kumaruseru/cown.git
cd cown
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up databases (see README.md for details)

5. Start development server
```bash
npm run dev
```

## Code Style

* Use 2 spaces for indentation
* Use semicolons
* Use single quotes for strings
* Use meaningful variable names
* Add comments for complex logic
* Follow existing code patterns

## Testing

* Write tests for new features
* Ensure all tests pass before submitting PR
* Include both unit and integration tests where appropriate

## Documentation

* Update README.md if needed
* Document new API endpoints
* Add JSDoc comments for functions
* Update CHANGELOG.md

## Security

If you discover a security vulnerability, please send an e-mail to the maintainers instead of using the issue tracker. All security vulnerabilities will be promptly addressed.

## Feature Requests

We welcome feature requests! Please use GitHub issues to submit them. Include:

- Clear description of the feature
- Use cases and benefits
- Possible implementation approach
- Any related issues or discussions

## Code Review Process

1. All submissions require review before merging
2. We may ask for changes before merging
3. We'll provide feedback constructively
4. Once approved, we'll merge the PR

## Community

* Be respectful and inclusive
* Help others when you can
* Follow our code of conduct
* Ask questions if something is unclear

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open an issue with your question or contact the maintainers directly.

Thank you for contributing to COWN1! 🚀
