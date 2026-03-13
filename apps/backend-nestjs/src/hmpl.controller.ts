import { Controller, Get, Query } from '@nestjs/common';

@Controller('hmpl')
export class HmplController {
  @Get('template')
  getTemplate(@Query('emotion') emotion: string): string {
    return `
      <div class="emotional-nft-display" data-emotion="${emotion || 'neutral'}">
        <h3>Emotional State: ${emotion || 'Neutral'}</h3>
        <div class="visualization">
          <!-- HMPL dynamic content -->
          <p>This content is rendered server-side based on emotional data.</p>
        </div>
      </div>
    `;
  }
}
