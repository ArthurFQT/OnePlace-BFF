import path from 'path';

import logger from '@/shared/core/logger';
import { MailProvider } from '@/shared/providers/mail/services/MailProvider';

export async function mailHandler(data: any) {
  logger.info('📬 Enviando e-mail para:', data.to);

  const provider = new MailProvider();
  await provider.sendMail({
    to: data.to,
    subject: data.subject || 'Assunto padrão',
    templatePath: path.resolve(__dirname, '../../../shared/mail/templates/welcome.hbs'),
    variables: data.variables,
  });

  logger.info('📬 E-mail enviado com sucesso!');
}
