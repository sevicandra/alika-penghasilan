import sequelize from "@/config/db.config";
import { DataTypes, Model, Op, Optional, BelongsTo } from "sequelize";
import RefBulan from "./RefBulan.model";

type DataMakanAttributes = {
  id: number;
  bulan: string;
  tahun: string;
  kdsatker: string;
  kdanak: string;
  kdsubanak: string;
  nip: string;
  kdgol: string;
  jmlhari: number;
  tarif: number;
  bruto: number;
  pph: number;
  netto: number;
};

type DataMakanCreationAttributes = Optional<
  DataMakanAttributes,
  "id" | "kdanak" | "kdsubanak"
>;

class DataMakan
  extends Model<DataMakanAttributes, DataMakanCreationAttributes>
  implements DataMakanAttributes
{
  public id!: number;
  public bulan!: string;
  public tahun!: string;
  public kdsatker!: string;
  public kdanak!: string;
  public kdsubanak!: string;
  public nip!: string;
  public kdgol!: string;
  public jmlhari!: number;
  public tarif!: number;
  public bruto!: number;
  public pph!: number;
  public netto!: number;

  public static associations: {
    Bulan: BelongsTo<DataMakan, RefBulan>;
  };

  public Bulan!: BelongsTo<DataMakan, RefBulan>;
}

DataMakan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bulan: {
      type: DataTypes.STRING(2),
      validate: {
        id: {
          args: /^[0]{1}[1-9]{1}|[1]{1}[0-2]{1}$/,
          msg: "Format Bulan Salah",
        },
      },
    },
    tahun: {
      type: DataTypes.STRING(4),
      validate: {
        isNumeric: true,
        len: [4, 4],
      },
    },
    kdsatker: {
      type: DataTypes.STRING(6),
      validate: {
        isNumeric: true,
        len: [6, 6],
      },
    },
    kdanak: {
      type: DataTypes.STRING(2),
      validate: {
        len: [2, 2],
      },
    },
    kdsubanak: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    nip: {
      type: DataTypes.STRING(18),
      validate: {
        isNumeric: true,
        len: [18, 18],
      },
    },
    kdgol: {
      type: DataTypes.STRING(2),
      validate: {
        len: [2, 2],
      },
    },
    jmlhari: {
      type: DataTypes.DOUBLE(5, 0),
      defaultValue: 0,
    },
    tarif: {
      type: DataTypes.DOUBLE(15, 0),
      defaultValue: 0,
    },
    pph: {
      type: DataTypes.DOUBLE(15, 0),
      defaultValue: 0,
    },
    bruto: {
      type: DataTypes.DOUBLE(15, 0),
      defaultValue: 0,
    },
    netto: {
      type: DataTypes.DOUBLE(15, 0),
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "data_makan",
    timestamps: false,
    modelName: "DataMakan",
    scopes: {
      rekap: {
        attributes: [
          [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
          [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
        ],
      },
    },
  }
);
DataMakan.belongsTo(RefBulan, {
  foreignKey: "bulan",
  targetKey: "kode",
  as: "Bulan",
});

export default DataMakan;
