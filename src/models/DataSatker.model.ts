import sequelize from "@/config/db.config";
import { DataTypes, Optional, Model } from "sequelize";

type DataSatkerAttributes = {
  id: number;
  kdsatker: string;
  nmsatker: string;
  header1: string;
  header2: string;
  subheader1: string;
  subheader2: string;
  subheader3: string;
  kota: string;
};
type DataSatkerCreationAttributes = Optional<
  DataSatkerAttributes,
  "id" | "header2" | "subheader2" | "subheader3"
>;

class DataSatker
  extends Model<DataSatkerAttributes, DataSatkerCreationAttributes>
  implements DataSatkerAttributes
{
  public id!: number;
  public kdsatker!: string;
  public nmsatker!: string;
  public header1!: string;
  public header2!: string;
  public subheader1!: string;
  public subheader2!: string;
  public subheader3!: string;
  public kota!: string;
}

DataSatker.init(
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
      }
    },
    nmsatker: {
      type: DataTypes.STRING(128),
      validate: {
        notEmpty: true,
      },
    },
    header1: {
      type: DataTypes.STRING(),
      validate: {
        notEmpty: true,
      },
    },
    header2: {
      type: DataTypes.STRING(),
      allowNull: true,
    },
    subheader1: {
      type: DataTypes.STRING(),
      validate: {
        notEmpty: true,
      },
    },
    subheader2: {
      type: DataTypes.STRING(),
      allowNull: true,
    },
    subheader3: {
      type: DataTypes.STRING(),
      allowNull: true,
    },
    kota: {
      type: DataTypes.STRING(),
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    sequelize,
    tableName: "data_satker",
    timestamps: false,
    modelName: "DataSatker",
  }
);
export default DataSatker;
