import sequelize from "@/config/db.config";
import { DataTypes, Model, Op, Optional, BelongsTo } from "sequelize";
type DataNomorAttributes = {
  id: number;
  kdsatker: string;
  no_urut_skp: string;
  ext_skp: string;
  no_urut_kp4: string;
  ext_kp4: string;
  no_urut_daftar: string;
  ext_daftar: string;
  no_urut_pph: string;
  ext_pph: string;
  no_urut_final: string;
  ext_final: string;
  tahun: string;
};
type DataNomorCreationAttributes = Optional<DataNomorAttributes, "id">;
class DataNomor
  extends Model<DataNomorAttributes, DataNomorCreationAttributes>
  implements DataNomorAttributes
{
  public id!: number;
  public kdsatker!: string;
  public no_urut_skp!: string;
  public ext_skp!: string;
  public no_urut_kp4!: string;
  public ext_kp4!: string;
  public no_urut_daftar!: string;
  public ext_daftar!: string;
  public no_urut_pph!: string;
  public ext_pph!: string;
  public no_urut_final!: string;
  public ext_final!: string;
  public tahun!: string;
}

DataNomor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kdsatker: {
      type: DataTypes.STRING(6),
      validate: {
        isNumeric: true,
        len: [6, 6],
      },
    },
    tahun: {
      type: DataTypes.STRING(4),
      validate: {
        isNumeric: true,
        len: [4, 4],
      },
    },
    no_urut_skp: {
      type: DataTypes.STRING(8),
      validate: {
        notEmpty: true,
      },
    },
    ext_skp: {
      type: DataTypes.STRING(128),
      validate: {
        notEmpty: true,
      },
    },
    no_urut_kp4: {
      type: DataTypes.STRING(8),
      validate: {
        notEmpty: true,
      },
    },
    ext_kp4: {
      type: DataTypes.STRING(128),
      validate: {
        notEmpty: true,
      },
    },
    no_urut_daftar: {
      type: DataTypes.STRING(8),
      validate: {
        notEmpty: true,
      },
    },
    ext_daftar: {
      type: DataTypes.STRING(128),
      validate: {
        notEmpty: true,
      },
    },
    no_urut_pph: {
      type: DataTypes.STRING(8),
      validate: {
        notEmpty: true,
      },
    },
    ext_pph: {
      type: DataTypes.STRING(128),
      validate: {
        notEmpty: true,
      },
    },
    no_urut_final: {
      type: DataTypes.STRING(8),
      validate: {
        notEmpty: true,
      },
    },
    ext_final: {
      type: DataTypes.STRING(128),
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    sequelize,
    tableName: "data_nomor",
    timestamps: false,
    modelName: "DataNomor",
    indexes: [
      {
        unique: true,
        fields: ["kdsatker", "tahun"],
      },
    ],
  }
);

export default DataNomor;
