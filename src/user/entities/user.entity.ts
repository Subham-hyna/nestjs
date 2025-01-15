import { Task } from "src/task/entities/task.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RoleEnum } from "../enum/roles.enum";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({unique: true})
    email: string

    @Column({type: 'enum', enum: RoleEnum, default: RoleEnum.USER})
    role: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => Task, (task) => task.user, { cascade: true, onDelete: 'CASCADE' })
    tasks: Task[]
}
