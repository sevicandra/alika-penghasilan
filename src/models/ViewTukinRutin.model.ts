import { BelongsTo, DataTypes, Model } from "sequelize";
import sequelize from "@/config/db.config";
import RefBulan from "./RefBulan.model";

type ViewTukinRutinAttributes = {
  bulan: string;
  tahun: string;
  nip: string;
  bruto: number;
  potongan: number;
  netto: number;
};

class ViewTukinRutin extends Model<ViewTukinRutinAttributes> implements ViewTukinRutinAttributes {
  public bulan!: string;
  public tahun!: string;
  public nip!: string;
  public bruto!: number;
  public potongan!: number;
  public netto!: number;
  public static associations: {
    Bulan: BelongsTo<ViewTukinRutin, RefBulan>;
  };
  public Bulan!: BelongsTo<ViewTukinRutin, RefBulan>;
}

ViewTukinRutin.init(
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
    tableName: "view_tukin_rutin",
    timestamps: false,
    freezeTableName: true,
    modelName: "TukinRutin",
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

export default ViewTukinRutin;
