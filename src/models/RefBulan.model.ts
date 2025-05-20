import sequelize from "@/config/db.config";
import { Model, DataTypes, Optional } from "sequelize";

type RefBulanAttributes = {
  id: number;
  kode: string;
  bulan: string;
};

type RefBulanCreationAttributes = Optional<RefBulanAttributes, "id">;

class RefBulan
  extends Model<RefBulanAttributes, RefBulanCreationAttributes>
  implements RefBulanAttributes
{
  public id!: number;
  public kode!: string;
  public bulan!: string;
}

RefBulan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kode: {
      type: DataTypes.STRING(2),
      validate: {
        is: {
          args: /^[0]{1}[1-9]{1}|[1]{1}[0-4]{1}$/,
          msg: "Format Bulan Salah",
        },
      },
    },
    bulan: {
      type: DataTypes.STRING(50),
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    sequelize,
    tableName: "ref_bulan",
    modelName: "RefBulan",
  }
);

export default RefBulan;
