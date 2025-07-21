import "jsonwebtoken";

declare module "jsonwebtoken" {
    export interface JwtPayload {
        user?: Record<string, any>;
    }
}