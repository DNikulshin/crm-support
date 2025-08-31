import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    validate(payload: any): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
    } | null>;
}
export {};
