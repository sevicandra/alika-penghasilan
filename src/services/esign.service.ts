import { eSignConfig } from "@/config/esign.config";
export class EsignService {
  private static Credentials = Buffer.from(
    `${eSignConfig.CLIENT_ID}:${eSignConfig.CLIENT_PASSWORD}`
  ).toString("base64");
  static async processEsign({
    nik,
    Passphrase,
    jenis,
    nomor,
    tujuan,
    perihal,
    id,
    blob,
    fileName,
    tag_koordinat,
  }: {
    nik: string;
    Passphrase: string;
    jenis: string;
    nomor: string;
    tujuan: string;
    perihal: string;
    id: string | number;
    blob: Blob;
    fileName: string;
    tag_koordinat: string;
  }) {
    try {
      const formdata = new FormData();
      formdata.append("nik", nik);
      formdata.append("passphrase", Passphrase);
      formdata.append("jenis_dokumen", jenis);
      formdata.append("nomor", nomor);
      formdata.append("tujuan", tujuan);
      formdata.append("perihal", perihal);
      formdata.append("tampilan", "visible");
      formdata.append("height", `75`);
      formdata.append("width", `75`);
      formdata.append(
        "linkQR",
        `${process.env.APP_URL}/download/pdf/${id}${fileName}`
      );
      formdata.append("image", `false`);
      formdata.append("tag_koordinat", tag_koordinat);
      formdata.append("file", blob, fileName);
      const sign = await fetch(`${eSignConfig.BASE_URI}/api/pdf`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${this.Credentials}`,
        },
        body: formdata,
      });
      if (!sign.ok) throw new Error(await sign.text());
      const result = await sign.arrayBuffer();
      const buffer = Buffer.from(result);
      const headers = sign.headers;
      const data = {
        date: headers.get("date"),
        id_dokumen: headers.get("id_dokumen"),
      };
      return {
        buffer: buffer,
        date: data.date,
        id_dokumen: data.id_dokumen,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
