import _sequelize from 'sequelize';
const { Sequelize, DataTypes } = _sequelize;

import { Youtube } from "./models/Youtube.js";

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './share/laurou-feed-db.sqlite',
  logging: false
});

export const youtube = Youtube.init(sequelize, DataTypes);

await youtube.sync();
