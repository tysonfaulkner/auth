import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Unique } from 'typeorm'
import { IsEmail, IsDate } from 'class-validator'

@Entity('user')
@Unique(['email'])
export class User extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsEmail()
  email: string

  @Column()
  hash: string

  @Column()
  @IsDate()
  joinDate: Date

  @Column()
  emailVerified: boolean

  @Column()
  emailToken: string
}