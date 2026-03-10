import { Controller, Get, Param, Query } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { ContractType } from '../../generated/prisma/client.js';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  findAll(@Query('contract_type') contractType?: ContractType) {
    return this.templatesService.findAll(contractType);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.templatesService.findOne(id);
  }
}
