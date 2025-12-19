/**
 * Dependency verification for OAuth implementation
 * Ensures all required dependencies are available
 * Only runs in Node.js/Tauri environment, not in browser
 */

// Only check dependencies in Node.js environment (Tauri backend)
if (typeof window === 'undefined' && typeof require !== 'undefined') {
  // Check HTTP server capabilities
  try {
    // Node.js built-in http module (available in Tauri)
    const http = require('http');
    console.log('✓ HTTP server support available');
  } catch (error) {
    console.error('✗ HTTP server support not available:', error);
  }

  // Check crypto capabilities
  try {
    // crypto-js for encryption operations
    const CryptoJS = require('crypto-js');
    console.log('✓ Crypto-JS available for encryption');
  } catch (error) {
    console.error('✗ Crypto-JS not available:', error);
  }

  // Check port detection
  try {
    // detect-port for finding available ports
    const detectPort = require('detect-port');
    console.log('✓ Port detection available');
  } catch (error) {
    console.error('✗ Port detection not available:', error);
  }

  // Check Express for HTTP server
  try {
    const express = require('express');
    console.log('✓ Express available for HTTP server');
  } catch (error) {
    console.error('✗ Express not available:', error);
  }

  // Check Node.js crypto module
  try {
    const crypto = require('crypto');
    console.log('✓ Node.js crypto module available');
  } catch (error) {
    console.error('✗ Node.js crypto module not available:', error);
  }
} else {
  console.log('ℹ️ OAuth dependency check skipped (browser environment)');
}

export const dependenciesAvailable = {
  http: typeof window === 'undefined',
  crypto: true, // crypto-js works in both environments
  portDetection: typeof window === 'undefined',
  express: typeof window === 'undefined',
  nodeCrypto: typeof window === 'undefined'
};