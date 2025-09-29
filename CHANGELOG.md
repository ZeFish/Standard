# Changelog

All notable changes to Standard will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- **JavaScript filename**: Renamed `standard-typography.js` to `standard.js`
  - Better reflects expanded functionality (typography + theme management)
  - Updated package exports: `./js` instead of `./typography`
  - **Breaking change**: Import path changed for ES modules

### Added
- **Comprehensive system theme detection and management**
  - Automatic system preference detection via `prefers-color-scheme`
  - Real-time system theme change listening with `matchMedia`
  - Three-way theme cycling: light → dark → auto
  - LocalStorage persistence of user preferences
  - Auto mode follows system changes, manual modes override system
- **Enhanced StandardTypography dark mode support**
  - Automatic dark mode detection (`.dark` class, `data-theme`, system preference)
  - Theme change event dispatch (`standard:themechange`)
  - Theme-specific typography adjustments
  - Public API: `getCurrentTheme()`, `isDark()`, `isLight()`, `destroy()`

## [0.1.2] - 2024-12-19

### Fixed
- **Heading overflow issues** - Fixed h1 elements breaking out of layout containers
  - Changed `word-break: keep-all` to `word-break: normal` for proper text wrapping
  - Added `overflow-wrap: break-word` and `hyphens: auto` for better line breaks
  - Changed `overflow: visible` to `overflow: hidden` to prevent layout breaks
  - Added `max-width: 100%` and `box-sizing: border-box` for container constraints
- **Responsive heading scaling** - h1 now starts at `--scale-xxl` on mobile, grows to `--scale-xxxl` on larger screens
- **New utility classes** for heading control:
  - `.heading-safe` - Ensures headings don't overflow containers
  - `.heading-responsive` - Fluid scaling based on viewport width
  - `.heading-contain` - Container query-based responsive headings

## [0.1.1] - 2024-12-19

### Fixed
- **Repository URLs** - Corrected package.json repository links to match GitHub case (ZeFish/Standard)

## [0.1.0] - 2024-12-19

### Added
- **Initial release of Standard framework** - A fine-art typography framework
- **Mathematical precision system** using golden ratio and derivatives
  - `--ratio-golden: 1.618` (φ - Classical proportion)
  - `--ratio-halfstep: 1.272` (√φ - Half-step harmony)
  - `--ratio-quarterstep: 1.128` (⁴√φ - Quarter-step precision)
  - `--ratio-eighthstep: 1.062` (⁸√φ - Fine adjustments)
- **Reading layout system** with flexible content areas
  - `.reading` - Main layout container for sophisticated content layout
  - `.content` - Default content area with optimal reading width
  - `.small` - Narrow area, --space smaller on each side than content
  - `.accent` - Wider area for pullquotes and highlights
  - `.feature` - Even wider for images and featured content
  - `.full` - Full container width for backgrounds and bleeds
- **Vertical rhythm system** based on 1rlh (root line height)
  - Mathematical spacing scale from `--space-xxxs` to `--space-xxxl`
  - All spacing aligned to baseline grid for visual harmony
- **JavaScript typography engine** (`StandardTypography`)
  - Smart quotes conversion: "quotes" → "quotes"
  - Punctuation fixes: -- → em—dash, ... → ellipsis…
  - Widow prevention with non-breaking spaces
  - French typography conventions (thin spaces before punctuation)
  - Orphan prevention for two-letter words
- **Swiss-style 12-column grid system**
  - CSS Grid-based with semantic utility classes
  - Responsive breakpoints with mobile-first approach
  - Gap system tied to vertical rhythm (`--grid-gap: var(--space)`)
- **Perceptual color system** using OKLCH color space
  - Automatic light/dark mode switching
  - Mathematically consistent contrast relationships
  - Semantic color tokens with fallbacks
- **Distributed design token architecture**
  - Domain-specific token organization for better maintainability
  - Mathematical ratios in `standard-00-token.scss`
  - Typography tokens in `standard-03-typography.scss`
  - Color tokens in `standard-05-color.scss`
- **Line-width optimization** for readability
  - Research-based optimal reading widths (42rem ≈ 60-75 characters)
  - Multiple width variants from `--line-width-xs` to `--line-width-xl`
  - Utility classes for easy application
- **Enhanced markdown styling** (`.md` class)
  - Callouts with semantic styling
  - Improved blockquotes and code blocks
  - Typography-aware list styling
- **Print design utilities**
  - `.grid-debug` for baseline grid visualization
  - Flow and stack utilities for consistent spacing
  - Text utilities with print-inspired naming
- **OpenType feature support**
  - Ligatures, kerning, and advanced typography features
  - Font variation settings for modern variable fonts
  - Proper fallback font stacks

### Framework Files
- `standard.scss` - Main entry point
- `standard-00-token.scss` - Mathematical ratios and primitive tokens
- `standard-01-grid.scss` - Swiss-style grid system
- `standard-02-prose.scss` - Book layout system with print terminology
- `standard-03-typography.scss` - Fine-art typography with OpenType features
- `standard-04-rhythm.scss` - Baseline grid and vertical rhythm
- `standard-05-color.scss` - Perceptual color system (OKLCH)
- `standard-06-img.scss` - Gallery system with zoom functionality
- `standard-07-md.scss` - Enhanced markdown styling
- `standard-08-utilities.scss` - Print design utility classes
- `standard.js` - Micro-typography rules engine

### Documentation
- Comprehensive README with fine-art typography principles
- Interactive example page demonstrating all features
- Print design terminology explanations
- Mathematical ratio documentation
- JavaScript API documentation

### Browser Support
- Modern browsers with CSS Grid and Custom Properties support
- ES6+ for JavaScript typography engine
- Graceful degradation for older browsers

---

## Template for Future Releases

## [Unreleased]
### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security

---

*The changelog follows the principles of fine-art typography that guide Standard: precision, clarity, and respect for classical foundations while embracing modern capabilities.*