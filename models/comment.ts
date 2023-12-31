import { Model, DataTypes } from "sequelize";

import { dbType } from "./index";
import { sequelize } from "./sequelize";

class Comment extends Model {
  public readonly id!: number;
  public content!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Comment.init(
  {
    content: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "Comment",
    tableName: "comment",
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
  }
);

export const associate = (db: dbType) => {
  db.Comment.belongsTo(db.User);
  db.Comment.belongsTo(db.Post);
};

export default Comment;
