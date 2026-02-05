import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/config/db.config";

type RefPangkatAttributes = {
  id: number;
  kdgol: string;
  nmgol: string;
  kdgapok: string;
  nama: string;
};
type RefPangkatCreationAttributes = Optional<RefPangkatAttributes, "id">;

class RefPangkat
  extends Model<RefPangkatAttributes, RefPangkatCreationAttributes>
  implements RefPangkatAttributes
{
  public id!: number;
  public kdgol!: string;
  public nmgol!: string;
  public kdgapok!: string;
  public nama!: string;
}

RefPangkat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kdgol: {
      type: DataTypes.STRING(2),
      validate: {
        len: [2, 2],
      },
    },
    nmgol: {
      type: DataTypes.STRING(16),
      validate: {
        notEmpty: true,
      },
    },
    kdgapok: {
      type: DataTypes.STRING(2),
      validate: {
        len: [2, 2],
      },
    },
    nama: {
      type: DataTypes.STRING(32),
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    sequelize,
    tableName: "ref_pangkat",
    timestamps: false,
    modelName: "RefPangkat",
  }
);

export default RefPangkat;
