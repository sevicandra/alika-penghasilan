import sequelize from "@/config/db.config";
import { DataTypes, Model, Op, Optional } from "sequelize";
import RefBulan from "./RefBulan.model";

type DataTukinAttributes = {
  id: number;
  bulan: string;
  tahun: string;
  kdsatker: string;
  nip: string;
  grade: string;
  tjpokok: number;
  tjtamb: number;
  abspotr: number;
  abspotp: number;
  tkpph: number;
  potpph: number;
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  p5: number;
  p6: number;
  p7: number;
  p8: number;
  p9: number;
  p10: number;
  p11: number;
  p12: number;
  p13: number;
  p14: number;
  p15: number;
  p16: number;
  p17: number;
  p18: number;
  p19: number;
  p20: number;
  p21: number;
  p22: number;
};

type DataTukinCreationAttributes = Optional<
  DataTukinAttributes,
  | "id"
  | "p1"
  | "p2"
  | "p3"
  | "p4"
  | "p5"
  | "p6"
  | "p7"
  | "p8"
  | "p9"
  | "p10"
  | "p11"
  | "p12"
  | "p13"
  | "p14"
  | "p15"
  | "p16"
  | "p17"
  | "p18"
  | "p19"
  | "p20"
  | "p21"
  | "p22"
>;

class DataTukin
  extends Model<DataTukinAttributes, DataTukinCreationAttributes>
  implements DataTukinAttributes
{
  declare id: number;
  declare bulan: string;
  declare tahun: string;
  declare kdsatker: string;
  declare nip: string;
  declare grade: string;
  declare tjpokok: number;
  declare tjtamb: number;
  declare abspotr: number;
  declare abspotp: number;
  declare tkpph: number;
  declare potpph: number;
  declare p1: number;
  declare p2: number;
  declare p3: number;
  declare p4: number;
  declare p5: number;
  declare p6: number;
  declare p7: number;
  declare p8: number;
  declare p9: number;
  declare p10: number;
  declare p11: number;
  declare p12: number;
  declare p13: number;
  declare p14: number;
  declare p15: number;
  declare p16: number;
  declare p17: number;
  declare p18: number;
  declare p19: number;
  declare p20: number;
  declare p21: number;
  declare p22: number;
}

DataTukin.init(
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
          args: /^[0]{1}[1-9]{1}|[1]{1}[0-4]{1}$/,
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
    nip: {
      type: DataTypes.STRING(18),
      validate: {
        isNumeric: true,
        len: [18, 18],
      },
    },
    grade: {
      type: DataTypes.STRING(2),
      validate: {
        isNumeric: true,
        len: [2, 2],
      },
    },
    tjpokok: {
      type: DataTypes.DOUBLE(15, 0),
      defaultValue: 0,
    },
    tjtamb: {
      type: DataTypes.DOUBLE(15, 0),
      defaultValue: 0,
    },
    abspotr: {
      type: DataTypes.DOUBLE(15, 0),
      defaultValue: 0,
    },
    abspotp: {
      type: DataTypes.FLOAT(5, 2),
      defaultValue: 0,
    },
    tkpph: {
      type: DataTypes.DOUBLE(15, 0),
      defaultValue: 0,
    },
    potpph: {
      type: DataTypes.DOUBLE(15, 0),
      defaultValue: 0,
    },
    p1: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    p2: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    p3: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    p4: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    p5: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    p6: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    p7: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    p8: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    p9: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    p10: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    p11: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    p12: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    p13: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    p14: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    p15: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    p16: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    p17: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    p18: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    p19: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    p20: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    p21: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    p22: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "data_tukin",
    timestamps: false,
    modelName: "DataTukin",
  }
);

DataTukin.belongsTo(RefBulan, {
  foreignKey: "bulan",
  targetKey: "kode",
  as: "Bulan",
});

export default DataTukin;
