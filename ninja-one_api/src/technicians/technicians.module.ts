import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Technician } from './entities/technician.entity';
import { TechniciansController } from './controllers/technicians.controller';
import { TechniciansService } from './services/technicians.service';
import { TechniciansSyncService } from './services/technicians-sync.service';

@Module({
  imports: [TypeOrmModule.forFeature([Technician]), HttpModule],
  controllers: [TechniciansController],
  providers: [TechniciansService, TechniciansSyncService],
  exports: [TechniciansService, TechniciansSyncService],
})
export class TechniciansModule {}
