// shared/http/decorators/methods/Get.ts
import { Route } from '../Route';

export const Delete = (path: string) => Route('delete', path);
