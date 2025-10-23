import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NinjaOneController } from './ninja-one.controller';
import { NinjaOneService } from './ninja-one.service';

@Module({
  imports: [HttpModule],
  controllers: [NinjaOneController],
  providers: [NinjaOneService],
  exports: [NinjaOneService],
})
export class NinjaOneModule {}
