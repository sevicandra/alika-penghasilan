import { BelongsTo, DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/config/db.config";
import RefBulan from "./RefBulan.model";

type DataLemburAttributes = {
  id: string;
  bulan: string;
  tahun: string;
  kdsatker: string;
  kdanak: string;
  nip: string;
  gol: string;
  jhari1: number;
  jhari2: number;
  jhari3: number;
  jhari4: number;
  jhari5: number;
  jhari6: number;
  jhari7: number;
  jhari8: number;
  jhari9: number;
  jhari10: number;
  jhari11: number;
  jhari12: number;
  jhari13: number;
  jhari14: number;
  jhari15: number;
  jhari16: number;
  jhari17: number;
  jhari18: number;
  jhari19: number;
  jhari20: number;
  jhari21: number;
  jhari22: number;
  jhari23: number;
  jhari24: number;
  jhari25: number;
  jhari26: number;
  jhari27: number;
  jhari28: number;
  jhari29: number;
  jhari30: number;
  jhari31: number;
  jkerja: number;
  jlibur: number;
  jmakan: number;
  lembur: number;
  makan: number;
  pph: number;
  bruto: number;
  netto: number;
  keterangan: string;
};
type DataLemburCreationAttributes = Optional<
  DataLemburAttributes,
  | "id"
  | "keterangan"
  | "jhari1"
  | "jhari2"
  | "jhari3"
  | "jhari4"
  | "jhari5"
  | "jhari6"
  | "jhari7"
  | "jhari8"
  | "jhari9"
  | "jhari10"
  | "jhari11"
  | "jhari12"
  | "jhari13"
  | "jhari14"
  | "jhari15"
  | "jhari16"
  | "jhari17"
  | "jhari18"
  | "jhari19"
  | "jhari20"
  | "jhari21"
  | "jhari22"
  | "jhari23"
  | "jhari24"
  | "jhari25"
  | "jhari26"
  | "jhari27"
  | "jhari28"
  | "jhari29"
  | "jhari30"
  | "jhari31"
>;
class DataLembur
  extends Model<DataLemburAttributes, DataLemburCreationAttributes>
  implements DataLemburAttributes
{
  public id!: string;
  public bulan!: string;
  public tahun!: string;
  public kdsatker!: string;
  public kdanak!: string;
  public nip!: string;
  public gol!: string;
  public jhari1!: number;
  public jhari2!: number;
  public jhari3!: number;
  public jhari4!: number;
  public jhari5!: number;
  public jhari6!: number;
  public jhari7!: number;
  public jhari8!: number;
  public jhari9!: number;
  public jhari10!: number;
  public jhari11!: number;
  public jhari12!: number;
  public jhari13!: number;
  public jhari14!: number;
  public jhari15!: number;
  public jhari16!: number;
  public jhari17!: number;
  public jhari18!: number;
  public jhari19!: number;
  public jhari20!: number;
  public jhari21!: number;
  public jhari22!: number;
  public jhari23!: number;
  public jhari24!: number;
  public jhari25!: number;
  public jhari26!: number;
  public jhari27!: number;
  public jhari28!: number;
  public jhari29!: number;
  public jhari30!: number;
  public jhari31!: number;
  public jkerja!: number;
  public jlibur!: number;
  public jmakan!: number;
  public lembur!: number;
  public makan!: number;
  public pph!: number;
  public bruto!: number;
  public netto!: number;
  public keterangan!: string;

  public Bulan!: RefBulan;

  public static associations: {
    Bulan: BelongsTo<DataLembur, RefBulan>;
  };
}
DataLembur.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bulan: {
      type: DataTypes.STRING(2),
      validate: {
        is: {
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
    nip: {
      type: DataTypes.STRING(18),
      validate: {
        isNumeric: true,
        len: [18, 18],
      },
    },
    gol: {
      type: DataTypes.STRING(1),
      validate: {
        len: [1, 1],
        is: {
          args: /^[1-4]{1}$/,
          msg: "Format Golongan Salah",
        },
      },
    },
    jhari1: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari2: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari3: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari4: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari5: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari6: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari7: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari8: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari9: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari10: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari11: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari12: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari13: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari14: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari15: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari16: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari17: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari18: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari19: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari20: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari21: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari22: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari23: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari24: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari25: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari26: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari27: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari28: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari29: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari30: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jhari31: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    jkerja: {
      type: DataTypes.INTEGER(),
      defaultValue: 0,
    },
    jlibur: {
      type: DataTypes.INTEGER(),
      defaultValue: 0,
    },
    jmakan: {
      type: DataTypes.INTEGER(),
      defaultValue: 0,
    },
    lembur: {
      type: DataTypes.DOUBLE(15, 0),
      defaultValue: 0,
    },
    makan: {
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
    keterangan: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "data_lembur",
    timestamps: false,
    modelName: "DataLembur",
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

export default DataLembur;
