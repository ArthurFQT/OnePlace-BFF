import 'dotenv/config';

import path from 'path';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'mydb',
  synchronize: false,
  logging: true,
  entities: [
    process.env.NODE_ENV === 'development'
      ? path.resolve(__dirname, '../../../../modules/**/entities/*.ts')
      : path.resolve(__dirname, '../../../../modules/**/entities/*.js'),
  ],
  migrations: [
    process.env.NODE_ENV === 'development'
      ? path.resolve(__dirname, '../migrations/*.ts')
      : path.resolve(__dirname, '../migrations/*.js'),
  ],
});
