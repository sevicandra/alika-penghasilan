import sequelize from "@/config/db.config";
import { DataTypes, Op, Optional, Model } from "sequelize";

type DataUnitPegawaiAttributes = {
  id: number;
  kdsatker: string;
  nip: string;
  nama: string;
};

type DataUnitPegawaiCreationAttributes = Optional<
  DataUnitPegawaiAttributes,
  "id"
>;

export class DataUnitPegawai
  extends Model<DataUnitPegawaiAttributes, DataUnitPegawaiCreationAttributes>
  implements DataUnitPegawaiAttributes
{
  id!: number;
  kdsatker!: string;
  nip!: string;
  nama!: string;
}

DataUnitPegawai.init(
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
    nip: {
      type: DataTypes.STRING(18),
      validate: {
        isNumeric: true,
        len: [18, 18],
      },
    },
    nama: {
      type: DataTypes.STRING(128),
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    sequelize,
    tableName: "data_unit_pegawai",
    timestamps: false,
    modelName: "DataUnitPegawai",
  }
);
export default DataUnitPegawai;
