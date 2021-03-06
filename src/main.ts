import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as config from 'config'
import { Logger, ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const serverConfig = config.get('server')

  const logger = new Logger('bootstrap')
  const app = await NestFactory.create(AppModule)

  if (process.env.NODE_ENV === 'development') {
    app.enableCors()  
  } else { 
    app.enableCors({ origin: serverConfig.origin })
    logger.log(`Accepting requests from origin ${serverConfig.origin}`)
  }

  app.useGlobalPipes(new ValidationPipe())
  
  const port = process.env.PORT || serverConfig.port || 3000
  await app.listen(port);
  logger.log(`Application listening on port ${port}`)
}
bootstrap()
