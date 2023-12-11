import User, { associate as associateUser } from "./user";
import Post, { associate as associatePost } from "./post";
import Image, { associate as associateImage } from "./image";
import Comment, { associate as associateComment } from "./comment";
import Hashtag, { associate as associateHashtag } from "./hashtag";

export * from "./sequelize";

const db = {
  User,
  Post,
  Image,
  Comment,
  Hashtag,
};

export type dbType = typeof db;

associateUser(db);
associatePost(db);
associateImage(db);
associateComment(db);
associateHashtag(db);
