import logger from '@/shared/core/logger';

export async function logUpdate<T>(
  entityName: string,
  id: string | number,
  before: T,
  after: Partial<T>,
  userId?: string | number,
): Promise<void> {
  logger.info(`[${entityName}] UPDATE id=${id}`);
  logger.info(`Before:`, before);
  logger.info(`After:`, after);
  if (userId) logger.info(`Changed by: userId=${userId}`);
}

export async function logDelete<T>(
  entityName: string,
  id: string | number,
  before: T,
  userId?: string | number,
): Promise<void> {
  logger.info(`[${entityName}] DELETE id=${id}`);
  logger.info(`Before delete:`, before);
  if (userId) logger.info(`Deleted by: userId=${userId}`);
}
