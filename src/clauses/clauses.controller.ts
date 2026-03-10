import { Controller, Get, Query } from '@nestjs/common';
import { ClausesService } from './clauses.service';
import { ContractType } from '../../generated/prisma/client.js';

@Controller('clauses')
export class ClausesController {
  constructor(private readonly clausesService: ClausesService) {}

  @Get()
  findAll(@Query('contract_type') contractType?: ContractType) {
    return this.clausesService.findAll(contractType);
  }
}
