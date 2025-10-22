import { container } from 'tsyringe';
import { DataSource } from 'typeorm';

import AppDataSource from '@/shared/providers/typeorm';

export async function registerSharedProviders(): Promise<void> {
  const dataSource: DataSource = await AppDataSource();

  container.registerInstance<DataSource>('DataSource', dataSource);
}
