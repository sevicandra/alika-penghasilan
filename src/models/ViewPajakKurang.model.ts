import sequelize from "@/config/db.config";
import { Model, DataTypes } from "sequelize";

type ViewPajakKurangAttributes = {
  tahun: string;
  nip: string;
  gapok: number;
  tistri: number;
  tanak: number;
  tumum: number;
  tstruktur: number;
  tfungsi: number;
  tberas: number;
  bulat: number;
  tpapua: number;
  tpajak: number;
};

class ViewPajakKurang extends Model<ViewPajakKurangAttributes> {
  public tahun!: string;
  public nip!: string;
  public gapok!: number;
  public tistri!: number;
  public tanak!: number;
  public tumum!: number;
  public tstruktur!: number;
  public tfungsi!: number;
  public tberas!: number;
  public bulat!: number;
  public tpapua!: number;
  public tpajak!: number;
}

ViewPajakKurang.init(
  {
    tahun: {
      type: DataTypes.STRING(4),
      primaryKey: true,
    },
    nip: {
      type: DataTypes.STRING(18),
      primaryKey: true,
    },
    gapok: {
      type: DataTypes.DOUBLE(12, 0),
      primaryKey: false,
    },
    tistri: {
      type: DataTypes.DOUBLE(12, 0),
      primaryKey: false,
    },
    tanak: {
      type: DataTypes.DOUBLE(12, 0),
      primaryKey: false,
    },
    tumum: {
      type: DataTypes.DOUBLE(12, 0),
      primaryKey: false,
    },
    tstruktur: {
      type: DataTypes.DOUBLE(12, 0),
      primaryKey: false,
    },
    tfungsi: {
      type: DataTypes.DOUBLE(12, 0),
      primaryKey: false,
    },
    tberas: {
      type: DataTypes.DOUBLE(12, 0),
      primaryKey: false,
    },
    bulat: {
      type: DataTypes.DOUBLE(12, 0),
      primaryKey: false,
    },
    tpapua: {
      type: DataTypes.DOUBLE(12, 0),
      primaryKey: false,
    },
    tpajak: {
      type: DataTypes.DOUBLE(12, 0),
      primaryKey: false,
    },
  },
  {
    sequelize,
    tableName: "view_pajak_kurang",
    timestamps: false,
    freezeTableName: true,
    modelName: "ViewPajakKurang",
  }
);
export default ViewPajakKurang;
