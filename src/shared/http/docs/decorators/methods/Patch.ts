// shared/http/decorators/methods/Get.ts
import { Route } from '../Route';

export const Patch = (path: string) => Route('patch', path);
