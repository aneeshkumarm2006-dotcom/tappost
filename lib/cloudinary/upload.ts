/**
 * Cloudinary Upload Utility
 *
 * Production mode: Uses Cloudinary SDK to upload files/buffers and returns the
 *   secure_url from the Cloudinary response.
 *
 * Stub mode (no CLOUDINARY_CLOUD_NAME env var): Returns a deterministic
 *   placeholder URL so the entire UI / form flow works without Cloudinary keys.
 *   Stub files are NOT saved to disk — the URL is purely synthetic.
 *
 * Used by: POST /api/upload  (logos, special photos, custom photos)
 */

import { v2 as cloudinary } from 'cloudinary';

// ── Configure Cloudinary lazily (only when actually needed) ──────────────────

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

// ── Stub placeholder URL ─────────────────────────────────────────────────────

const STUB_PLACEHOLDER = (folder: string, filename: string) =>
  `https://placehold.co/400x400/111111/B5FF4D?text=${encodeURIComponent(filename)}&folder=${encodeURIComponent(folder)}`;

// ── Upload from Buffer ────────────────────────────────────────────────────────

export async function uploadBuffer(
  buffer: Buffer,
  options: {
    folder: string;
    filename?: string;
    resourceType?: 'image' | 'video' | 'raw' | 'auto';
  }
): Promise<string> {
  const { folder, filename = 'upload', resourceType = 'image' } = options;

  // Stub mode — no Cloudinary credentials
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.warn('[cloudinary] Stub mode — returning placeholder URL');
    return STUB_PLACEHOLDER(folder, filename);
  }

  configureCloudinary();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename,
        resource_type: resourceType,
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload failed with no result'));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

// ── Upload from File Path ─────────────────────────────────────────────────────

export async function uploadFilePath(
  filePath: string,
  options: {
    folder: string;
    publicId?: string;
    resourceType?: 'image' | 'video' | 'raw' | 'auto';
  }
): Promise<string> {
  const { folder, publicId, resourceType = 'image' } = options;

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.warn('[cloudinary] Stub mode — returning placeholder URL');
    return STUB_PLACEHOLDER(folder, publicId ?? 'upload');
  }

  configureCloudinary();

  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    public_id: publicId,
    resource_type: resourceType,
    overwrite: true,
  });

  return result.secure_url;
}
