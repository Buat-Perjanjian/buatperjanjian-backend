import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Companies')
@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateCompanyDto) {
    return this.companiesService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.companiesService.findAllByUser(user.id);
  }
}
