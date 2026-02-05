import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/config/db.config";

type RefSptTahunanAttributes = {
  id: number;
  tahun: string;
  ptkp_wp: number;
  ptkp_istri: number;
  ptkp_anak: number;
  iuran_pensiun: number;
  biaya_jabatan: number;
  biaya_jabatan_maks: number;
  pph_tarif_1: number;
  pph_tarif_2: number;
  pph_tarif_3: number;
  pph_tarif_4: number;
  pph_limit_1: number;
  pph_limit_2: number;
  pph_limit_3: number;
};

type RefSptTahunanCreationAttributes = Optional<RefSptTahunanAttributes, "id">;

class RefSptTahunan
  extends Model<RefSptTahunanAttributes, RefSptTahunanCreationAttributes>
  implements RefSptTahunanAttributes
{
  public id!: number;
  public tahun!: string;
  public ptkp_wp!: number;
  public ptkp_istri!: number;
  public ptkp_anak!: number;
  public iuran_pensiun!: number;
  public biaya_jabatan!: number;
  public biaya_jabatan_maks!: number;
  public pph_tarif_1!: number;
  public pph_tarif_2!: number;
  public pph_tarif_3!: number;
  public pph_tarif_4!: number;
  public pph_limit_1!: number;
  public pph_limit_2!: number;
  public pph_limit_3!: number;
}

RefSptTahunan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tahun: {
      type: DataTypes.STRING(4),
      unique: true,
      validate: {
        isNumeric: true,
        len: [4, 4],
      },
    },
    ptkp_wp: {
      type: DataTypes.DOUBLE(15, 0),
      defaultValue: 0,
    },
    ptkp_istri: {
      type: DataTypes.DOUBLE(15, 0),
      defaultValue: 0,
    },
    ptkp_anak: {
      type: DataTypes.DOUBLE(15, 0),
      defaultValue: 0,
    },
    iuran_pensiun: {
      type: DataTypes.FLOAT(4, 2),
      defaultValue: 0,
    },
    biaya_jabatan: {
      type: DataTypes.FLOAT(4, 2),
      defaultValue: 0,
    },
    biaya_jabatan_maks: {
      type: DataTypes.DOUBLE(15, 0),
      defaultValue: 0,
    },
    pph_tarif_1: {
      type: DataTypes.FLOAT(4, 2),
      defaultValue: 0,
    },
    pph_tarif_2: {
      type: DataTypes.FLOAT(4, 2),
      defaultValue: 0,
    },
    pph_tarif_3: {
      type: DataTypes.FLOAT(4, 2),
      defaultValue: 0,
    },
    pph_tarif_4: {
      type: DataTypes.FLOAT(4, 2),
      defaultValue: 0,
    },
    pph_limit_1: {
      type: DataTypes.DOUBLE(15, 0),
      defaultValue: 0,
    },
    pph_limit_2: {
      type: DataTypes.DOUBLE(15, 0),
      defaultValue: 0,
    },
    pph_limit_3: {
      type: DataTypes.DOUBLE(15, 0),
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "ref_spt_tahunan",
    timestamps: false,
    modelName: "RefSptTahunan",
  }
);

export default RefSptTahunan;
