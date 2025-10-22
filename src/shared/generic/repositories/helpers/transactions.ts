import { DataSource, EntityManager } from 'typeorm';

export async function withTransaction<T>(
  dataSource: DataSource,
  callback: (manager: EntityManager) => Promise<T>,
): Promise<T> {
  return await dataSource.transaction(callback);
}

/**
 * Exemple usage:
 * import { withTransaction } from '../shared/database/helpers/transaction';
 * import { dataSource } from '../shared/infra/typeorm';
 *
 * await withTransaction(dataSource, async (manager) => {
 * const userRepo = manager.getRepository(User);
 * const permissionRepo = manager.getRepository(Permission)
 *
 * await userRepo.update(id, { ... });
 * await permissionRepo.save(...);
 * });
 */
