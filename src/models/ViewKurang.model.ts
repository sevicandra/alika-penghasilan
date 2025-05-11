import sequelize from "@/config/db.config";
import { Model, DataTypes, Op, Optional, BelongsTo } from "sequelize";
import RefBulan from "./RefBulan.model";

type ViewKurangAttributes = {
  bulan: string;
  tahun: string;
  nip: string;
  bruto: number;
  potongan: number;
  netto: number;
};

class ViewKurang
  extends Model<ViewKurangAttributes>
  implements ViewKurangAttributes
{
  public bulan!: string;
  public tahun!: string;
  public nip!: string;
  public bruto!: number;
  public potongan!: number;
  public netto!: number;

  public Bulan?: RefBulan;

  public static associations: {
    Bulan: BelongsTo<ViewKurang, RefBulan>;
  };
}

ViewKurang.init(
  {
    bulan: {
      type: DataTypes.STRING(2),
      primaryKey: true,
    },
    tahun: {
      type: DataTypes.STRING(4),
      primaryKey: true,
    },
    nip: {
      type: DataTypes.STRING(18),
      primaryKey: true,
    },
    bruto: {
      type: DataTypes.DOUBLE(12, 0),
      primaryKey: false,
    },
    potongan: {
      type: DataTypes.DOUBLE(12, 0),
      primaryKey: false,
    },
    netto: {
      type: DataTypes.DOUBLE(12, 0),
      primaryKey: false,
    },
  },
  {
    sequelize,
    tableName: "view_gaji",
    timestamps: false,
    freezeTableName: true,
    modelName: "ViewKurang",
    scopes: {
      rekap: {
        attributes: [
          [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
          [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
        ],
      },
    },
  }
);

ViewKurang.belongsTo(RefBulan, {
  foreignKey: "bulan",
  targetKey: "bulan",
  as: "Bulan",
});
export default ViewKurang;
