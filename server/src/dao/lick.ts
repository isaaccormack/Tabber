import { Lick } from "../entity/lick";
import { getManager, Repository } from "typeorm";

export const getLickFromDbById = async (lickId: number): Promise<Lick | undefined> => {
    const lickRepository: Repository<Lick> = getManager().getRepository(Lick);
    return await lickRepository.findOne({ where: {id: (lickId)}, relations: ['owner', 'sharedWith']});
}

export const getLickCountFromDb = async (): Promise<number> => {
    const lickRepository: Repository<Lick> = getManager().getRepository(Lick);

    const { count } = await lickRepository
        .createQueryBuilder("lick")
        .select("COUNT(lick.id)", "count")
        .getRawOne();

    return count;
}

export const saveLickToDb = async (lick: Lick): Promise<Lick | undefined> => {
    const lickRepository: Repository<Lick> = getManager().getRepository(Lick);
    return await lickRepository.save(lick);
}

export const deleteLickFromDb = async (lick: Lick): Promise<Lick | undefined> => {
    const lickRepository: Repository<Lick> = getManager().getRepository(Lick);
    return await lickRepository.remove(lick);
}
