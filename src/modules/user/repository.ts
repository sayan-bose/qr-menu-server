import { EntityRepository, getConnection, Repository } from 'typeorm';

import { User } from '../../entities';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async createAndSave(
    payload: Partial<User>
  ): Promise<User | undefined> {
    return await this.save(User.construct(payload));
  }

  public async getList(userParams?: Partial<User>): Promise<[User[], number]> {
    return await this.findAndCount({
      where: {
        ...userParams
      }
    });
  }

  public async getById(id: string): Promise<User | undefined> {
    return await this.findOne({
      where: { id }
    });
  }

  static getRepository() {
    return getConnection().getCustomRepository(UserRepository);
  }
}
