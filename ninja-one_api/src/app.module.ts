import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NinjaOneModule } from './ninja-one/ninja-one.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    NinjaOneModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
