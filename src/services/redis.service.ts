import client from "../config/redis.config"; // Mengimpor client yang sudah terkoneksi
import {} from "redis";
export class RedisService {
  // Menyimpan data di Redis
  async setCache(key: string, value: string, ttl: number): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        client.set(key, value, {
          EX: ttl,
        });
        console.log(`Cache set for key: ${key}`);
        resolve();
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error setting cache in Redis:", error.message);
          reject(error.message);
        } else {
          console.error("Error setting cache in Redis:", error);
          reject("Failed to set cache in Redis");
        }
      }
    });
  }

  // Mengambil data dari Redis
  async getCache(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      try {
        const result = client.get(key);
        resolve(result);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error getting cache from Redis:", error.message);
          reject(error.message);
        } else {
          console.error("Error getting cache from Redis:", error);
          reject("Failed to get cache from Redis");
        }
      }
    });
  }

  // Menghapus data dari Redis
  async deleteCache(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        client.del(key);
        console.log(`Cache deleted for key: ${key}`);
        resolve();
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error deleting cache in Redis:", error.message);
          reject(error.message);
        } else {
          console.error("Error deleting cache in Redis:", error);
          reject("Failed to delete cache in Redis");
        }
      }
    });
  }
}
