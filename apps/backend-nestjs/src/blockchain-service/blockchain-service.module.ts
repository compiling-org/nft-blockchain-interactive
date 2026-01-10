import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain-service.service';

@Module({
  providers: [BlockchainService],
  exports: [BlockchainService],
})
export class BlockchainServiceModule {}
