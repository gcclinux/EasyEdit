// global.d.ts
export {};

declare global {
  interface Window {
    electron: {
      debugLog: (message: string) => void;
      onFileOpened: (callback: (event: any, content: string) => void) => void;
      removeFileOpenedListener: (callback: (event: any, content: string) => void) => void;
    }
  }
}