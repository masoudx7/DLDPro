// Direct Local File Saver utility using File System Access API and Blob downloading

/**
 * Downloads and saves a file directly to the user's disk/storage.
 * Leverages `window.showSaveFilePicker` when available so the user can choose the exact directory/file name on Windows or Android.
 * Falls back to standard HTML5 Blob trigger for max compatibility.
 */
export async function downloadAndSaveToDisk(
  fileUrl: string, 
  fileName: string, 
  mimeType?: string,
  onProgress?: (downloaded: number, total: number) => void
): Promise<{ success: boolean; filePath?: string; error?: string }> {
  try {
    // 1. Check if modern File System Access API is supported (Chrome, Edge, Opera, etc.)
    const hasSavePicker = typeof window !== 'undefined' && 'showSaveFilePicker' in window;

    if (hasSavePicker) {
      try {
        // Suggest file name & extension
        const ext = fileName.split('.').pop() || 'file';
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: fileName,
          types: [{
            description: 'فایل دانلودی (Saved File)',
            accept: {
              [mimeType || 'application/octet-stream']: [`.${ext}`]
            }
          }]
        });

        // Fetch file content
        const response = await fetch(fileUrl, { mode: 'cors' });
        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }

        const reader = response.body?.getReader();
        const contentLength = +(response.headers.get('Content-Length') || 0);
        let receivedLength = 0;
        const chunks: Uint8Array[] = [];

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) {
              chunks.push(value);
              receivedLength += value.length;
              if (onProgress && contentLength) {
                onProgress(receivedLength, contentLength);
              }
            }
          }
        }

        const blob = new Blob(chunks, { type: mimeType || 'application/octet-stream' });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();

        return { success: true, filePath: fileHandle.name };
      } catch (pickerErr: any) {
        // User cancelled picker or permission denied
        if (pickerErr.name === 'AbortError') {
          return { success: false, error: 'انصراف کاربر از انتخاب پوشه' };
        }
        console.warn('showSaveFilePicker fallback to blob trigger:', pickerErr);
      }
    }

    // 2. Fallback: Blob Fetch + Standard A Element Trigger
    const response = await fetch(fileUrl, { mode: 'cors' });
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

    return { success: true, filePath: fileName };

  } catch (err: any) {
    console.error('File saving failed:', err);
    // Direct link fallback trigger
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true, filePath: fileName };
  }
}

/**
 * Prompts user to choose a directory on system storage using Directory Picker API.
 */
export async function pickSystemDirectory(): Promise<string | null> {
  if (typeof window !== 'undefined' && 'showDirectoryPicker' in window) {
    try {
      const dirHandle = await (window as any).showDirectoryPicker();
      return dirHandle.name ? `[پوشه انتخابی سیستم]: /${dirHandle.name}` : null;
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Directory picker error:', err);
      }
    }
  }
  return null;
}
