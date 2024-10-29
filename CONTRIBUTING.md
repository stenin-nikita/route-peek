# Contributing Guide

Hi! We're really excited that you're interested in contributing to Route Peek!

When it comes to open source, there are many different kinds of contributions that can be made, all of which are valuable. Here are a few guidelines that should help you as you prepare your contribution.

## Setup

Before you can contribute to the codebase, you will need to fork the repo. The following steps will get you set up to contribute changes to this repo:

1. Fork the repo (click the <kbd>Fork</kbd> button at the top right of [this page](https://github.com/stenin-nikita/route-peek))
2. Clone your fork locally

```shell
git clone https://github.com/<your_github_username>/route-peek.git
cd route-peek
```

3. Install dependencies using npm:

```shell
npm ci
```

## Working with Code

1. Create a new branch

```shell
git checkout -b issue1234
```

2. Make your changes

```shell
git add -A
git commit
```

Commit messages should follow the [Conventional Commits](https://conventionalcommits.org) specification:

```
tag: Short description of what you did

Longer description here if necessary

Fixes #1234
```

The `tag` is one of the following:

- `fix` - for a bug fix
- `feat` - for a backwards-compatible enhancement
- `fix!` - for a backwards-incompatible bug fix
- `feat!` - for a backwards-incompatible enhancement or feature
- `docs` - changes to documentation only
- `chore` - for changes that aren’t user-facing
- `build` - changes to build process only
- `refactor` - a change that doesn’t affect APIs or user experience
- `test` - just changes to test files
- `ci` - changes to our CI configuration files and scripts
- `perf` - a code change that improves performance

3. Rebase onto upstream

```shell
git fetch upstream
git rebase upstream/main
```

4. Run the tests

```shell
npm test
```

5. Push your changes

```shell
git push origin issue1234
```

6. Send the pull request

Now you’re ready to send the pull request. Go to your Route Peek fork and then follow the GitHub documentation on how to send a pull request.
