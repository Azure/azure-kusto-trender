# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2-beta]

### Added
- Tag-push triggered release pipeline (`.github/workflows/release.yml`)
- Playwright test infrastructure for all test cases

### Changed
- Replaced `rollup-plugin-typescript2` with `@rollup/plugin-typescript` for Rollup 4 compatibility
- Updated sass-loader to use modern compiler API
- Updated Node.js version in CI to 18.x
- Separated build and release pipelines

### Fixed
- Fixed marker crash when adding marker to a curve with no data points
- Fixed Rollup build failure caused by incompatible TypeScript plugin
- Suppressed sass deprecation warning overlay in dev server
- CVE fixes for vulnerable dependencies

## [1.0.1-beta]

### Changed
- Updated Node.js version
- Updated dependency libraries
- Added Playwright tests for all test cases

### Fixed
- Package distribution fixes
- NPM packaging directory fixes
- Line chart options fixes
