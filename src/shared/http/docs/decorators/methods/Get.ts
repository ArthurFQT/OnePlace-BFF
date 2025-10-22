// shared/http/decorators/methods/Get.ts
import { Route } from '../Route';

export const Get = (path: string) => Route('get', path);
