import { ApiProperty } from '@/shared/http/docs/decorators/ApiProperty';

export class ErrorResponse {
  /** Mensagem de erro para o cliente */
  @ApiProperty()
  message!: string;

  /** Tipo de erro: validation, auth, infra... */
  @ApiProperty()
  type?: string;
}
