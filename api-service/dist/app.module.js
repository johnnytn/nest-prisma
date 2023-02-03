"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AppModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const nestjs_prisma_1 = require("nestjs-prisma");
const user_controller_1 = require("./user/user.controller");
const user_service_1 = require("./user/user.service");
const auth_module_1 = require("./auth/auth.module");
const stock_module_1 = require("./stock/stock.module");
const auth_controller_1 = require("./auth/auth.controller");
const auth_service_1 = require("./auth/auth.service");
const jwt_1 = require("@nestjs/jwt");
let AppModule = AppModule_1 = class AppModule {
};
AppModule = AppModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [AppModule_1, nestjs_prisma_1.PrismaModule.forRoot(), auth_module_1.AuthModule, stock_module_1.StockModule],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            user_controller_1.UserController,
            user_service_1.UserService,
            auth_controller_1.AuthController,
            auth_service_1.AuthService,
            jwt_1.JwtService,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map