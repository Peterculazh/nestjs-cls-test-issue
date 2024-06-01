import { Injectable } from "@nestjs/common";
import { user } from "@prisma/client";
import { UserEntity } from "../domain/entities/user.entity";

@Injectable()
export class UserMapper {

    mapFromEntityToModel(userEntity: UserEntity): user {
        return {
            id: userEntity.id,
            createdAt: userEntity.updatedAt,
            updatedAt: userEntity.updatedAt,
        }
    }

    mapFromModelToEntity(user: user): UserEntity {
        return UserEntity.reconstruct({
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }
}
