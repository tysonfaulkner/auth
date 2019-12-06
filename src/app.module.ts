import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmConfig } from './config/typeorm.config'
import { UserModule } from './user/user.module'
import { Connection } from 'typeorm'

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), 
    UserModule
  ],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
