import { BelongsTo, DataTypes, Model } from "sequelize";
import sequelize from "@/config/db.config";
import RefBulan from "./RefBulan.model";

type ViewTukinKurangAttributes = {
  bulan: string;
  tahun: string;
  nip: string;
  bruto: number;
  potongan: number;
  netto: number;
};
class ViewTukinKurang
  extends Model<ViewTukinKurangAttributes>
  implements ViewTukinKurangAttributes
{
  public bulan!: string;
  public tahun!: string;
  public nip!: string;
  public bruto!: number;
  public potongan!: number;
  public netto!: number;

  public static associations: {
    Bulan: BelongsTo<ViewTukinKurang, RefBulan>;
  };

  public Bulan!: BelongsTo<ViewTukinKurang, RefBulan>;
}
ViewTukinKurang.init(
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
    tableName: "view_tukin_kurang",
    timestamps: false,
    freezeTableName: true,
    modelName: "ViewTukinKurang",
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

export default ViewTukinKurang;
