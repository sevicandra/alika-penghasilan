import { DataTypes, INTEGER, Model, Optional } from "sequelize";
import sequelize from "@/config/db.config";

type DataProfilAttributes = {
  id: number;
  tahun: string;
  kdsatker: string;
  no_skp: string;
  nama_ttd_skp: string;
  nip_ttd_skp: string;
  jab_ttd_skp: string;
  nama_ttd_kp4: string;
  nip_ttd_kp4: string;
  jab_ttd_kp4: string;
  npwp_bendahara: string;
  nama_bendahara: string;
  nip_bendahara: string;
  tgl_spt: number;
  file: string | null;
};

type DataProfilCreationAttributes = Optional<DataProfilAttributes, "id" | "file" | "no_skp">;

class DataProfil
  extends Model<DataProfilAttributes, DataProfilCreationAttributes>
  implements DataProfilAttributes
{
  public id!: number;
  public tahun!: string;
  public kdsatker!: string;
  public no_skp!: string;
  public nama_ttd_skp!: string;
  public nip_ttd_skp!: string;
  public jab_ttd_skp!: string;
  public nama_ttd_kp4!: string;
  public nip_ttd_kp4!: string;
  public jab_ttd_kp4!: string;
  public npwp_bendahara!: string;
  public nama_bendahara!: string;
  public nip_bendahara!: string;
  public tgl_spt!: number;
  public file!: string;
}

DataProfil.init(
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
    kdsatker: {
      type: DataTypes.STRING(6),
      validate: {
        isNumeric: true,
        len: [6, 6],
      },
    },
    no_skp: {
      type: DataTypes.STRING(128),
      validate: {
        notEmpty: true,
      },
    },
    nama_ttd_skp: {
      type: DataTypes.STRING(128),
      validate: {
        notEmpty: true,
      },
    },
    nip_ttd_skp: {
      type: DataTypes.STRING(18),
      validate: {
        notEmpty: true,
      },
    },
    jab_ttd_skp: {
      type: DataTypes.STRING(128),
      validate: {
        notEmpty: true,
      },
    },
    nama_ttd_kp4: {
      type: DataTypes.STRING(128),
      validate: {
        notEmpty: true,
      },
    },
    nip_ttd_kp4: {
      type: DataTypes.STRING(18),
      validate: {
        notEmpty: true,
      },
    },
    jab_ttd_kp4: {
      type: DataTypes.STRING(128),
      validate: {
        notEmpty: true,
      },
    },
    npwp_bendahara: {
      type: DataTypes.STRING(16),
      validate: {
        notEmpty: true,
      },
    },
    nama_bendahara: {
      type: DataTypes.STRING(128),
      validate: {
        notEmpty: true,
      },
    },
    nip_bendahara: {
      type: DataTypes.STRING(18),
      validate: {
        notEmpty: true,
      },
    },
    tgl_spt: {
      type: INTEGER,
      validate: {
        notEmpty: true,
      },
    },
    file: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "data_profil",
    timestamps: false,
    modelName: "DataProfil",
    indexes: [
      {
        unique: true,
        fields: ["kdsatker", "tahun"],
      },
    ],
  }
);
export default DataProfil;
