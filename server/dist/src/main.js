"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const yaml = __importStar(require("js-yaml"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const uploadsPath = (0, path_1.join)(process.cwd(), 'uploads');
    console.log(`📁 Setting up static file serving from: ${uploadsPath}`);
    app.useStaticAssets(uploadsPath, {
        prefix: '/uploads/',
    });
    app.enableCors({
        origin: ['http://localhost:5173', 'http://localhost:3001'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('CRM Support System API')
        .setDescription('Complete CRM system for technical support with user management, ticket tracking, and role-based access control.')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .addTag('Authentication', 'User authentication and registration')
        .addTag('Users', 'User management (Admin only)')
        .addTag('Tickets', 'Ticket management and support system')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
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
    app.getHttpAdapter().get('/api/docs-json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="api-docs.json"');
        res.send(JSON.stringify(document, null, 2));
    });
    app.getHttpAdapter().get('/api/docs-yaml', (req, res) => {
        const yamlString = yaml.dump(document);
        res.setHeader('Content-Type', 'application/x-yaml');
        res.setHeader('Content-Disposition', 'attachment; filename="api-docs.yaml"');
        res.send(yamlString);
    });
    app.getHttpAdapter().get('/api/uploads/list', (req, res) => {
        const fs = require('fs');
        const uploadsDir = (0, path_1.join)(process.cwd(), 'uploads');
        try {
            const files = fs.readdirSync(uploadsDir);
            const fileDetails = files.map((file) => {
                const filePath = (0, path_1.join)(uploadsDir, file);
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
        }
        catch (error) {
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
//# sourceMappingURL=main.js.map