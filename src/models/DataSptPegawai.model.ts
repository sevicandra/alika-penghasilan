import sequelize from "@/config/db.config";
import {
  DataTypes,
  Optional,
  Model,
  BelongsTo,
} from "sequelize";
import RefPangkat from "./RefPangkat.model";
import RefJabatan from "./RefJabatan.model";

type DataSptPegawaiAttributes = {
  id: number;
  kdsatker: string;
  tahun: string;
  nip: string;
  npwp: string;
  kdgol: string;
  alamat: string;
  kdkawin: string;
  kdjab: string;
  nourut: number;
};
type DataSptPegawaiCreationAttributes = Optional<
  DataSptPegawaiAttributes,
  "id" | "nourut"
>;

class DataSptPegawai
  extends Model<DataSptPegawaiAttributes, DataSptPegawaiCreationAttributes>
  implements DataSptPegawaiAttributes
{
  public id!: number;
  public kdsatker!: string;
  public tahun!: string;
  public nip!: string;
  public npwp!: string;
  public kdgol!: string;
  public alamat!: string;
  public kdkawin!: string;
  public kdjab!: string;
  public nourut!: number;

  public Pangkat!: RefPangkat;
  public Jabatan?: RefJabatan;

  public static associations: {
    Pangkat: BelongsTo<DataSptPegawai, RefPangkat>;
    Jabatan: BelongsTo<DataSptPegawai, RefJabatan>;
  };
}

DataSptPegawai.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kdsatker: {
      type: DataTypes.STRING(6),
      validate: {
        isNumeric: true,
        len: [6, 6],
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
    npwp: {
      type: DataTypes.STRING(16),
      validate: {
        isNumeric: true,
        len: [16, 16],
      },
    },
    kdgol: {
      type: DataTypes.STRING(2),
      validate: {
        len: [2, 2],
      },
    },
    alamat: {
      type: DataTypes.STRING(),
      validate: {
        notEmpty: true,
      },
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
    kdjab: {
      type: DataTypes.STRING(5),
      validate: {
        len: [5, 5],
        isNumeric: true,
      },
    },
    nourut: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: "data_spt_pegawai",
    timestamps: false,
    modelName: "DataSptPegawai",
    indexes: [
      {
        unique: true,
        fields: ["tahun", "nip"],
      },
    ],
  }
);

DataSptPegawai.belongsTo(RefPangkat, {
  foreignKey: "kdgol",
  targetKey: "kdgol",
  as: "Pangkat",
});
DataSptPegawai.belongsTo(RefJabatan, {
  foreignKey: "kdjab",
  targetKey: "kode",
  as: "Jabatan",
});

export default DataSptPegawai;
