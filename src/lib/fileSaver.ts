// Direct Local File Saver utility using HTML5 Download triggers, Blob links, and System Access

/**
 * Downloads and saves a file directly to the user's disk/storage.
 * Leverages native Blob links & direct download triggers for maximum browser & OS compatibility.
 */
export async function downloadAndSaveToDisk(
  fileUrl: string, 
  fileName: string, 
  mimeType?: string
): Promise<{ success: boolean; filePath?: string; error?: string }> {
  try {
    // 1. Attempt File System Access API if supported and in non-sandboxed context
    if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
      try {
        const ext = fileName.split('.').pop() || 'file';
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: fileName,
          types: [{
            description: 'فایل دانلودی (Undo DM File)',
            accept: {
              [mimeType || 'application/octet-stream']: [`.${ext}`]
            }
          }]
        });

        // Try CORS fetch
        const response = await fetch(fileUrl, { mode: 'cors' });
        if (response.ok) {
          const blob = await response.blob();
          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();
          return { success: true, filePath: fileHandle.name };
        }
      } catch (pickerErr: any) {
        if (pickerErr.name === 'AbortError') {
          return { success: false, error: 'انصراف کاربر از انتخاب پوشه' };
        }
        console.warn('showSaveFilePicker fallback:', pickerErr);
      }
    }

    // 2. Fetch via Blob & trigger direct download link
    try {
      const response = await fetch(fileUrl, { mode: 'cors' });
      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
        return { success: true, filePath: fileName };
      }
    } catch (e) {
      console.warn('Fetch blob failed, fallback to direct download anchor', e);
    }

    // 3. Native Direct HTML5 Anchor Download Trigger (Bypasses CORS restrictions)
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true, filePath: fileName };

  } catch (err: any) {
    console.error('File saving failed:', err);
    return { success: false, error: err.message || 'خطا در ذخیره فایل' };
  }
}

/**
 * Triggers native OS File Manager dialog (Android Files App / Windows Explorer File Picker)
 * allowing the user to select local files from their phone/computer storage.
 */
export function openSystemFileManagerPicker(onFilesSelected?: (files: FileList) => void): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.style.display = 'none';
  
  input.onchange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      if (onFilesSelected) {
        onFilesSelected(target.files);
      }
    }
  };

  document.body.appendChild(input);
  input.click();
  setTimeout(() => {
    if (document.body.contains(input)) {
      document.body.removeChild(input);
    }
  }, 60000);
}

/**
 * Prompts user to choose a directory on system storage using Directory Picker API or Native input.
 */
export async function pickSystemDirectory(): Promise<string | null> {
  if (typeof window !== 'undefined' && 'showDirectoryPicker' in window) {
    try {
      const dirHandle = await (window as any).showDirectoryPicker();
      return dirHandle.name ? `/storage/emulated/0/Download/${dirHandle.name}` : null;
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Directory picker error:', err);
      }
    }
  }
  
  // Fallback directory path helper
  const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
  return isAndroid 
    ? '/storage/emulated/0/Download/UndoDownloadManager' 
    : 'C:/Users/Public/Downloads/UndoDownloadManager';
}
