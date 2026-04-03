import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client for R2/S3
const s3Client = new S3Client({
  region: process.env.S3_REGION || "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
});

/**
 * Generates a unique filename to avoid conflicts
 */
export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalFilename.split(".").pop();
  const nameWithoutExt = originalFilename.replace(/\.[^/.]+$/, "");
  const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, "_");

  return `${sanitizedName}_${timestamp}_${randomString}.${extension}`;
}

/**
 * Uploads a file to S3/R2 and returns the public URL
 */
export async function uploadImageToS3(
  file: Buffer,
  filename: string,
  contentType: string,
  keyPrefix: string,
): Promise<string> {
  const bucketName = process.env.S3_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("S3_BUCKET_NAME is not configured");
  }

  const uniqueFilename = generateUniqueFilename(filename);
  const key = `${keyPrefix}/${uniqueFilename}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // Construct the public URL
  // For R2, the format is typically: https://pub-{account}.r2.dev/{key}
  // Or if using a custom domain, adjust accordingly
  const publicUrl = `${process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT}/${key}`;

  return publicUrl;
}

/**
 * Deletes an image from S3/R2 by its URL
 */
export async function deleteImageFromS3(imageUrl: string): Promise<void> {
  const bucketName = process.env.S3_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("S3_BUCKET_NAME is not configured");
  }

  // Extract the key from the URL
  // For example: https://pub-account.r2.dev/organization-image/file.jpg -> organization-image/file.jpg
  const baseUrl = process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT || "";
  const key = imageUrl.replace(baseUrl + "/", "");

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  await s3Client.send(command);
}

export interface S3File {
  key: string;
  size: number;
  lastModified: string | null;
  url: string;
}

export interface S3Part {
  part: string;
  files: S3File[];
}

export interface S3ListResult {
  bucket: string;
  prefix: string | null;
  count: number;
  parts: S3Part[];
}

function extractPart(key: string, prefix: string): string {
  const stripped = prefix ? key.slice(prefix.length) : key;
  const firstSlash = stripped.indexOf("/");
  if (firstSlash === -1) return "root";
  return stripped.slice(0, firstSlash) || "root";
}

export async function listS3FilesByPart(
  prefix?: string,
): Promise<S3ListResult> {
  const bucketName = process.env.S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("S3_BUCKET_NAME is not configured");
  }

  const effectivePrefix = prefix || "";
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: effectivePrefix || undefined,
  });

  const response = await s3Client.send(command);
  const contents = response.Contents || [];
  const baseUrl = process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT || "";

  const groupMap = new Map<string, S3File[]>();

  for (const obj of contents) {
    if (!obj.Key) continue;
    // Skip the prefix folder itself
    if (obj.Key === effectivePrefix) continue;

    const part = extractPart(obj.Key, effectivePrefix);
    const file: S3File = {
      key: obj.Key,
      size: obj.Size || 0,
      lastModified: obj.LastModified?.toISOString() ?? null,
      url: baseUrl ? `${baseUrl}/${obj.Key}` : obj.Key,
    };

    const existing = groupMap.get(part);
    if (existing) {
      existing.push(file);
    } else {
      groupMap.set(part, [file]);
    }
  }

  const parts: S3Part[] = Array.from(groupMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([part, files]) => ({
      part,
      files: files.sort((a, b) => a.key.localeCompare(b.key)),
    }));

  return {
    bucket: bucketName,
    prefix: effectivePrefix || null,
    count: contents.length,
    parts,
  };
}

export async function getPresignedUrl(
  key: string,
  expiresIn = 3600,
): Promise<string> {
  const bucketName = process.env.S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("S3_BUCKET_NAME is not configured");
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}
