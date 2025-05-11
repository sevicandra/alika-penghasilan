import { minioClient, minioConfig } from "../config/minio.config";

export class MinioService {
  public async uploadFile(file: any, fileName: string) {
    try {
      const result = await minioClient.putObject(
        minioConfig.bucket,
        fileName,
        file
      );
      return result;
    } catch (error: any) {
      console.error("Error uploading file to MinIO:", error);
      throw error;
    }
  }

  public async downloadFile(fileName: string) {
    try {
      const result = await minioClient.getObject(minioConfig.bucket, fileName);
      return result;
    } catch (error: any) {
      console.error("Error downloading file from MinIO:", error);
      throw error;
    }
  }

  public async deleteFile(fileName: string) {
    try {
      const result = await minioClient.removeObject(
        minioConfig.bucket,
        fileName
      );
      return result;
    } catch (error: any) {
      console.error("Error deleting file from MinIO:", error);
      throw error;
    }
  }
}
