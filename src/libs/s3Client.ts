import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

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
