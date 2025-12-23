/**
 * Feature flags configuration
 * 
 * This file controls which features are enabled or disabled in the application.
 * Set a feature to `true` to enable it, or `false` to disable it.
 */

import LicenseManager from '../premium/LicenseManager';

export const FEATURES = {
  // EasyNotes cloud integration feature
  // This feature is controlled by the license status.
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
  // If the feature is the EasyNotes feature, check for an active license.
  if (feature === 'EASY_NOTES') {
    return LicenseManager.hasActiveLicense();
  }
  return FEATURES[feature];
};
