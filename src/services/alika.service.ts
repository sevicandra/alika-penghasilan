import axios from "axios";
import crypto from "crypto";
import { ExternalServiceError } from "@/utils/errors";
import { alikaConfig } from "@/config/alika.config";

export class AlikaService {
  private static token: string | null = null;
  private static tokenExpiration: number = 0;
  private static publicKey: string | null = null;
  private static publicKeyExpiration: number = 0;
  static async getAccessToken() {
    const currentTime = Date.now() / 1000;
    if (this.token && currentTime < this.tokenExpiration) {
      return this.token;
    }
    try {
      const response = await axios.post(
        `${alikaConfig.BASE_URI}/auth/token`,
        {
          grant_type: alikaConfig.GRANT_TYPE,
          client_id: alikaConfig.CLIENT_ID,
          client_secret: alikaConfig.CLIENT_SECRET,
          scope: alikaConfig.SCOPE,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      this.token = response.data.access_token as string;
      this.tokenExpiration = currentTime + response.data.expires_in;
      return this.token;
    } catch (error) {
      throw new ExternalServiceError("AlikaService", "Failed to get access token", error as Error);
    }
  }
  static async sendPushNotification({
    nip,
    message,
    title,
  }: {
    nip: string;
    message: string;
    title?: string;
  }) {
    try {
      await axios.post(
        `${alikaConfig.PUSH_NOTIFICATION_URL}/notification/Send`,
        {
          nip: nip,
          message,
          title,
        },
        {
          headers: {
            Authorization: `Bearer ${await this.getAccessToken()}`,
          },
        }
      );
    } catch (error) {
      throw new ExternalServiceError(
        "AlikaService",
        "Failed to send push notification",
        error as Error
      );
    }
  }
  static async sendBulkPushNotification({
    nip,
    message,
    title,
  }: {
    nip: string[];
    message: string;
    title?: string;
  }) {
    try {
      await axios.post(
        `${alikaConfig.PUSH_NOTIFICATION_URL}/notification/SendBulk`,
        {
          nip: nip,
          message,
          title,
        },
        {
          headers: {
            Authorization: `Bearer ${await this.getAccessToken()}`,
          },
        }
      );
    } catch (error) {
      throw new ExternalServiceError(
        "AlikaService",
        "Failed to send push notification",
        error as Error
      );
    }
  }
  static async getPublicKey() {
    try {
      const currentTime = Date.now() / 1000;
      if (this.publicKey && currentTime < this.publicKeyExpiration) {
        return this.publicKey;
      }
      const response = await axios.get(`${alikaConfig.BASE_URI}/.well-known/jwks.json`);
      const jwk = response.data.keys[0];
      const keyObject = crypto.createPublicKey({
        key: jwk,
        format: "jwk",
      });
      const pem = keyObject
        .export({
          type: "spki",
          format: "pem",
        })
        .toString();
      this.publicKey = pem;
      this.publicKeyExpiration = currentTime + 3600;
      return this.publicKey;
    } catch (error) {
      console.error("Error getting public key:", error);
      throw new Error("Failed to get public key");
    }
  }
}
