import { User } from "../entity/user";
import { getManager, Repository } from "typeorm";

export class UserDAO {

    public static async getUserByEmail(email: string): Promise<User | undefined> {
        const userRepository: Repository<User> = getManager().getRepository(User);
        return await userRepository.findOne({where: {email}});
    }

    public static async saveUserToDb(user: User): Promise<User> {
        const userRepository: Repository<User> = getManager().getRepository(User);
        return await userRepository.save(user);
    }

    public static async getUserById(id: number): Promise<User | undefined> {
        const userRepository = getManager().getRepository(User);
        return await userRepository.findOne({where: {id}, relations: ['licks', 'licks.sharedWith']});
    }
}
