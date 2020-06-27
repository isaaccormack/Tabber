import { validate, ValidationError } from "class-validator";
import { getManager, Repository, Not, Equal, Like } from "typeorm";
import { Context } from "koa";
import { TokenPayload } from "google-auth-library";


import { User } from "../entity/user";

export class UserController {

    /**
     * GET /user
     * 
     * Get data on the currently authenticated user.
     */
    public static async getAuthenticatedUser(ctx: Context): Promise<void> {

        // If this route is reached then its guaranteed that ctx's state
        // has been set with the currently authenticated user
        ctx.body = ctx.state.user;
        ctx.status = 200;

        // may need to do a query here to get more data about user depending 
        // on what data the user page will display
    }

    // Called in middleware every request
    public static async getOrCreateUser(payload: TokenPayload): Promise<User> {
        const userRepository: Repository<User> = getManager().getRepository(User);
        
        let user: User = await userRepository.findOne(
            {
                where:
                    {email: payload.email}
            }
        );
        // create user if doesn't exist
        if (!user) {
            user = new User();
            const {email,
                   name,
                   picture,
                   given_name,
                   family_name} = payload;
            user.email = email;
            user.name = name;
            user.picture_URL = picture;
            user.given_name = given_name;
            user.family_name = family_name;
            try {
                user = await userRepository.save(user);
            } catch {
                // Most likely error case to be caught here is when the jwt token provided
                // does not provide information required by the user entity, such as 
                // email, given_name, or family_name
                return null;
            }
        }
        return user;
    }

    // For testing
    /**
     * GET /users
     * 
     * Find all users.
     */
    public static async getUsers(ctx: Context): Promise<void> {

        // get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);

        // load all users
        const users: User[] = await userRepository.find();

        // return OK status code and loaded users array
        ctx.status = 200;
        ctx.body = users;
    }

    /**
     * GET /users/{id}
     * 
     * Find user by id.
     */
    public static async getUser(ctx: Context): Promise<void> {

        // get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);

        // load user by id
        const user: User | undefined = await userRepository.findOne(+ctx.params.id || 0);

        if (user) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = user;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = { errors: {error: "The user you are trying to retrieve doesn't exist in the db"}}
        }

    }

    // Save this as template for later
    /**
     * PUT /users/{id}
     * 
     * Update a user.
     */
    public static async updateUser(ctx: Context): Promise<void> {

        // get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);

        // update the user by specified id
        // build up entity user to be updated
        const userToBeUpdated: User = new User();
        userToBeUpdated.id = +ctx.params.id || 0; // will always have a number, this will avoid errors
        userToBeUpdated.name = ctx.request.body.name;
        userToBeUpdated.email = ctx.request.body.email;

        // validate user entity
        const errors: ValidationError[] = await validate(userToBeUpdated); // errors is an array of validation errors

        if (errors.length > 0) {
            // return BAD REQUEST status code and errors array
            ctx.status = 400;
            ctx.body = errors;
        } else if (!await userRepository.findOne(userToBeUpdated.id)) {
            // check if a user with the specified id exists
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = { errors: {error: "The user you are trying to update doesn't exist in the db"}}
        } else if (await userRepository.findOne({ id: Not(Equal(userToBeUpdated.id)), email: userToBeUpdated.email })) {
            // return BAD REQUEST status code and email already exists error
            ctx.status = 400;
            ctx.body = { errors: {error: "The specified e-mail address already exists"}}
        } else {
            // save the user contained in the PUT body
            const user = await userRepository.save(userToBeUpdated);
            // return CREATED status code and updated user
            ctx.status = 201;
            ctx.body = user;
        }
    }

    /**
     * DELETE /user
     * 
     * Delete the currently authenticated user.
     */
    public static async deleteAuthenticatedUser(ctx: Context): Promise<void> {

        const userRepository = getManager().getRepository(User);

        const userToRemove: User | undefined = await userRepository.findOne(ctx.state.user.id);

        if (!userToRemove) {
            ctx.body = { errors: {error: "Could find user to be deleted"}}
            ctx.status = 500;
        } else {
            const removedUser = await userRepository.remove(userToRemove);
            if (!removedUser) {
                ctx.body = { errors: {error: "Could not delete user"}}
                ctx.status = 500;
            }
            ctx.status = 204;
        }
    }
}