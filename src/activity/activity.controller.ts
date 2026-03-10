import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Activity')
@UseGuards(JwtAuthGuard)
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.activityService.findAll(
      user.id,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }
}
