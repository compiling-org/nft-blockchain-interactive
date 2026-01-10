import { Controller, Get } from '@nestjs/common';

@Controller('hmpl')
export class HmplController {
  @Get('marketplace-vibe')
  getMarketplaceVibe() {
    // Returning HTML as expected by HMPL template engine
    return `
      <div class="p-4 bg-purple-900/40 border border-purple-500/30 rounded-lg">
        <h4 class="text-lg font-bold text-purple-300">Marketplace Vibe</h4>
        <p class="text-sm text-gray-300">The current emotional resonance of the marketplace is <strong>Strongly Positive</strong>.</p>
        <div class="mt-2 flex gap-2">
          <span class="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Valence: 0.85</span>
          <span class="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">Arousal: 0.62</span>
        </div>
      </div>
    `;
  }
}
