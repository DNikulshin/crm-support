import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger';
import { AppService } from './app.service';
import type { Response } from 'express';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is running' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('api/docs-json')
  @ApiExcludeEndpoint()
  async downloadApiDocsJson(@Res() res: Response) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="crm-api-docs.json"');
    
    // Return a message indicating the endpoint exists
    res.json({
      message: 'API documentation download endpoint - JSON format',
      note: 'The actual OpenAPI specification is available via the direct endpoint',
      swagger_ui: '/api/docs',
      download_yaml: '/api/docs-yaml'
    });
  }

  @Get('api/docs-yaml')
  @ApiExcludeEndpoint()
  async downloadApiDocsYaml(@Res() res: Response) {
    res.setHeader('Content-Type', 'application/x-yaml');
    res.setHeader('Content-Disposition', 'attachment; filename="crm-api-docs.yaml"');
    
    const yamlContent = `# CRM Support System API Documentation
# Generated: ${new Date().toISOString()}
# Swagger UI available at: /api/docs
# JSON download: /api/docs-json
# YAML download: /api/docs-yaml

# Note: This is a placeholder. The actual OpenAPI specification
# is served via the main.ts HTTP adapter endpoints.`;
    
    res.send(yamlContent);
  }
}
