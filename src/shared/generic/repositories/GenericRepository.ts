import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { IGenericRepository } from './IGenericRepository';
import { logDelete, logUpdate } from './logger/auditLogger';

// 🔧 Utilitários internos
function sanitizeWhere<T extends ObjectLiteral>(obj?: T): T {
  if (!obj) return {} as T;
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined)) as T;
}

function sanitizeOptions<T extends ObjectLiteral>(obj?: T): T {
  if (!obj) return {} as T;
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null),
  ) as T;
}

export function sanitizeForSoftUpdate<T extends ObjectLiteral>(obj?: Partial<T>): DeepPartial<T> {
  if (!obj) return {} as DeepPartial<T>;

  const entries = Object.entries(obj).filter(([_, v]) => v !== undefined);
  return Object.fromEntries(entries) as DeepPartial<T>;
}

export class GenericRepository<T extends ObjectLiteral> implements IGenericRepository<T> {
  constructor(protected readonly ormRepo: Repository<T>) {}

  private get entityName(): string {
    return this.ormRepo.metadata.name;
  }

  async findAll(options: FindManyOptions<T> = {}): Promise<T[]> {
    const sanitized = {
      ...options,
      where: sanitizeWhere(options.where as T),
      skip: options.skip ?? 0,
      take: options.take ?? 100,
    };
    return this.ormRepo.find(sanitized);
  }

  async findById(id: string | number, options?: FindOneOptions<T>): Promise<T | null> {
    return (
      this.ormRepo.findOne({
        where: { id } as unknown as FindOptionsWhere<T>,
        ...sanitizeOptions(options),
      }) || null
    );
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return (
      this.ormRepo.findOne({
        ...options,
        where: sanitizeWhere(options.where as T),
      }) || null
    );
  }

  async findOneOrFail(options: FindOneOptions<T>): Promise<T> {
    return this.ormRepo.findOneOrFail({
      ...options,
      where: sanitizeWhere(options.where as T),
    });
  }

  async findAndCount(options: FindManyOptions<T> = {}): Promise<[T[], number]> {
    const sanitized = {
      ...options,
      where: sanitizeWhere(options.where as T),
      skip: options.skip ?? 0,
      take: options.take ?? 100,
    };
    return this.ormRepo.findAndCount(sanitized);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const created = this.ormRepo.create(data);
    return await this.ormRepo.save(created);
  }

  async updateSoft(id: string | number, data: Partial<T>, userId?: string | number): Promise<T> {
    const before = await this.findById(id);
    if (!before) throw new Error('Entity not found for update.');
    await this.ormRepo.update(
      id,
      sanitizeForSoftUpdate(data) as unknown as QueryDeepPartialEntity<T>,
    );
    const after = await this.findById(id);
    if (!after) throw new Error('Entity not found after update.');
    await logUpdate(this.entityName, id, before, data, userId);
    return after;
  }

  async updateHard(id: string | number, data: Partial<T>, userId?: string | number): Promise<T> {
    const before = await this.findById(id);
    if (!before) throw new Error('Entity not found for update.');
    await this.ormRepo.update(id, data);
    const after = await this.findById(id);
    if (!after) throw new Error('Entity not found after update.');
    await logUpdate(this.entityName, id, before, data, userId);
    return after;
  }

  async updateMerge(id: string | number, data: Partial<T>, userId?: string | number): Promise<T> {
    const before = await this.findById(id);
    if (!before) throw new Error('Entity not found for merge.');
    const merged = this.ormRepo.merge(before, sanitizeForSoftUpdate(data));
    const saved = await this.ormRepo.save(merged);
    await logUpdate(this.entityName, id, before, data, userId);
    return saved;
  }

  async delete(id: string | number, userId?: string | number): Promise<void> {
    const before = await this.findById(id);
    if (!before) throw new Error('Entity not found for delete.');
    await this.ormRepo.delete(id);
    await logDelete(this.entityName, id, before, userId);
  }
}
