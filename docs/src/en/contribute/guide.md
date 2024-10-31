# Contributing Guide

Hello! We're delighted that you want to contribute to the Route Peek project. Participation in open-source projects can take many forms, and every contribution is important. In this guide, you'll find steps and recommendations to help you prepare for making changes.

## Getting started

To begin working with the repository, follow these steps:

1. **Fork the repository**

First of all, you need to fork the repository. To do this, click the <kbd>Fork</kbd> button in the upper right corner of the [repository page](https://github.com/stenin-nikita/route-peek). This will create a copy of the project in your GitHub account.

2. **Clone your fork**

Clone your fork to your local machine to start working with the code:

```sh
git clone https://github.com/[your_username]/route-peek.git
cd route-peek
```

3. **Set up upstream**

Add the original repository as a remote under the name upstream to be able to receive the latest changes:

```sh
git remote add upstream https://github.com/stenin-nikita/route-peek.git
```

4. **Install dependencies**

Make sure you have all the necessary dependencies for the project installed using npm:

```sh
npm ci
```

## Working with code

Now that you've set up your development environment, follow these steps to make changes:

1. **Create a new branch**

Always create a separate branch for each distinct change or fix:

```sh
git checkout -b issue1234
```

2. **Make changes**

Make the necessary changes to the code. After that, prepare them for commit:

```sh
git add -A
git commit
```

Ensure that your commit message follows the [Conventional Commits](https://conventionalcommits.org) specification:

```
tag: Brief description of changes

Detailed description, if necessary

Fixes #1234
```

Use one of the following tags:

- `fix` - a bug fix
- `feat` - the addition of new (compatible) functionality
- `fix!` - incompatible bug fix
- `feat!` - incompatible new functionality
- `docs` - documentation changes
- `chore` - changes that do not affect the functionality
- `build` - changes in the build process
- `refactor` - refactoring that does not affect the functionality
- `test` - changes in tests
- `ci` - changes in the CI/CD configuration
- `perf` - performance improvements

3. **Sync with the main branch**

Before submitting changes, ensure that your information is up to date:

```sh
git fetch upstream
git rebase upstream/main
```

4. **Run tests**

Ensure that your changes do not break project functionality:

```sh
npm test
```

5. **Push changes**

Push your changes to the branch of your fork on GitHub:

```sh
git push origin issue1234
```

6. **Create a pull request**

Go to your fork on GitHub and create a pull request. Refer to the [GitHub documentation on creating a pull request](https://docs.github.com/en/pull-requests) for detailed instructions.

---

We hope this guide helps you easily and successfully contribute to the development of Route Peek. Thank you for your participation and support!
