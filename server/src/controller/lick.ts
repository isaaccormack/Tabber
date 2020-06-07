import { validate, ValidationError } from "class-validator";
import { getManager, Repository, Not, Equal, Like } from "typeorm";
import { Context } from "koa";
import { Lick } from "../entity/lick";
import { User } from "../entity/user";

export class LickController {

    /**
     * POST /api/licks
     *
     * Upload new lick to be processed and have a tab generated
     */
    public static async createLick(ctx: Context): Promise<void> {
        
        const audio = ctx.request.body;

        const currentDateTime = new Date();

        // build up lick entity to be saved
        const lickToBeSaved: Lick = new Lick();
        lickToBeSaved.name = "Lick from " + currentDateTime.toISOString();
        lickToBeSaved.description = "";
        lickToBeSaved.dateUploaded = currentDateTime;
        lickToBeSaved.audioFileLocation = "";
        lickToBeSaved.audioLength = 0;
        lickToBeSaved.tab = "";
        lickToBeSaved.tuning = "";
        lickToBeSaved.isPublic = false;
        lickToBeSaved.owner = ctx.state.user;
        lickToBeSaved.sharedWith = [];
 
        // TODO: save the lick to the filesystem & record the audio file location
    }

    /**
     * GET /api/licks/{id}
     *
     * Get a lick by id.
     */
    public static async getLick(ctx: Context): Promise<void> {

        // get a lick repository to perform operations with licks
        const lickRepository: Repository<Lick> = getManager().getRepository(Lick);

        // load lick by id
        const lick: Lick | undefined = await lickRepository.findOne(+ctx.params.id || 0);

        if (lick) {
            // verify user has permissions
            const isPermitted = this.canUserAccess(ctx.state.user, lick);
            if (isPermitted) {
                // return OK status code and loaded lick object
                ctx.status = 200;
                ctx.body = lick;
            } else {
                // return FORBIDDEN status code
                ctx.status = 403;
                ctx.body = "You do not have permission to access this lick";
            }
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = "The lick you are trying to retrieve doesn't exist";
        }
    }

    /**
     * PUT /api/licks/{id}
     *
     * Update a lick by id.
     */
    public static async updateLick(ctx: Context): Promise<void> {
        // TODO
        return;
    }

    /**
     * DELETE /api/licks/{id}
     * 
     * Delete a lick by id.
     */
    public static async deleteLick(ctx: Context): Promise<void> {

        // get a lick repository to perform operations with licks
        const lickRepository = getManager().getRepository(Lick);

        // find the lick by specified id
        const lickToRemove: Lick | undefined = await lickRepository.findOne(+ctx.params.id || 0);

        if (!lickToRemove) {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = "The lick you are trying to delete doesn't exist";
        } else if (ctx.state.user !== lickToRemove.owner) {
            // check user's token id and owner id are the same
            // if not, return a FORBIDDEN status code and error message
            ctx.status = 403;
            ctx.body = "A lick can only be deleted by its owner";
        } else {
            // the lick is there so can be removed
            await lickRepository.remove(lickToRemove);
            // return a NO CONTENT status code
            ctx.status = 204;
        }
    }

    // TODO: test whether these comparisons work correctly & are a reasonably efficient way to do things
    private static canUserAccess(user: User, lick: Lick): boolean {
        return lick.owner == user || lick.sharedWith.indexOf(user) !== -1;
    }

    private static canUserModify(user: User, lick: Lick): boolean {
        return lick.owner == user;
    }
}