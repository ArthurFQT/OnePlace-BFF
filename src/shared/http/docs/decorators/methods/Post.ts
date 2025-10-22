// shared/http/decorators/methods/Get.ts
import { Route } from '../Route';

export const Post = (path: string) => Route('post', path);
