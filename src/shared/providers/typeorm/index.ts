import { DataSource } from 'typeorm';

import ormConfig from './config/ormConfig';

export default async (): Promise<DataSource> => {
  const config = ormConfig;

  console.log('Connecting to database...');
  return await config.initialize();
};
