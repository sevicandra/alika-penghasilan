import sequelize from "@/config/db.config";
import { DataTypes, Model, Op, Optional, BelongsTo } from "sequelize";
import RefBulan from "./RefBulan.model";

type DataLainAttributes = {
  id: number;
  bulan: string;
  tahun: string;
  kdsatker: string;
  nip: string;
  bruto: number;
  pph: number;
  netto: number;
  jenis: string;
  uraian: string;
  tanggal: number;
  nospm: string | null;
};

type DataLainCreationAttributes = Optional<DataLainAttributes, "id" | "nospm">;

class DataLain
  extends Model<DataLainAttributes, DataLainCreationAttributes>
  implements DataLainAttributes
{
  public id!: number;
  public bulan!: string;
  public tahun!: string;
  public kdsatker!: string;
  public nip!: string;
  public bruto!: number;
  public pph!: number;
  public netto!: number;
  public jenis!: string;
  public uraian!: string;
  public tanggal!: number;
  public nospm!: string;

  public Bulan!: RefBulan;

  public static associations: {
    Bulan: BelongsTo<DataLain, RefBulan>;
  };
}

DataLain.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bulan: {
      type: DataTypes.STRING(2),
      validate: {
        is:{
          args:/^[0]{1}[1-9]{1}|[1]{1}[0-2]{1}$/,
          msg:"Format Bulan Salah"
        }
      }
    },
    tahun: {
      type: DataTypes.STRING(4),
      validate: {
        isNumeric: true,
        len: [4, 4],
      }
    },
    kdsatker: {
      type: DataTypes.STRING(6),
      validate: {
        isNumeric: true,
        len: [6, 6],
      }
    },
    nip: {
      type: DataTypes.STRING(18),
      validate: {
        isNumeric: true,
        len: [18, 18],
      }
    },
    bruto: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    pph: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    netto: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    jenis: {
      type: DataTypes.STRING(32),
    },
    uraian: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tanggal: {
      type: DataTypes.INTEGER,
    },
    nospm: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "data_lain",
    timestamps: false,
    modelName: "DataLain",
    scopes: {
      rekap: {
        group: ["jenis"],
        attributes: [
          [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
          [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
          [sequelize.col("jenis"), "jenis"],
        ],
      },
    },
  }
);

DataLain.belongsTo(RefBulan, {
  foreignKey: "bulan",
  targetKey: "kode",
  as: "Bulan",
});

export default DataLain;
