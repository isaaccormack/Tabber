import { getManager, Repository } from "typeorm";
import { LickCount } from "../entity/lickCount";

export class LickCountDAO {

    public static async getLickCountFromDb(): Promise<LickCount> {
        const lickCountRepository: Repository<LickCount> = getManager().getRepository(LickCount);
        const lickCount = await lickCountRepository.findOne(1);
        if (!lickCount) throw new Error('couldn\'t get lick count from db');
        return lickCount;
    }

    public static async incrementLickCountInDB(): Promise<void> {
        const lickCountRepository: Repository<LickCount> = getManager().getRepository(LickCount);
        await lickCountRepository.increment({ id: 1}, "count", 1);
    }
}
