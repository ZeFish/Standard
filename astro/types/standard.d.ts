/**
 * Type definitions for Standard Framework
 * This file provides TypeScript types for the virtual:standard/config module
 */

/// <reference types="astro/client" />

// ========================================
// CORE CONFIGURATION TYPES
// ========================================

export interface SiteConfig {
  title?: string;
  description?: string;
  url?: string;
  language?: string;
  author?: {
    name?: string;
    email?: string;
  };
}

export interface TagsConfig {
  enabled?: boolean;
  delimiter?: string;
}

export interface EscapeCodeConfig {
  languages?: string[];
}

export interface DateFieldsConfig {
  fields?: string[];
  format?: string;
}

export interface SyntaxConfig {
  theme?: string;
  highlightLines?: boolean;
}

export interface TypographyConfig {
  smartQuotes?: boolean;
  fractions?: boolean;
  widowPrevention?: boolean;
}

export interface HtmlConfig {
  lazyLoad?: boolean;
  externalLinks?: boolean;
}

export interface CloudflareConfig {
  enabled?: boolean;
  accountId?: string;
  apiToken?: string;
}

export interface OpenrouterConfig {
  enabled?: boolean;
  apiKey?: string;
  model?: string;
  siteUrl?: string;
}

export interface BuildConfig {
  outputDir?: string;
  assetsDir?: string;
}

export interface StandardConfig {
  site?: SiteConfig;
  tags?: TagsConfig;
  escapeCode?: EscapeCodeConfig;
  dateFields?: DateFieldsConfig;
  syntax?: SyntaxConfig;
  typography?: TypographyConfig;
  html?: HtmlConfig;
  cloudflare?: CloudflareConfig;
  openrouter?: OpenrouterConfig;
  build?: BuildConfig;
}

export interface StandardFrameworkConfig extends StandardConfig {
  version?: string;
  verbose?: boolean;
  backlinks?: boolean | object;
  injectRoutes?: boolean;
  assets?: {
    css?: string;
    js?: string;
  };
  title?: string;
  description?: string;
  language?: string;
  author?: {
    name?: string;
    email?: string;
  };
  nav?: {
    header?: any[];
  };
  lab?: boolean;
  site?: SiteConfig;
  [key: string]: any; // Allow additional properties from config
}

// Re-export with more descriptive names for easier importing
export type SiteConfigType = SiteConfig;
export type StandardConfigType = StandardConfig;
export type FrameworkConfigType = StandardFrameworkConfig;
export type BuildConfigType = BuildConfig;
export type TypographyConfigType = TypographyConfig;
export type CloudflareConfigType = CloudflareConfig;
export type OpenrouterConfigType = OpenrouterConfig;

// ========================================
// HELPER TYPES
// ========================================

export interface StandardComponentProps {
  class?: string;
  [key: string]: any;
}

export interface NavigationItem {
  text: string;
  href: string;
  icon?: string;
  external?: boolean;
  children?: NavigationItem[];
}

export interface SocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
  email?: string;
  [key: string]: string | undefined;
}

export interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: string;
}

export interface WebFont {
  family: string;
  weights: number[];
  style?: string;
}

// ========================================
// GLOBAL WINDOW INTERFACE
// ========================================

declare global {
  interface Window {
    Standard?: {
      init: (options?: any) => void;
      process: (selector?: string) => Promise<void>;
      updateOptions: (options: any) => void;
      enableSmartQuotes: (enabled: boolean) => void;
      enablePunctuation: (enabled: boolean) => void;
      enableWidowPrevention: (enabled: boolean) => void;
      enableFractions: (enabled: boolean) => void;
      enableArrowsAndSymbols: (enabled: boolean) => void;
      enableNumberFormatting: (enabled: boolean) => void;
      enableSpacing: (enabled: boolean) => void;
    };
  }

  var __STANDARD_CONFIG__: any;
}

// ========================================
// VIRTUAL MODULES
// ========================================

/**
 * Virtual module for accessing Standard Framework configuration
 * This module is generated at build time by the Vite plugin
 */
declare module "virtual:standard/config" {
  const config: StandardFrameworkConfig;
  export default config;
}
