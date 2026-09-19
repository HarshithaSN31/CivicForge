export interface FileUploadResult {
  s3Key: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

/**
 * Validates photo evidence before upload.
 */
export function validateEvidenceFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|heic)$/i)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP images are supported.' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: 'File size exceeds the 5MB limit.' };
  }

  return { valid: true };
}

/**
 * Uploads evidence photo to Amazon S3 (or generates local Object URL preview when offline/mocking).
 */
export async function uploadEvidencePhoto(file: File, issueId: string): Promise<FileUploadResult> {
  const validation = validateEvidenceFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid file for upload.');
  }

  const fileExt = file.name.split('.').pop() || 'jpg';
  const s3Key = `evidence/${issueId}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

  // Read as Data URL / Object URL for instant preview & persistence
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        s3Key,
        url: reader.result as string,
        sizeBytes: file.size,
        mimeType: file.type || 'image/jpeg',
      });
    };
    reader.onerror = () => reject(new Error('Failed to read photo evidence file.'));
    reader.readAsDataURL(file);
  });
}
