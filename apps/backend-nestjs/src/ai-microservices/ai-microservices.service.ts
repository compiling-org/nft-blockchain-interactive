import { Injectable } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import * as ai_microservices from './proto/ai-microservices';

@Injectable()
export class AiMicroservicesService {
  @GrpcMethod('AiMicroservicesService', 'ProcessText')
  processText(data: ai_microservices.ai_microservices.ProcessTextRequest): ai_microservices.ai_microservices.ProcessTextResponse {
    console.log('Processing text:', data.text);
    // Placeholder for actual AI text processing logic
    return ai_microservices.ai_microservices.ProcessTextResponse.create({ processedText: `Processed: ${data.text}`, keywords: ['text', 'processing'] });
  }

  @GrpcMethod('AiMicroservicesService', 'AnalyzeImage')
  analyzeImage(data: ai_microservices.ai_microservices.AnalyzeImageRequest): ai_microservices.ai_microservices.AnalyzeImageResponse {
    console.log('Analyzing image with format:', data.imageFormat);
    // Placeholder for actual AI image analysis logic
    return ai_microservices.ai_microservices.AnalyzeImageResponse.create({ analysisResult: 'Image analysis complete', detectedObjects: ['object1', 'object2'] });
  }
}
