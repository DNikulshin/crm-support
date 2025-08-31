import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as yaml from 'js-yaml';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Serve static files from uploads directory
  const uploadsPath = join(process.cwd(), 'uploads');
  console.log(`📁 Setting up static file serving from: ${uploadsPath}`);
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });
  
  // Enable CORS for frontend integration
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001'], // React dev server ports
    credentials: true,
  });
  
  // Enable validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('CRM Support System API')
    .setDescription('Complete CRM system for technical support with user management, ticket tracking, and role-based access control.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User authentication and registration')
    .addTag('Users', 'User management (Admin only)')
    .addTag('Tickets', 'Ticket management and support system')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'CRM Support System API Documentation',
    customfavIcon: '/favicon.ico',
    explorer: true,
    customCss: `
      .swagger-ui .topbar { display: none; }
      body { padding-top: 80px; }
      #download-links {
        position: fixed;
        top: 10px;
        right: 10px;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 5px;
        padding: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        z-index: 1000;
        font-family: sans-serif;
      }
      #download-links h4 {
        margin: 0 0 10px 0;
        color: #495057;
        font-size: 14px;
      }
      .download-buttons {
        display: flex;
        gap: 10px;
      }
      .download-btn {
        display: inline-block;
        padding: 8px 16px;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
      }
      .download-json {
        background: #007bff;
      }
      .download-yaml {
        background: #28a745;
      }
      .download-btn:hover {
        opacity: 0.8;
      }
    `,
    customJsStr: `
      window.addEventListener('DOMContentLoaded', function() {
        // Wait for Swagger UI to load
        setTimeout(function() {
          const downloadHtml = \`
            <div id="download-links">
              <h4>📥 Download API Documentation</h4>
              <div class="download-buttons">
                <a href="/api/docs-json" class="download-btn download-json" download="api-docs.json">📄 JSON</a>
                <a href="/api/docs-yaml" class="download-btn download-yaml" download="api-docs.yaml">📋 YAML</a>
              </div>
            </div>
          \`;
          
          // Remove existing download links if any
          const existing = document.getElementById('download-links');
          if (existing) {
            existing.remove();
          }
          
          // Add download links to body
          document.body.insertAdjacentHTML('afterbegin', downloadHtml);
        }, 500);
      });
    `,
  });

  // Add endpoint to download OpenAPI specification
  app.getHttpAdapter().get('/api/docs-json', (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="api-docs.json"');
    res.send(JSON.stringify(document, null, 2));
  });

  app.getHttpAdapter().get('/api/docs-yaml', (req: any, res: any) => {
    const yamlString = yaml.dump(document);
    res.setHeader('Content-Type', 'application/x-yaml');
    res.setHeader('Content-Disposition', 'attachment; filename="api-docs.yaml"');
    res.send(yamlString);
  });

  // Debug endpoint to list uploaded files
  app.getHttpAdapter().get('/api/uploads/list', (req: any, res: any) => {
    const fs = require('fs');
    const uploadsDir = join(process.cwd(), 'uploads');
    try {
      const files = fs.readdirSync(uploadsDir);
      const fileDetails = files.map((file: string) => {
        const filePath = join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          size: stats.size,
          url: `/uploads/${file}`,
          fullUrl: `http://localhost:${port}/uploads/${file}`
        };
      });
      res.json({
        uploadsDirectory: uploadsDir,
        files: fileDetails,
        message: 'Files should be accessible via the URL provided'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 API Documentation available at http://localhost:${port}/api/docs`);
  console.log(`📁 Static files accessible at http://localhost:${port}/uploads/`);
  console.log(`🔍 Debug uploads list at http://localhost:${port}/api/uploads/list`);
}
bootstrap();
