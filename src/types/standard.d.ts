/**
 * Type definitions for Standard Framework
 * This file provides TypeScript types for the virtual:standard/config module
 */

/// <reference types="astro/client" />

// Re-export types from the main types file
export type {
  SiteConfig,
  StandardConfig,
  StandardFrameworkConfig,
  BuildConfig,
  TagsConfig,
  EscapeCodeConfig,
  DateFieldsConfig,
  SyntaxConfig,
  TypographyConfig,
  HtmlConfig,
  CloudflareConfig,
  OpenrouterConfig
} from "../../.astro/types";

// Re-export with more descriptive names for easier importing
export type SiteConfigType = SiteConfig;
export type StandardConfigType = StandardConfig;
export type FrameworkConfigType = StandardFrameworkConfig;
export type BuildConfigType = BuildConfig;
export type TypographyConfigType = TypographyConfig;
export type CloudflareConfigType = CloudflareConfig;
export type OpenrouterConfigType = OpenrouterConfig;

// Helper type for component props
export interface StandardComponentProps {
  class?: string;
  [key: string]: any;
}

// Helper type for navigation items
export interface NavigationItem {
  text: string;
  href: string;
  icon?: string;
  external?: boolean;
  children?: NavigationItem[];
}

// Helper type for social links
export interface SocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
  email?: string;
  [key: string]: string | undefined;
}

// Helper type for manifest icons
export interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: string;
}

// Helper type for web fonts
export interface WebFont {
  family: string;
  weights: number[];
  style?: string;
}

// Global window interface extension
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
}
