import {
  DeleteResult,
  EntityRepository,
  getConnection,
  Repository
} from 'typeorm';

import { OptionInput } from './types';
import { Option } from '../../entities';

@EntityRepository(Option)
export class OptionRepository extends Repository<Option> {
  public async createAndSave(
    itemId: string,
    options: OptionInput[] = []
  ): Promise<Option[]> {
    return await this.save(OptionRepository.createOptions(itemId, options));
  }

  static createOptions(itemId: string, options: OptionInput[] = []) {
    return options
      .map((o: OptionInput) => ({
        ...o,
        isDefault: Boolean(options.length === 1),
        itemId
      }))
      .sort((a, b) => a.price - b.price)
      .map((po) => {
        return Option.construct(po);
      });
  }

  static createOptionUpdates(existing: Option[], toBeSaved: OptionInput[]) {
    let extMap: Record<string, Option> = {};
    let updatedMap: Record<string, OptionInput> = {};

    let toBeRemoved: string[] = [];

    existing.forEach((o) => {
      extMap = { ...extMap, [o.id]: o };
    });

    toBeSaved.forEach((o, index) => {
      updatedMap = { ...updatedMap, [o.id || `new_${index}`]: o };
    });

    existing.forEach(({ id }: Option) => {
      const isRemoved = !updatedMap[id];

      if (isRemoved) {
        toBeRemoved = [...toBeRemoved, id];
      }
    });

    return { toBeSaved, toBeRemoved };
  }

  public async deleteOptions(
    optionIds: string[]
  ): Promise<DeleteResult | undefined> {
    return await this.delete(optionIds);
  }

  public async updateAndSave(
    itemId: string,
    options: OptionInput[] = []
  ): Promise<Option[]> {
    const existing = await this.findByItemId(itemId);

    const { toBeRemoved } = OptionRepository.createOptionUpdates(
      existing,
      options
    );

    if (toBeRemoved.length) {
      await this.deleteOptions(toBeRemoved);
    }

    return await this.save(OptionRepository.createOptions(itemId, options));
  }

  public async findByItemId(itemId: string): Promise<Option[]> {
    return await this.find({ itemId });
  }

  static getRepository() {
    return getConnection().getCustomRepository(OptionRepository);
  }
}
