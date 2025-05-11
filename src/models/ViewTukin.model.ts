import sequelize from "@/config/db.config";
import { Model, DataTypes, BelongsTo } from "sequelize";
import RefBulan from "./RefBulan.model";

type ViewTukinAttributes = {
  bulan: string;
  tahun: string;
  nip: string;
  bruto: number;
  potongan: number;
  netto: number;
};

class ViewTukin
  extends Model<ViewTukinAttributes>
  implements ViewTukinAttributes
{
  public bulan!: string;
  public tahun!: string;
  public nip!: string;
  public bruto!: number;
  public potongan!: number;
  public netto!: number;

  public static associations: {
    Bulan: BelongsTo<ViewTukin, RefBulan>;
  };
  public Bulan!: BelongsTo<ViewTukin, RefBulan>;
}

ViewTukin.init(
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
      type: DataTypes.DOUBLE(22, 0),
      primaryKey: false,
    },
    potongan: {
      type: DataTypes.DOUBLE(15, 0),
      primaryKey: false,
    },
    netto: {
      type: DataTypes.DOUBLE(22, 0),
      primaryKey: false,
    },
  },
  {
    sequelize,
    tableName: "view_tukin",
    timestamps: false,
    freezeTableName: true,
    modelName: "ViewTukin",
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

ViewTukin.belongsTo(RefBulan, {
  foreignKey: "bulan",
  targetKey: "kode",
  as: "Bulan",
});

export default ViewTukin;
