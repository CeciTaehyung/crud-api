import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers : [RolesService],
})
export class RolesModule {}
//jajahacuendo apis esta tambien en el esfe 
//varias hasta llevo carpetas de eso, que pereza jaja
//la verdad , por cierto no s precocupe que media vez me salga ya no 