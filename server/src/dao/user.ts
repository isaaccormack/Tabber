import { User } from "../entity/user";
import { getManager, Repository } from "typeorm";

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
    const userRepository: Repository<User> = getManager().getRepository(User);
    return await userRepository.findOne({ where: { email } });
}

export const saveUserToDb = async (user: User): Promise<User> => {
    const userRepository: Repository<User> = getManager().getRepository(User);
    return await userRepository.save(user);
}

export const getUserById = async (id: number): Promise<User | undefined> => {
    const userRepository = getManager().getRepository(User);
    return await userRepository.findOne({ where: { id }, relations: ['licks', 'licks.sharedWith']});
}
