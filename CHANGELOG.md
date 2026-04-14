# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-04-14

### Changed
- Renamed package to `azure-kusto-trender-v2`
- Release pipeline changed to dispatch with CHANGELOG-based workflow

### Fixed
- Fixed marker crash when a curve has no data points in the selected interval
- Updated Node.js version in CI

### Added
- New manual-dispatch publish workflow (`.github/workflows/publish.yaml`)
- Playwright test infrastructure

## [1.0.1-Beta] - 2025-01-01

### Changed
- Updated Node.js version
- Updated dependency libraries
- Added Playwright tests for all test cases

### Fixed
- Package distribution fixes
- NPM packaging directory fixes
- Line chart options fixes
