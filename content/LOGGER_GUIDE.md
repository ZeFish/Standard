/**
 * STANDARD FRAMEWORK - Logger Documentation
 * 
 * The Standard Framework provides a beautiful, branded logger that's available
 * to any project using Standard as a plugin.
 * 
 * The logger provides consistent, colored output with scopes and verbosity control.
 */

// ============================================================================
// QUICK START - Using the Logger
// ============================================================================

/**
 * 1. Import the logger in your JavaScript/TypeScript files:
 * 
 * import { createLogger } from "@zefish/standard/logger";
 * 
 * const logger = createLogger({ 
 *   scope: "MyComponent",
 *   verbose: true 
 * });
 * 
 * logger.info("Processing started");
 * logger.success("Operation completed");
 * logger.warn("This might be a problem");
 * logger.error("Something went wrong");
 * logger.debug("Detailed debug info"); // Only shows if verbose: true
 * logger.banner("1.0.0", "https://example.com");
 */

// ============================================================================
// USAGE IN ASTRO COMPONENTS
// ============================================================================

/**
 * 2. In Astro components (.astro files), use it in the frontmatter:
 * 
 * ---
 * import { createLogger } from "@zefish/standard/logger";
 * 
 * const logger = createLogger({ scope: "MyLayout" });
 * 
 * logger.info("Layout mounted");
 * 
 * interface Props {
 *   title: string;
 * }
 * 
 * const { title } = Astro.props;
 * ---
 * 
 * <h1>{title}</h1>
 */

// ============================================================================
// USAGE IN REMARK PLUGINS
// ============================================================================

/**
 * 3. In remark plugins, import and create a logger at module level:
 * 
 * import { createLogger } from "@zefish/standard/logger";
 * 
 * const logger = createLogger({ scope: "MyPlugin" });
 * 
 * export default function remarkMyPlugin(options = {}) {
 *   const { verbose = false } = options;
 *   
 *   logger.debug("Plugin initialized");
 *   
 *   return function transformer(tree, file) {
 *     logger.info(`Processing: ${file.path}`);
 *     
 *     if (verbose) {
 *       logger.debug("Verbose mode enabled");
 *     }
 *   };
 * }
 */

// ============================================================================
// API REFERENCE
// ============================================================================

/**
 * createLogger(options)
 * 
 * Creates a logger instance with the given options.
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.scope - Optional scope/namespace for log messages
 * @param {boolean} options.verbose - Enable debug logging (default: false)
 * 
 * @returns {Object} Logger instance with the following methods:
 * 
 * Methods:
 * --------
 * 
 * logger.info(...args)
 *   Logs informational messages with a blue ℹ icon
 *   Usage: logger.info("Processing started");
 * 
 * logger.success(...args)
 *   Logs success messages with a green ✓ icon
 *   Usage: logger.success("Build completed");
 * 
 * logger.warn(...args)
 *   Logs warning messages with a yellow ⚠ icon
 *   Usage: logger.warn("Missing configuration");
 * 
 * logger.error(...args)
 *   Logs error messages with a red ✖ icon
 *   Usage: logger.error("Failed to parse", error);
 * 
 * logger.debug(...args)
 *   Logs debug messages with a magenta ⊙ icon
 *   Only shows if verbose: true
 *   Usage: logger.debug("Detailed info:", data);
 * 
 * logger.banner(version, url)
 *   Logs a branded banner with version info
 *   Usage: logger.banner("1.0.0", "https://example.com");
 */

// ============================================================================
// OUTPUT EXAMPLES
// ============================================================================

/**
 * Output examples with scopes:
 * 
 * Stdn::GD [Backlinks] ✓ Entry registered: "getting-started"
 * Stdn::GD [Frontmatter Defaults] ⚠ Missing title, using filename
 * Stdn::GD [Fix Dates] ℹ Processing date fields
 * Stdn::GD [Core] ✓ v0.18.17 :: https://standard.ffp.co
 * 
 * The format is:
 * - "Stdn::GD" = Standard Framework branding (orange ::)
 * - "[Scope]" = Optional scope/namespace (blue)
 * - Icon = Message type (✓, ⚠, ℹ, ✖, ⊙)
 * - Message = Your log message
 */

// ============================================================================
// BEST PRACTICES
// ============================================================================

/**
 * 1. Always provide a scope:
 *    ✓ const logger = createLogger({ scope: "MyPlugin" });
 *    ✗ const logger = createLogger();
 * 
 * 2. Use appropriate log levels:
 *    - info() for general information
 *    - success() for completed operations
 *    - warn() for potential issues
 *    - error() for failures
 *    - debug() for detailed troubleshooting (verbose only)
 * 
 * 3. Keep messages concise:
 *    ✓ logger.info("Processing markdown files");
 *    ✗ logger.info("The system is now going to process all of the markdown files that were found in the content directory");
 * 
 * 4. Use debug() for verbose output:
 *    logger.debug("Raw data:", complexObject); // Only in verbose mode
 * 
 * 5. Create logger at module level for plugins:
 *    // Good - reused across all transformer calls
 *    const logger = createLogger({ scope: "MyPlugin" });
 *    export default function remarkMyPlugin() {
 *      return (tree, file) => { logger.info(...); };
 *    }
 * 
 *    // Avoid - creates new logger for each file
 *    export default function remarkMyPlugin() {
 *      return (tree, file) => {
 *        const logger = createLogger({ scope: "MyPlugin" });
 *        logger.info(...);
 *      };
 *    }
 */

// ============================================================================
// COLORS AND STYLING
// ============================================================================

/**
 * The logger uses ANSI color codes for terminal output:
 * 
 * - Blue (ℹ) = Information
 * - Green (✓) = Success
 * - Yellow (⚠) = Warning
 * - Red (✖) = Error
 * - Magenta (⊙) = Debug
 * - Orange (::) = Standard Framework branding
 * 
 * These colors work in:
 * - Terminal/console
 * - npm output
 * - GitHub Actions logs
 * - Most modern terminals
 * 
 * The logger automatically falls back to 16-color ANSI for compatibility,
 * and uses 24-bit truecolor (RGB) for extended colors when available.
 */

// ============================================================================
// EXPORT SUMMARY
// ============================================================================

/**
 * Available exports from @zefish/standard/logger:
 * 
 * - createLogger(options)
 *   → Factory function to create logger instances
 *   → Recommended for use throughout your project
 * 
 * Example:
 * 
 * import { createLogger } from "@zefish/standard/logger";
 * 
 * const logger = createLogger({ 
 *   scope: "MyFeature",
 *   verbose: process.env.DEBUG === "true"
 * });
 */
