export interface LogMeta {
  level?: string;
  message?: string;
  route?: string;
  method?: string;
  statusCode?: number;
  requestId?: string;
  request?: {
    body?: any;
    query?: any;
    params?: any;
    headers?: any;
  };
  response?: {
    statusCode?: number;
  };
  tracer?: {
    transactionId?: string;
    platform?: string;
    platformVersion?: string;
    sessionId?: string;
    ip?: string;
  };
}
