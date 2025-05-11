import sequelize from "@/config/db.config";
import { Model, DataTypes, Optional, BelongsTo } from "sequelize";
import RefBulan from "./RefBulan.model";

type DataGajiAttributes = {
  id: string;
  kdjns: string;
  kdsatker: string;
  kdanak: string;
  kdsubanak: string | null;
  kdkawin: string;
  kdgapok: string;
  kdjab: string;
  bulan: string;
  tahun: string;
  nip: string;
  gapok: number;
  tistri: number;
  tanak: number;
  tumum: number;
  ttambumum: number;
  tstruktur: number;
  tfungsi: number;
  bulat: number;
  tberas: number;
  tpajak: number;
  pberas: number;
  tpapua: number;
  tpencil: number;
  tlain: number;
  iwp: number;
  pph: number;
  sewarmh: number;
  tunggakan: number;
  utanglebih: number;
  potlain: number;
  taperum: number;
  bpjs: number;
  bpjs2: number;
};

type DataGajiCreationAttributes = Optional<
  DataGajiAttributes,
  "id" | "kdanak" | "kdsubanak"
>;

class DataGaji
  extends Model<DataGajiAttributes, DataGajiCreationAttributes>
  implements DataGajiAttributes
{
  public id!: string;
  public kdjns!: string;
  public kdsatker!: string;
  public kdanak!: string;
  public kdsubanak!: string;
  public kdkawin!: string;
  public kdgapok!: string;
  public kdjab!: string;
  public bulan!: string;
  public tahun!: string;
  public nip!: string;
  public gapok!: number;
  public tistri!: number;
  public tanak!: number;
  public tumum!: number;
  public ttambumum!: number;
  public tstruktur!: number;
  public tfungsi!: number;
  public bulat!: number;
  public tberas!: number;
  public tpajak!: number;
  public pberas!: number;
  public tpapua!: number;
  public tpencil!: number;
  public tlain!: number;
  public iwp!: number;
  public pph!: number;
  public sewarmh!: number;
  public tunggakan!: number;
  public utanglebih!: number;
  public potlain!: number;
  public taperum!: number;
  public bpjs!: number;
  public bpjs2!: number;

  public Bulan!: RefBulan;

  public static associations: {
    Bulan: BelongsTo<DataGaji, RefBulan>;
  };
}

DataGaji.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kdjns: {
      type: DataTypes.STRING(1),
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
      }
    },
    kdsubanak: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    kdkawin: {
      type: DataTypes.STRING(4),
      validate: {
        is: {
          args: /^[1]{1}[0-1]{1}[0]{1}[0-3]{1}$/,
          msg: "Kode Kawin tidak valid",
        },
      },
    },
    kdgapok: {
      type: DataTypes.STRING(4),
      validate: {
        is: {
          args: /^([1-3]{1}[A-D]{1}|[4]{1}[A-E]{1})[0-9]{2}$/i,
          msg: "Kode Gapok tidak valid",
        },
      },
    },
    kdjab: {
      type: DataTypes.STRING(5),
      validate: {
        isNumeric: true,
        len: [5, 5],
      },
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
    nip: {
      type: DataTypes.STRING(18),
      validate: {
        isNumeric: true,
        len: [18, 18],
      },
    },
    gapok: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    tistri: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    tanak: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    tumum: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    ttambumum: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    tstruktur: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    tfungsi: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    bulat: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    tberas: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    tpajak: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    pberas: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    tpapua: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    tpencil: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    tlain: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    iwp: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    pph: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    sewarmh: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    tunggakan: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    utanglebih: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    potlain: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    taperum: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    bpjs: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
    bpjs2: {
      type: DataTypes.DOUBLE(12, 0),
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "data_gaji",
    timestamps: false,
    modelName: "DataGaji",
  }
);
DataGaji.belongsTo(RefBulan, {
  foreignKey: "bulan",
  targetKey: "kode",
  as: "Bulan",
});

export default DataGaji;
