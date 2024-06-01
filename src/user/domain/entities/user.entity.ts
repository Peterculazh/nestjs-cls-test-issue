import { v4 as uuidv4 } from 'uuid';

export type UpdateUserEntity = Partial<UserEntity> & { id: string };

export interface IUserData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity {
  private _id: string;

  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor({
    id,
    createdAt,
    updatedAt,
  }: {
    createdAt: Date;
    updatedAt: Date;
    id?: string;
  }) {
    this._id = id ?? uuidv4();
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static create(): UserEntity {
    const createdUpdatedAt = new Date();

    return new UserEntity({
      createdAt: createdUpdatedAt,
      updatedAt: createdUpdatedAt,
    });
  }

  static reconstruct(data: IUserData): UserEntity {
    return new UserEntity(data);
  }

  public internalUpdateUpdatedAt(): void {
    this._updatedAt = new Date();
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
