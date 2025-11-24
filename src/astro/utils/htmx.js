/**
 * HTMX Utility Functions
 * Provides HTMX enhancement attributes for progressive web app functionality
 * Replaces the 11ty htmx shortcode with flexible utility functions
 */

/**
 * Default HTMX configuration
 * Provides progressive enhancement with AJAX, preload, and smooth scrolling
 */
const DEFAULT_HX_CONFIG = {
  boost: true,
  ext: "preload",
  preload: "mouseover",
  target: "body",
  swap: "innerHTML scroll:window:top"
};

/**
 * Get HTMX attributes as an object
 * Use this when you need to spread attributes onto an element
 *
 * @param {Object} options - Custom HTMX configuration
 * @param {boolean} options.boost - Enable hx-boost for automatic AJAX enhancement
 * @param {string} options.ext - HTMX extensions to use
 * @param {string} options.preload - Preload strategy
 * @param {string} options.target - Default target for hx-get/post requests
 * @param {string} options.swap - Default swap strategy
 * @returns {Object} HTMX attributes object
 *
 * @example
 * // In Astro component
 * <a {...getHtmxAttributes()}>Link</a>
 * <a {...getHtmxAttributes({ target: "#main" })}>Custom Target</a>
 */
export function getHtmxAttributes(options = {}) {
  const config = { ...DEFAULT_HX_CONFIG, ...options };

  const attributes = {};

  if (config.boost) {
    attributes['hx-boost'] = 'true';
  }

  if (config.ext) {
    attributes['hx-ext'] = config.ext;
  }

  if (config.preload) {
    attributes.preload = config.preload;
  }

  if (config.target) {
    attributes['hx-target'] = config.target;
  }

  if (config.swap) {
    attributes['hx-swap'] = config.swap;
  }

  return attributes;
}

/**
 * Get HTMX attributes as a string
 * Use this when you need to add attributes as a string (e.g., in set:html)
 *
 * @param {Object} options - Custom HTMX configuration
 * @returns {string} HTMX attributes as space-separated string
 *
 * @example
 * // In Astro component
 * <div set:html={getHtmxAttributesString()}>Content</div>
 */
export function getHtmxAttributesString(options = {}) {
  const attributes = getHtmxAttributes(options);

  return Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
}

/**
 * Get individual HTMX attribute
 * Get a specific HTMX attribute value
 *
 * @param {string} name - Attribute name (e.g., 'boost', 'target', 'swap')
 * @param {Object} options - Custom HTMX configuration
 * @returns {string|boolean|null} Attribute value
 *
 * @example
 * // Get specific attribute
 * const boostValue = getHtmxAttribute('boost');
 * const targetValue = getHtmxAttribute('target', { target: '#custom' });
 */
export function getHtmxAttribute(name, options = {}) {
  const config = { ...DEFAULT_HX_CONFIG, ...options };

  switch (name) {
    case 'boost':
      return config.boost ? 'true' : null;
    case 'ext':
      return config.ext || null;
    case 'preload':
      return config.preload || null;
    case 'target':
      return config.target || null;
    case 'swap':
      return config.swap || null;
    default:
      return null;
  }
}

/**
 * Create HTMX-enhanced link attributes
 * Convenience function for creating link-specific HTMX attributes
 *
 * @param {Object} options - Custom configuration
 * @param {string} options.url - URL for hx-get (if different from href)
 * @param {string} options.target - Custom target for this link
 * @param {string} options.swap - Custom swap strategy
 * @param {string} options.confirm - Confirmation message before request
 * @returns {Object} Combined href and HTMX attributes
 *
 * @example
 * // Create enhanced link
 * const linkAttrs = createHtmxLink({
 *   url: '/api/data',
 *   target: '#results',
 *   confirm: 'Load new content?'
 * });
 * <a href="/api/data" {...linkAttrs}>Load Data</a>
 */
export function createHtmxLink(options = {}) {
  const {
    url,
    target,
    swap,
    confirm,
    ...htmxOptions
  } = options;

  const attributes = getHtmxAttributes(htmxOptions);

  // Add link-specific attributes
  if (url) {
    attributes['hx-get'] = url;
  }

  if (target) {
    attributes['hx-target'] = target;
  }

  if (swap) {
    attributes['hx-swap'] = swap;
  }

  if (confirm) {
    attributes['hx-confirm'] = confirm;
  }

  return attributes;
}

/**
 * Create HTMX-enhanced form attributes
 * Convenience function for creating form-specific HTMX attributes
 *
 * @param {Object} options - Custom configuration
 * @param {string} options.action - Form action URL
 * @param {string} options.method - HTTP method (default: 'post')
 * @param {string} options.target - Target element for response
 * @param {string} options.swap - Swap strategy
 * @param {boolean} options.encoding - Use hx-encoding for file uploads
 * @returns {Object} Combined form and HTMX attributes
 *
 * @example
 * // Create enhanced form
 * const formAttrs = createHtmxForm({
 *   action: '/api/submit',
 *   target: '#result',
 *   encoding: true
 * });
 * <form action="/api/submit" method="post" {...formAttrs}>...</form>
 */
export function createHtmxForm(options = {}) {
  const {
    action,
    method = 'post',
    target,
    swap,
    encoding = false,
    ...htmxOptions
  } = options;

  const attributes = getHtmxAttributes(htmxOptions);

  // Add form-specific attributes
  if (action) {
    attributes['hx-post'] = action;
  }

  if (method && method !== 'post') {
    attributes['hx-method'] = method;
  }

  if (target) {
    attributes['hx-target'] = target;
  }

  if (swap) {
    attributes['hx-swap'] = swap;
  }

  if (encoding) {
    attributes['hx-encoding'] = 'multipart/form-data';
  }

  return attributes;
}

/**
 * Default export with all utilities
 * Provides backward compatibility with the original shortcode
 */
export default {
  getHtmxAttributes,
  getHtmxAttributesString,
  getHtmxAttribute,
  createHtmxLink,
  createHtmxForm,

  // Backward compatibility - returns the same string as the original shortcode
  getDefaultAttributes: () => getHtmxAttributesString()
};
