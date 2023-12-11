import { Model, DataTypes } from "sequelize";

import { dbType } from "./index";
import { sequelize } from "./sequelize";

class Post extends Model {
  public readonly id!: number;
  public content!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Post.init(
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Post",
    tableName: "post",
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
  }
);

export const associate = (db: dbType) => {
  db.Post.belongsTo(db.User);
  db.Post.belongsToMany(db.Hashtag);
  db.Post.hasMany(db.Comment);
  db.Post.hasMany(db.Image);
};

export default Post;
