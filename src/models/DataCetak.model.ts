import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/config/db.config";

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
export default DataCetak;
