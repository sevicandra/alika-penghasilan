import sequelize from "@/config/db.config";
import { Model, DataTypes, BelongsTo } from "sequelize";
import RefBulan from "./RefBulan.model";

type TukinRutinAttributes = {
  bulan: string;
  tahun: string;
  nip: string;
  bruto: number;
  potongan: number;
  netto: number;
};

class TukinRutin
  extends Model<TukinRutinAttributes>
  implements TukinRutinAttributes
{
  public bulan!: string;
  public tahun!: string;
  public nip!: string;
  public bruto!: number;
  public potongan!: number;
  public netto!: number;
  public static associations: {
    Bulan: BelongsTo<TukinRutin, RefBulan>;
  };
  public Bulan!: BelongsTo<TukinRutin, RefBulan>;
}

TukinRutin.init(
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

TukinRutin.belongsTo(RefBulan, {
  foreignKey: "bulan",
  targetKey: "kode",
  as: "Bulan",
});

export default TukinRutin;
