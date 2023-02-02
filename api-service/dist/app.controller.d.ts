import { AppService } from './app.service';
import { CreateUserDto } from './user/dto/create-user.dto';
import { UserController } from './user/user.controller';
export declare class AppController {
    private readonly appService;
    private readonly userController;
    constructor(appService: AppService, userController: UserController);
    registerUser(createUserDto: CreateUserDto): Promise<{
        email: string;
        password: string;
    }>;
    getHistories(req: any): Promise<import(".prisma/client").Prisma.JsonValue[]>;
    getStats(): Promise<{
        stock: string;
        times_requested: number;
    }[]>;
}
