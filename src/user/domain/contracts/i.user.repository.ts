import { UpdateUserEntity, UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  create(userEntity: UserEntity): Promise<UserEntity>;
  getById(id: string, joins?: {
    userPreferences?: boolean,
    userTelegram?: boolean,
    userCredentials?: boolean,
  }): Promise<UserEntity | null>;
  update(userEntity: UpdateUserEntity): Promise<UserEntity>;
}
export const IUserRepository = Symbol('IUserRepository');
