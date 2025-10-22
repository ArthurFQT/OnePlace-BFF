import { DeepPartial, FindManyOptions, FindOneOptions, ObjectLiteral } from 'typeorm';

export interface IGenericRepository<T extends ObjectLiteral> {
  findAll(options?: FindManyOptions<T>): Promise<T[]>;
  findById(id: string | number, options?: FindOneOptions<T>): Promise<T | null>;
  findOne(options: FindOneOptions<T>): Promise<T | null>;
  findOneOrFail(options: FindOneOptions<T>): Promise<T>;
  findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]>;

  create(data: DeepPartial<T>): Promise<T>;

  updateSoft(id: string | number, data: Partial<T>, userId?: string | number): Promise<T>;
  updateHard(id: string | number, data: Partial<T>, userId?: string | number): Promise<T>;
  updateMerge(id: string | number, data: Partial<T>, userId?: string | number): Promise<T>;

  delete(id: string | number, userId?: string | number): Promise<void>;
}
