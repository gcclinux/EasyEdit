import { encryptTextToBytes, decryptBytesToText } from './stpFileCrypter';

export const encryptContent = async (
  content: string,
  showPasswordPrompt: (onSubmit: (password: string) => void) => void
): Promise<void> => {
  showPasswordPrompt((password) => {
    if (!password || password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    try {
      const encrypted = encryptTextToBytes(content, password);
      // Ensure we pass an ArrayBuffer-backed ArrayBufferView to Blob to satisfy TypeScript
      const uint8 = encrypted instanceof Uint8Array ? encrypted : new Uint8Array(encrypted as any);
      const blob = new Blob([uint8.slice()], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.sstp';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Encryption failed: ' + (error as Error).message);
    }
  });
};

export const decryptFile = async (
  setEditorContent: (content: string) => void,
  showPasswordPrompt: (onSubmit: (password: string) => void) => void
): Promise<void> => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.sstp';
  
  input.onchange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    showPasswordPrompt(async (password) => {
      if (!password) return;

      try {
        const arrayBuffer = await file.arrayBuffer();
        const encrypted = new Uint8Array(arrayBuffer);
        const decrypted = decryptBytesToText(encrypted, password);
        setEditorContent(decrypted);
      } catch (error) {
        alert('Decryption failed: ' + (error as Error).message);
      }
    });
  };

  input.click();
};
