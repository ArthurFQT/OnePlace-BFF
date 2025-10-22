// import logger from '@/shared/core/logger';

export async function logUpdate<T>(
  entityName: string,
  id: string | number,
  before: T,
  after: Partial<T>,
  userId?: string | number,
): Promise<void> {
  console.log(`[${entityName}] UPDATE id=${id}`);
  console.log(`Before:`, before);
  console.log(`After:`, after);
  if (userId) console.log(`Changed by: userId=${userId}`);
}

export async function logDelete<T>(
  entityName: string,
  id: string | number,
  before: T,
  userId?: string | number,
): Promise<void> {
  console.log(`[${entityName}] DELETE id=${id}`);
  console.log(`Before delete:`, before);
  if (userId) console.log(`Deleted by: userId=${userId}`);
}
