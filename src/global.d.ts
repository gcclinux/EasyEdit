// global.d.ts
interface Window {
  electron: {
    openFile: () => Promise<string>;
    onFileOpened: (callback: (content: string) => void) => void;
  };
  google?: {
    accounts: {
      oauth2: {
        initTokenClient: (config: any) => any;
        hasGrantedAllScopes: (tokenResponse: any, ...scopes: string[]) => boolean;
      };
    };
  };
}