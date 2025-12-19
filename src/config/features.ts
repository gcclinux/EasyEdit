/**
 * Feature flags configuration
 * 
 * This file controls which features are enabled or disabled in the application.
 * Set a feature to `true` to enable it, or `false` to disable it.
 */

export const FEATURES = {
  // EasyNotes cloud integration feature
  // Set to true when ready to release to users
  EASY_NOTES: false,
  
  // Add other feature flags here as needed
  // EXAMPLE_FEATURE: true,
} as const;

// Type for feature flag keys
export type FeatureFlag = keyof typeof FEATURES;

/**
 * Check if a feature is enabled
 * @param feature - The feature flag to check
 * @returns true if the feature is enabled, false otherwise
 */
export const isFeatureEnabled = (feature: FeatureFlag): boolean => {
  return FEATURES[feature];
};