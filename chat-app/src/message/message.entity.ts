import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
  } from 'typeorm';
  import { User } from '../user/user.entity';
  
  @Entity()
  export class Message {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    content: string;
  
    @CreateDateColumn()
    timestamp: Date;
  
    @ManyToOne(() => User, { eager: true })
    sender: User;
  
    @ManyToOne(() => User, { eager: true })
    receiver: User;
  }
  