// shared/http/decorators/utils/getAllControllers.ts
import fg from 'fast-glob';
import path from 'path';

// import logger from '@/shared/core/logger';

export async function getAllControllers(): Promise<any[]> {
  const controllerFiles = await fg([
    'src/modules/**/useCases/**/**Controller.ts',
    'dist/modules/**/useCases/**/**Controller.js',
  ]);

  const controllers: any[] = [];

  for (const file of controllerFiles) {
    try {
      const modulePath = path.resolve(file);
      const mod = await import(modulePath);

      Object.values(mod).forEach(exported => {
        if (typeof exported === 'function') {
          controllers.push(exported);
        }
      });
    } catch (err) {
      // logger.error(`❌ Erro ao carregar controller em: ${file} ${err}`);
    }
  }

  // logger.info(
  //   `🔍 Controllers encontrados:`,
  //   controllers.map(c => c.name),
  // ); // log útil

  return controllers;
}
