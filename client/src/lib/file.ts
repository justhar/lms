import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Supabase S3 configuration
const s3Client = new S3Client({
  region: "ap-southeast-1",
  endpoint: `https://${
    import.meta.env.VITE_SUPABASE_PROJECT_ID
  }.supabase.co/storage/v1/s3`,
  credentials: {
    accessKeyId: import.meta.env.VITE_SUPABASE_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_SUPABASE_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const BUCKET_NAME = "submissions";

export async function uploadFile(
  file: File
): Promise<{ url: string; key: string }> {
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  try {
    // Convert File to ArrayBuffer for browser compatibility
    const arrayBuffer = await file.arrayBuffer();

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: new Uint8Array(arrayBuffer),
      ContentType: file.type,
      CacheControl: "3600",
    });

    await s3Client.send(command);

    // Get the public URL
    const url = `https://${
      import.meta.env.VITE_SUPABASE_PROJECT_ID
    }.supabase.co/storage/v1/object/public/${BUCKET_NAME}/${fileName}`;

    return {
      url,
      key: fileName,
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error(
      `Failed to upload file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function deleteFile(key: string): Promise<void> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("Delete error:", error);
    throw new Error(
      `Failed to delete file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function getSignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error("Signed URL error:", error);
    throw new Error(
      `Failed to get signed URL: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
