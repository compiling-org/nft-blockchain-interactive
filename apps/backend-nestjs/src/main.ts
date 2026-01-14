import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'ai_microservices',
      protoPath: join(process.cwd(), 'src/ai-microservices/proto/ai-microservices.proto'),
      url: 'localhost:5000',
    },
  });

  app.setGlobalPrefix('api');
  app.enableCors();

  await app.startAllMicroservices();
  await app.listen(3001); // Using 3001 to avoid conflict with Vite if any, though Vite is usually 5173
  console.log('NestJS server running on http://localhost:3001');
}
bootstrap();
