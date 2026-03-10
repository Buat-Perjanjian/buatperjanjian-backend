import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreatePaymentDto } from './dto/create-payment.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPayment(user.sub, dto.document_id);
  }

  @Post('webhook')
  webhook(@Body() body: { order_id: string; transaction_status: string }) {
    return this.paymentsService.handleWebhook(body);
  }
}
