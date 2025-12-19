/**
 * Jest setup file for cloud integration tests
 */

// Mock Google API for testing
global.gapi = {
  load: jest.fn(),
  auth2: {
    getAuthInstance: jest.fn(),
    init: jest.fn()
  },
  client: {
    init: jest.fn(),
    drive: {
      files: {
        list: jest.fn(),
        get: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      }
    }
  }
} as any;

// Mock window.crypto for testing
Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: (arr: any) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
    subtle: {
      digest: jest.fn().mockResolvedValue(new ArrayBuffer(32))
    }
  }
});