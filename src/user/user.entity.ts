import {
  Entity,
  PrimaryColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IsEmail } from 'class-validator'
import { Uuid, Hash } from '../shared'

@Entity('user')
@Unique(['email'])
export class User {
  @PrimaryColumn('uuid')
  id: Uuid

  @Column()
  @IsEmail()
  email: string

  @Column()
  hash: Hash

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
export class EmailVerification {
  @PrimaryColumn('uuid')
  user: Uuid

  @Column()
  code: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  modifiedDate: Date
}

@Entity('reset_password')
export class ResetPassword {
  @PrimaryColumn('uuid')
  user: Uuid

  @Column()
  code: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date
}