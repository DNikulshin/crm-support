"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_service_1 = require("./app.service");
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async downloadApiDocsJson(res) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="crm-api-docs.json"');
        res.json({
            message: 'API documentation download endpoint - JSON format',
            note: 'The actual OpenAPI specification is available via the direct endpoint',
            swagger_ui: '/api/docs',
            download_yaml: '/api/docs-yaml'
        });
    }
    async downloadApiDocsYaml(res) {
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
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is running' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('api/docs-json'),
    (0, swagger_1.ApiExcludeEndpoint)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "downloadApiDocsJson", null);
__decorate([
    (0, common_1.Get)('api/docs-yaml'),
    (0, swagger_1.ApiExcludeEndpoint)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "downloadApiDocsYaml", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('System'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map