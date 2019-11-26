import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as config from 'config'

const db = config.get('db')

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: db.type,
  host: process.env.RDS_HOSTNAME || db.host,
  port: process.env.RDS_PORT || db.port,
  username: process.env.RDS_USERNAME || db.username,
  password: process.env.RDS_PASSWORD || db.password,
  database: process.env.RDS_DB_NAME || db.database,
  entities: [__dirname + '/../**/*.entity.js'],
  synchronize: process.env.TYPEORM_SYNC || db.synchronize,
}
