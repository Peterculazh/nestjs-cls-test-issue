import { Test, TestingModule } from "@nestjs/testing";
import { PrismaModule, PrismaService } from "nestjs-prisma";
import { ClsModule } from "nestjs-cls";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { IUserRepository } from "../domain/contracts/i.user.repository";
import { UserRepository } from "../infrastructure/user.repository";
import { UserMapper } from "../infrastructure/user.mapper";
import { UserEntity } from "../domain/entities/user.entity";

describe(`POSITIVE: UserRepository`, () => {
    let repository: IUserRepository;
    let prismaService: PrismaService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                PrismaModule.forRoot({
                    isGlobal: true,
                }),
                ClsModule.forRoot({
                    plugins: [
                        new ClsPluginTransactional({
                            imports: [
                                PrismaModule
                            ],
                            adapter: new TransactionalAdapterPrisma({
                                prismaInjectionToken: PrismaService,
                            }),
                        }),
                    ],
                }),
            ],
            providers: [
                {
                    provide: IUserRepository,
                    useClass: UserRepository,
                },
                UserMapper,
            ],
        }).compile();

        repository = module.get<IUserRepository>(IUserRepository);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    afterAll(async () => {
        await prismaService.$disconnect();
    });

    it(`Should be defined`, () => {
        expect(repository).toBeDefined();
    });

    it(`Should create user`, async () => {
        const user = UserEntity.create();
        const createdUser = await repository.create(user);

        expect(createdUser).toBeDefined();
        expect(createdUser.id).toBeDefined();
        expect(createdUser.createdAt).toEqual(user.createdAt);
        expect(createdUser.updatedAt).toEqual(user.updatedAt);

        await prismaService.user.delete({
            where: {
                id: createdUser.id
            }
        });
    });

    it(`Should find user by id`, async () => {
        const createdUser = await prismaService.user.create({
            data: {
                id: '183a679c-9180-4ef0-92b2-7ec511ec1a19',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        const foundUser = await repository.getById('183a679c-9180-4ef0-92b2-7ec511ec1a19');

        expect(foundUser).toBeDefined();
        expect(foundUser!.id).toEqual(createdUser.id);
        expect(foundUser!.createdAt).toEqual(createdUser.createdAt);
        expect(foundUser!.updatedAt).toEqual(createdUser.updatedAt);

        await prismaService.user.delete({
            where: {
                id: createdUser.id
            }
        });
    });
});
