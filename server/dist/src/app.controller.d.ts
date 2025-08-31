import { AppService } from './app.service';
import type { Response } from 'express';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    downloadApiDocsJson(res: Response): Promise<void>;
    downloadApiDocsYaml(res: Response): Promise<void>;
}
