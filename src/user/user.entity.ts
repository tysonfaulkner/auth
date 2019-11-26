import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Unique,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IsEmail } from 'class-validator'

@Entity('user')
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsEmail()
  email: string

  @Column()
  hash: string

  @Column('simple-array', { nullable: true })
  roles: string[]

  @CreateDateColumn({ type: 'timestamptz' })
  joinDate: Date

  @Column({ default: false })
  emailVerified: boolean

  @Column({ default: false })
  deleted: boolean

  @Column({ default: true })
  enabled: boolean
}

@Entity('email_verification')
export class EmailVerification extends BaseEntity {
  @PrimaryColumn()
  user: number

  @Column()
  code: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  modifiedDate: Date
}

@Entity('reset_password')
export class ResetPassword extends BaseEntity {
  @PrimaryColumn()
  user: number

  @Column()
  code: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date
}