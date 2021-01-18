import { Lick } from "../entity/lick";
import { getManager, Repository } from "typeorm";

export class LickDAO {

    public static async getLickFromDbById(lickId: number): Promise<Lick | undefined> {
        const lickRepository: Repository<Lick> = getManager().getRepository(Lick);
        return await lickRepository.findOne({where: {id: (lickId)}, relations: ['owner', 'sharedWith']});
    }

    public static async getLickCountFromDb(): Promise<number> {
        const lickRepository: Repository<Lick> = getManager().getRepository(Lick);

        const {count} = await lickRepository
            .createQueryBuilder("lick")
            .select("COUNT(lick.id)", "count")
            .getRawOne();

        return count;
    }

    public static async saveLickToDb(lick: Lick): Promise<Lick | undefined> {
        const lickRepository: Repository<Lick> = getManager().getRepository(Lick);
        return await lickRepository.save(lick);
    }

    public static async deleteLickFromDb(lick: Lick): Promise<Lick | undefined> {
        const lickRepository: Repository<Lick> = getManager().getRepository(Lick);
        return await lickRepository.remove(lick);
    }
}
