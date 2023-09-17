import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cors=require("cors");
  const corsOptions ={
     origin:'*', 
     credentials:true,            //access-control-allow-credentials:true
     optionSuccessStatus:200,
  }
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  )
  app.use(cors(corsOptions)) // Use this after the variable declaration
  await app.listen(3333);
  
}
bootstrap();
