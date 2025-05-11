import sequelize from "@/config/db.config";
import { Model, DataTypes, Optional } from "sequelize";

type DataCetakAttributes = {
  id: number;
  tahun: string;
  nip_asal: string;
  nip_tujuan: string;
  nama_tujuan: string;
  jenis: string;
  nomor: string;
  tanggal: number;
  tujuan: string;
  perihal: string;
  file: string;
  date: string;
  id_dokumen: string;
  status: number;
};

type DataCetakCreationAttributes = Optional<
  DataCetakAttributes,
  "id" | "date" | "id_dokumen" | "status"
>;

class DataCetak
  extends Model<DataCetakAttributes, DataCetakCreationAttributes>
  implements DataCetakAttributes
{
  public id!: number;
  public tahun!: string;
  public nip_asal!: string;
  public nip_tujuan!: string;
  public nama_tujuan!: string;
  public jenis!: string;
  public nomor!: string;
  public tanggal!: number;
  public tujuan!: string;
  public perihal!: string;
  public file!: string;
  public date!: string;
  public id_dokumen!: string;
  public status!: number;
}

DataCetak.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tahun: {
      type: DataTypes.STRING(4),
      validate: {
        isNumeric: true,
        len: [4, 4],
      },
    },
    nip_asal: {
      type: DataTypes.STRING(18),
      validate: {
        isNumeric: true,
        len: [18, 18],
      },
    },
    nip_tujuan: {
      type: DataTypes.STRING(18),
      validate: {
        isNumeric: true,
        len: [18, 18],
      },
    },
    nama_tujuan: {
      type: DataTypes.STRING(128),
      validate: {
        notEmpty: true,
      },
    },
    jenis: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    nomor: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    tanggal: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
      },
    },
    tujuan: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    perihal: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    file: {
      type: DataTypes.STRING,
      validate: {
        is: {
          args: /^[\w,\s-]+\.(pdf)$/i,
          msg: "File harus berekstensi pdf",
        },
      },
    },
    date: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    id_dokumen: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "data_cetak",
    timestamps: false,
    modelName: "DataCetak",
  }
);

// const countDataCetak = async ({ data }: { data?: any }) => {
//   try {
//     if (data) {
//       return await DataCetak.count({
//         where: data,
//       }).catch((e) => {
//         throw new Error("Error counting data gaji: " + e);
//       });
//     } else {
//       return await DataCetak.count().catch((e) => {
//         throw new Error("Error counting data gaji: " + e);
//       });
//     }
//   } catch (error: any) {
//     if (error.name === "SequelizeConnectionRefusedError") {
//       throw new Error("Database connection error");
//     } else {
//       throw new Error("Error counting data gaji: " + error);
//     }
//   }
// };
// const getDataCetak = async ({
//   id = null,
//   limit = null,
//   offset = 0,
//   nip = null,
//   tahun = null,
// }: {
//   id?: number | null;
//   limit?: number | null;
//   offset?: number;
//   nip?: string | null;
//   tahun?: string | null;
// }) => {
//   try {
//     if (id) {
//       const data: any = await DataCetak.findOne({ where: { id: id } });
//       return data;
//     } else {
//       if (limit) {
//         if (nip && tahun) {
//           const data: any = await DataCetak.findAll({
//             where: { nip_asal: nip, tahun: tahun },
//             limit: limit,
//             offset: offset,
//             order: [["tanggal", "DESC"]],
//           });
//           return data;
//         } else if (nip) {
//           const data: any = await DataCetak.findAll({
//             where: { nip_asal: nip },
//             limit: limit,
//             offset: offset,
//             order: [["tanggal", "DESC"]],
//           });
//           return data;
//         } else {
//           const data: any = await DataCetak.findAll({
//             limit: limit,
//             offset: offset,
//           });
//           return data;
//         }
//       } else {
//         if (nip && tahun) {
//           const data: any = await DataCetak.findAll({
//             where: { nip_asal: nip, tahun: tahun },
//             order: [["tanggal", "DESC"]],
//           });
//           return data;
//         } else if (nip) {
//           const data: any = await DataCetak.findAll({
//             where: { nip_asal: nip },
//             order: [["tanggal", "DESC"]],
//           });
//           return data;
//         } else {
//           const data: any = await DataCetak.findAll();
//           return data;
//         }
//       }
//     }
//   } catch (error: any) {
//     if (error.name === "SequelizeConnectionRefusedError") {
//       throw new Error("Database connection error");
//     } else {
//       throw new Error("Error get data cetak: " + error);
//     }
//   }
// };
// const createDataCetak = async ({
//   tahun = null,
//   nip_asal = null,
//   nip_tujuan = null,
//   nama_tujuan = null,
//   jenis = null,
//   nomor = null,
//   tanggal = null,
//   tujuan = null,
//   perihal = null,
//   file = null,
//   date = null,
//   id_dokumen = null,
//   status = null,
// }: {
//   tahun?: number | null;
//   nip_asal?: string | null;
//   nip_tujuan?: string | null;
//   nama_tujuan?: string | null;
//   jenis?: string | null;
//   nomor?: string | null;
//   tanggal?: number | null;
//   tujuan?: string | null;
//   perihal?: string | null;
//   file?: string | null;
//   date?: string | null;
//   id_dokumen?: string | null;
//   status?: number | null;
// }) => {
//   try {
//     const data: any = await DataCetak.create({
//       tahun: tahun,
//       nip_asal: nip_asal,
//       nip_tujuan: nip_tujuan,
//       nama_tujuan: nama_tujuan,
//       jenis: jenis,
//       nomor: nomor,
//       tanggal: tanggal,
//       tujuan: tujuan,
//       perihal: perihal,
//       file: file,
//       date: date,
//       id_dokumen: id_dokumen,
//       status: status,
//     });
//     return data;
//   } catch (error: any) {
//     if (error.name === "SequelizeConnectionRefusedError") {
//       throw new Error("Database connection error");
//     } else {
//       throw new Error("Error creating data cetak: " + error);
//     }
//   }
// };
// const updateDataCetak = async (id: number, data: any) => {
//   try {
//     return await DataCetak.update(data, {
//       where: { id: id },
//     });
//   } catch (error: any) {
//     if (error.name === "SequelizeConnectionRefusedError") {
//       throw new Error("Database connection error");
//     } else {
//       throw new Error("Error updating data cetak: " + error);
//     }
//   }
// };
// const deleteDataCetak = async (id: number) => {
//   try {
//     return await DataCetak.destroy({ where: { id: id } });
//   } catch (error: any) {
//     if (error.name === "SequelizeConnectionRefusedError") {
//       throw new Error("Database connection error");
//     } else {
//       throw new Error("Error deleting data cetak: " + error);
//     }
//   }
// };
// const getTahunAsal = async ({ nip }: { nip: string }) => {
//   try {
//     return await DataCetak.findAll({
//       where: { nip_asal: nip },
//       attributes: ["tahun"],
//       group: ["tahun"],
//     });
//   } catch (error: any) {
//     if (error.name === "SequelizeConnectionRefusedError") {
//       throw new Error("Database connection error");
//     } else {
//       throw new Error("Error get tahun asal data cetak: " + error);
//     }
//   }
// };
// const getCetakAsal = async ({
//   nip,
//   tahun,
//   limit = null,
//   offset = 0,
// }: {
//   nip: string;
//   tahun: number;
//   limit?: number | null;
//   offset?: number;
// }) => {
//   try {
//     if (limit) {
//       return await DataCetak.findAll({
//         where: { nip_asal: nip, tahun: tahun },
//         limit: limit,
//         offset: offset,
//       });
//     } else {
//       return await DataCetak.findAll({
//         where: { nip_asal: nip, tahun: tahun },
//       });
//     }
//   } catch (error: any) {
//     if (error.name === "SequelizeConnectionRefusedError") {
//       throw new Error("Database connection error");
//     } else {
//       throw new Error("Error get data cetak asal: " + error);
//     }
//   }
// };
// const findCetakAsal = async ({
//   nip = null,
//   tahun = null,
//   keyword = "",
//   limit = null,
//   offset = 0,
// }: {
//   nip: string | null;
//   tahun: number | null;
//   keyword?: string;
//   limit?: number | null;
//   offset?: number;
// }) => {
//   try {
//     if (limit) {
//       return await DataCetak.findAll({
//         where: {
//           nip_asal: nip,
//           tahun: tahun,
//           perihal: {
//             [Op.like]: `%${keyword}%`,
//           },
//           limit: limit,
//           offsiet: offset,
//         },
//       });
//     } else {
//       return await DataCetak.findAll({
//         where: {
//           nip_asal: nip,
//           tahun: tahun,
//           perihal: {
//             [Op.like]: `%${keyword}%`,
//           },
//         },
//       });
//     }
//   } catch (error: any) {
//     if (error.name === "SequelizeConnectionRefusedError") {
//       throw new Error("Database connection error");
//     } else {
//       throw new Error("Error find data cetak asal: " + error);
//     }
//   }
// };
// const countCetakAsal = async ({
//   nip = null,
//   tahun = null,
// }: {
//   nip?: string | null;
//   tahun?: number | null;
// }) => {
//   try {
//     return await DataCetak.count({
//       where: {
//         nip_asal: nip,
//         tahun: tahun,
//       },
//     });
//   } catch (error: any) {
//     if (error.name === "SequelizeConnectionRefusedError") {
//       throw new Error("Database connection error");
//     } else {
//       throw new Error("Error counting data cetak asal: " + error);
//     }
//   }
// };
// const getTahunTujuan = async ({ nip }: { nip: string }) => {
//   try {
//     return await DataCetak.findAll({
//       where: { nip_tujuan: nip },
//       attributes: ["tahun"],
//       group: ["tahun"],
//     });
//   } catch (error: any) {
//     if (error.name === "SequelizeConnectionRefusedError") {
//       throw new Error("Database connection error");
//     } else {
//       throw new Error("Error get tahun tujuan data cetak: " + error);
//     }
//   }
// };
// const getCetakTujuan = async ({
//   nip,
//   limit = null,
//   offset = 0,
// }: {
//   nip: string;
//   limit?: number | null;
//   offset?: number;
// }) => {
//   try {
//     if (limit) {
//       return await DataCetak.findAll({
//         where: { nip_tujuan: nip, status: 0 },
//         limit: limit,
//         offset: offset,
//       });
//     } else {
//       return await DataCetak.findAll({ where: { nip_tujuan: nip, status: 0 } });
//     }
//   } catch (error: any) {
//     if (error.name === "SequelizeConnectionRefusedError") {
//       throw new Error("Database connection error");
//     } else {
//       throw new Error("Error get data cetak tujuan: " + error);
//     }
//   }
// };
// const findCetakTujuan = async ({
//   nip = null,
//   tahun = null,
//   keyword = "",
//   limit = null,
//   offset = 0,
// }: {
//   nip: string | null;
//   tahun: number | null;
//   keyword?: string;
//   limit?: number | null;
//   offset?: number;
// }) => {
//   try {
//     if (limit) {
//       return await DataCetak.findAll({
//         where: {
//           nip_tujuan: nip,
//           status: 0,
//           tahun: tahun,
//           perihal: {
//             [Op.like]: `%${keyword}%`,
//           },
//         },
//         limit: limit,
//         offset: offset,
//       });
//     } else {
//       return await DataCetak.findAll({
//         where: {
//           nip_tujuan: nip,
//           tahun: tahun,
//           status: 0,
//           perihal: {
//             [Op.like]: `%${keyword}%`,
//           },
//         },
//       });
//     }
//   } catch (error: any) {
//     if (error.name === "SequelizeConnectionRefusedError") {
//       throw new Error("Database connection error");
//     } else {
//       throw new Error("Error find data cetak tujuan: " + error);
//     }
//   }
// };
// const countCetakTujuan = async ({ nip = null }: { nip?: string | null }) => {
//   try {
//     return await DataCetak.count({
//       where: {
//         nip_tujuan: nip,
//         status: 0,
//       },
//     });
//   } catch (error: any) {
//     if (error.name === "SequelizeConnectionRefusedError") {
//       throw new Error("Database connection error");
//     } else {
//       throw new Error("Error counting data cetak tujuan: " + error);
//     }
//   }
// };
// const getTahunRiwayat = async ({ nip }: { nip: string }) => {
//   try {
//     return await DataCetak.findAll({
//       where: {
//         nip_tujuan: nip,
//         status: 1,
//       },
//       attributes: ["tahun"],
//       group: ["tahun"],
//     });
//   } catch (error: any) {
//     if (error.name === "SequelizeConnectionRefusedError") {
//       throw new Error("Database connection error");
//     } else {
//       throw new Error("Error get tahun riwayat data cetak: " + error);
//     }
//   }
// };
// const getCetakRiwayat = async ({
//   nip,
//   limit = null,
//   offset = 0,
// }: {
//   nip: string;
//   limit?: number | null;
//   offset?: number;
// }) => {
//   try {
//     if (limit) {
//       return await DataCetak.findAll({
//         where: {
//           nip_tujuan: nip,
//           status: 1,
//         },
//         limit: limit,
//         offset: offset,
//         order: [["tanggal", "DESC"]],
//       });
//     } else {
//       return await DataCetak.findAll({
//         where: {
//           nip_tujuan: nip,
//           status: 1,
//         },
//       });
//     }
//   } catch (error: any) {
//     if (error.name === "SequelizeConnectionRefusedError") {
//       throw new Error("Database connection error");
//     } else {
//       throw new Error("Error get riwayat data cetak: " + error);
//     }
//   }
// };
// const findCetakRiwayat = async ({
//   nip = null,
//   tahun = null,
//   keyword = "",
//   limit = null,
//   offset = 0,
// }: {
//   nip?: string | null;
//   tahun?: number | null;
//   keyword?: string;
//   limit?: number | null;
//   offset?: number;
// }) => {
//   try {
//     if (limit) {
//       return await DataCetak.findAll({
//         where: {
//           nip_tujuan: nip,
//           tahun: tahun,
//           status: 1,
//           perihal: {
//             [Op.like]: `%${keyword}%`,
//           },
//           limit: limit,
//           offsiet: offset,
//         },
//       });
//     } else {
//       return await DataCetak.findAll({
//         where: {
//           nip_tujuan: nip,
//           tahun: tahun,
//           status: 1,
//           perihal: {
//             [Op.like]: `%${keyword}%`,
//           },
//         },
//       });
//     }
//   } catch (error: any) {
//     if (error.name === "SequelizeConnectionRefusedError") {
//       throw new Error("Database connection error");
//     } else {
//       throw new Error("Error find riwayat data cetak: " + error);
//     }
//   }
// };
// const countCetakRiwayat = async ({ nip = null }: { nip?: string | null }) => {
//   try {
//     return await DataCetak.count({
//       where: {
//         nip_tujuan: nip,
//         status: 1,
//       },
//     });
//   } catch (error: any) {
//     if (error.name === "SequelizeConnectionRefusedError") {
//       throw new Error("Database connection error");
//     } else {
//       throw new Error("Error counting riwayat data cetak: " + error);
//     }
//   }
// };
// const getNotif = async ({ nip }: { nip: string }) => {
//   try {
//     return await DataCetak.count({
//       where: {
//         nip_tujuan: nip,
//         status: 0,
//       },
//     });
//   } catch (error: any) {
//     if (error.name === "SequelizeConnectionRefusedError") {
//       throw new Error("Database connection error");
//     } else {
//       throw new Error("Error get notifikasi data cetak: " + error);
//     }
//   }
// };
// const GetRiwayatTerakhir = async ({ nip }: { nip: string }) => {
//   try {
//     return await DataCetak.findAll({
//       where: {
//         nip_asal: nip,
//         status: 1,
//       },
//       attributes: {
//         exclude: ["id", "id_dokumen", "date"],
//       },
//       limit: 5,
//       order: [["id", "DESC"]],
//     });
//   } catch (error: any) {
//     if (error.name === "SequelizeConnectionRefusedError") {
//       throw new Error("Database connection error");
//     } else {
//       throw new Error("Error get riwayat terakhir data cetak: " + error);
//     }
//   }
// };

export default DataCetak;
