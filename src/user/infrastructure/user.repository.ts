import { PrismaService } from "nestjs-prisma";
import { Inject } from "@nestjs/common";
import { UserMapper } from "./user.mapper";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { IUserRepository } from "../domain/contracts/i.user.repository";
import { UserEntity } from "../domain/entities/user.entity";

export class UserRepository implements IUserRepository {

    constructor(
        @Inject(UserMapper) private readonly userMapper: UserMapper,
        private prisma: PrismaService,
        private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
    ) { }

    async create(userEntity: UserEntity): Promise<UserEntity> {
        const user = this.userMapper.mapFromEntityToModel(userEntity);
        const createdUser = await this.txHost.tx.user.create({
            data: {
                ...user
            }
        });

        return this.userMapper.mapFromModelToEntity(createdUser);
    }

    async getById(id: string, joins?: {
        userPreferences?: boolean,
        userTelegram?: boolean,
        userCredentials?: boolean,
    }): Promise<UserEntity | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                id
            }
        });

        return user ? this.userMapper.mapFromModelToEntity(user) : null;
    }

    async update(userEntity: UserEntity): Promise<UserEntity> {
        const user = this.userMapper.mapFromEntityToModel(userEntity);
        const createdUser = await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                updatedAt: user.updatedAt,
            },
        });

        return this.userMapper.mapFromModelToEntity(createdUser);
    }

}
