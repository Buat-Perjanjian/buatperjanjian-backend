import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClausesService } from './clauses.service';
import { ContractType } from '@prisma/client';

@ApiTags('Clauses')
@Controller('clauses')
export class ClausesController {
  constructor(private readonly clausesService: ClausesService) {}

  @Get()
  findAll(@Query('contract_type') contractType?: ContractType) {
    return this.clausesService.findAll(contractType);
  }
}
