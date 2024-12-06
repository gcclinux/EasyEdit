// global.d.ts
interface Window {
  electron: {
    openFile: () => Promise<string>;
    onFileOpened: (callback: (content: string) => void) => void;
  };
}