import logger from '@/shared/core/logger';

export async function userCreatedHandler(data: any) {
  logger.info('👤 Novo usuário criado:', data);
}
