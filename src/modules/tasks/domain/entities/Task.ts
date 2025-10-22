import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Category } from './Category';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status!: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority!: TaskPriority;

  @Column({ type: 'uuid', nullable: true })
  category_id?: string | null;

  @ManyToOne(() => Category, category => category.tasks, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category?: Category | null;

  @Column({ type: 'timestamp', nullable: true })
  started_at?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  completed_at?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  due_date?: Date | null;

  @Column({ type: 'int', nullable: true })
  estimated_minutes?: number | null;

  @Column({ type: 'int', nullable: true })
  actual_minutes?: number | null;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Método para calcular duração da tarefa
  getDurationInMinutes(): number | null {
    if (this.started_at && this.completed_at) {
      return Math.round((this.completed_at.getTime() - this.started_at.getTime()) / (1000 * 60));
    }
    return null;
  }

  // Método para verificar se a tarefa está atrasada
  isOverdue(): boolean {
    if (!this.due_date) return false;
    return new Date() > this.due_date && this.status !== TaskStatus.COMPLETED;
  }

  // Método para marcar como iniciada
  start(): void {
    if (this.status === TaskStatus.PENDING) {
      this.status = TaskStatus.IN_PROGRESS;
      this.started_at = new Date();
    }
  }

  // Método para marcar como completada
  complete(): void {
    this.status = TaskStatus.COMPLETED;
    this.completed_at = new Date();
    if (this.started_at) {
      this.actual_minutes = this.getDurationInMinutes();
    }
  }

  // Método para marcar como falhada
  fail(): void {
    this.status = TaskStatus.FAILED;
    this.completed_at = new Date();
    if (this.started_at) {
      this.actual_minutes = this.getDurationInMinutes();
    }
  }
}
