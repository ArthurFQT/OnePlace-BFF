import { ApiProperty } from '@/shared/http/docs/decorators';

export class HttpErrorResponse {
  @ApiProperty()
  status!: number;
  @ApiProperty()
  message!: string;
  @ApiProperty()
  type?: 'validation' | 'auth' | 'infra';
}
