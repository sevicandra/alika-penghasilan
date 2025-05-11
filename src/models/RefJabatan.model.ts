import sequelize from "@/config/db.config";
import { DataTypes, Model, Optional } from "sequelize";
type RefJabatanAttributes = {
  id: number;
  kode: string;
  nama: string;
};
type RefJabatanCreationAttributes = Optional<
  RefJabatanAttributes,
  "id"
>;

class RefJabatan extends Model<
  RefJabatanAttributes,
  RefJabatanCreationAttributes
> implements RefJabatanAttributes {
  public id!: number;
  public kode!: string;
  public nama!: string;
}

RefJabatan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kode: {
      type: DataTypes.STRING(5),
      validate: {
        isNumeric: true,
        len: [5, 5],
      }
    },
    nama: {
      type: DataTypes.STRING(128),
      validate:{
        notEmpty: true
      }
    },
  },
  {
    sequelize,
    tableName: "ref_jabatan",
    timestamps: false,
    modelName: "RefJabatan",
  }
);

export default RefJabatan;