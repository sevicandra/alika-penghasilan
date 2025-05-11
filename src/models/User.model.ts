import sequelize from "@/config/db.config";
import { Model, Optional, DataTypes } from "sequelize";

type UserAttributes = {
    id: string;
    nip: string;
};

type UserCreationAttributes = Optional<UserAttributes, "id">;

class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: string;
  public nip!: string;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    nip: {
      type: DataTypes.STRING(18),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);

export default User