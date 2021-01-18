import { createSandbox, SinonSandbox } from 'sinon'
import * as typeorm from 'typeorm'
import {createMockContext } from '@shopify/jest-koa-mocks';
import { User } from "../../src/entity/user";
import { LickController } from '../../src/controller/lick'
import { UserController } from '../../src/controller/user'
import { Lick } from '../../src/entity/lick';

describe('Unit test: User shared licks endpoint', () => {
    let sandbox: SinonSandbox

    function stubGetUserRepository(fakeMethod: any): void {
        sandbox.stub(typeorm, "getManager").callsFake(() => {
            return {
                getRepository: sandbox.stub().withArgs(User).returns(fakeMethod),
            };
        });
    }

    function stubGetLickRepository(fakeMethod: any): void {
        sandbox.stub(typeorm, "getManager").callsFake(() => {
            return {
                getRepository: sandbox.stub().withArgs(Lick).returns(fakeMethod),
            };
        });
    }

    beforeEach(() => {
        sandbox = createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    /**
     * Test shareLick()
     */
    it('should NOT SHARE with lick owner', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        const lickToBeShared: Lick = new Lick()
        lickToBeShared.owner = lickOwner;

        stubGetUserRepository({
            findOne: function() { return lickOwner }
        });

        stubGetLickRepository({
            findOne: function() { return lickToBeShared }
        });

        const ctx: any = createMockContext();
        ctx.request.body = { share: true };
        ctx.params = {};
        ctx.state.user = lickOwner;
        await LickController.updateLickSharedWith(ctx)

        expect(ctx.status).toBe(418)
        expect(ctx.body.errors.error).toContain("share a lick with yourself")
    })
    it('should SHARE lick with another user', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        const userLickSharedWith: User = new User()
        userLickSharedWith.id = 2 // must set id

        const anotherUser: User = new User()
        anotherUser.id = 3 // must set id

        const lickToBeShared: Lick = new Lick()
        lickToBeShared.name = "cool lick";
        lickToBeShared.isPublic = false;
        lickToBeShared.owner = lickOwner;
        lickToBeShared.sharedWith = [userLickSharedWith];

        stubGetLickRepository({
            findOne: function() { return lickToBeShared },
            save: function(lick) {
                return lick
            },
        });

        sandbox.stub(UserController, "getUserByEmail").returns(anotherUser);

        const ctx: any = createMockContext();
        ctx.request.body = { share: true };
        ctx.params = {};
        ctx.state.user = lickOwner;
        await LickController.updateLickSharedWith(ctx)

        expect(ctx.status).toBe(200)
        expect(ctx.body.name).toBe(lickToBeShared.name)
        expect(ctx.body.sharedWith.sort()).toEqual([userLickSharedWith, anotherUser].sort())
        expect(ctx.body.sharedWith.length).toBe(2)
        // cant check that user entity was updated since only lick is returned
        // this is checked in integration tests
    })
    it('should NOT SHARE lick that doesnt exist', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        stubGetLickRepository({
            findOne: function() { return null }
        });

        const ctx: any = createMockContext();
        ctx.request.body = { share: true };
        ctx.params = {};
        ctx.state.user = lickOwner;
        await LickController.updateLickSharedWith(ctx)

        expect(ctx.status).toBe(400)
        expect(ctx.body.errors.error).toContain("trying to retrieve doesn't exist")
    })
    it('should NOT SHARE lick if requester isnt owner', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        const lickSharer: User = new User()
        lickOwner.id = 2 // must set id

        const lickToBeShared: Lick = new Lick()
        lickToBeShared.name = "cool lick";
        lickToBeShared.isPublic = false;
        lickToBeShared.owner = lickOwner;
        lickToBeShared.sharedWith = [];

        stubGetLickRepository({
            findOne: function() { return lickToBeShared }
        });

        const ctx: any = createMockContext();
        ctx.request.body = { share: true };
        ctx.params = {};
        ctx.state.user = lickSharer;
        await LickController.updateLickSharedWith(ctx)

        expect(ctx.status).toBe(403)
        expect(ctx.body.errors.error).toContain("do not have permission to edit this lick")
    })
    it('should NOT SHARE lick with user who doesnt exist', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        const lickToBeShared: Lick = new Lick()
        lickToBeShared.name = "cool lick";
        lickToBeShared.isPublic = false;
        lickToBeShared.owner = lickOwner;
        lickToBeShared.sharedWith = [];

        stubGetUserRepository({
            findOne: function() { return null }
        });

        stubGetLickRepository({
            findOne: function() { return lickToBeShared },
            save: function() { return lickToBeShared }
        });

        const ctx: any = createMockContext();
        ctx.request.body = { share: true };
        ctx.params = {};
        ctx.state.user = lickOwner;
        await LickController.updateLickSharedWith(ctx)

        expect(ctx.status).toBe(412)
        expect(ctx.body.errors.error).toContain("you are trying to (un)share with doesn't exist")
    })
    /**
     * Test unshareLick()
     */
    it('should UNSHARE lick with another user', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        const userLickSharedWith: User = new User()
        userLickSharedWith.id = 2 // must set id

        const anotherUser: User = new User()
        anotherUser.id = 3 // must set id

        const lickToBeUnshared: Lick = new Lick()
        lickToBeUnshared.name = "cool lick";
        lickToBeUnshared.isPublic = false;
        lickToBeUnshared.owner = lickOwner;
        lickToBeUnshared.sharedWith = [userLickSharedWith, anotherUser];

        stubGetUserRepository({
            findOne: function() { return anotherUser }
        });

        stubGetLickRepository({
            findOne: function() { return lickToBeUnshared },
            save: function(lick) { return lick }
        });

        const ctx: any = createMockContext();
        ctx.request.body = { share: false };
        ctx.params = {};
        ctx.state.user = lickOwner;
        await LickController.updateLickSharedWith(ctx)

        expect(ctx.status).toBe(200)
        expect(ctx.body.name).toBe(lickToBeUnshared.name)
        expect(ctx.body.sharedWith).toEqual([userLickSharedWith])
        expect(ctx.body.sharedWith.length).toBe(1)
        // cant check that user entity was updated since only lick is returned
        // this is checked in integration tests
    })
    it('should NOT UNSHARE lick that doesnt exist', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        stubGetLickRepository({
            findOne: function() { return null }
        });

        const ctx: any = createMockContext();
        ctx.request.body = { share: false };
        ctx.params = {};
        ctx.state.user = lickOwner;
        await LickController.updateLickSharedWith(ctx)

        expect(ctx.status).toBe(400)
        expect(ctx.body.errors.error).toContain(" trying to retrieve doesn't exist")
    })
    it('should NOT UNSHARE lick if requester isnt owner', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        const lickSharer: User = new User()
        lickOwner.id = 2 // must set id

        const lickToBeShared: Lick = new Lick()
        lickToBeShared.name = "cool lick";
        lickToBeShared.isPublic = false;
        lickToBeShared.owner = lickOwner;
        lickToBeShared.sharedWith = [];

        stubGetLickRepository({
            findOne: function() { return lickToBeShared }
        });

        const ctx: any = createMockContext();
        ctx.request.body = { share: false };
        ctx.params = {};
        ctx.state.user = lickSharer;
        await LickController.updateLickSharedWith(ctx)

        expect(ctx.status).toBe(403)
        expect(ctx.body.errors.error).toContain("do not have permission to edit this lick")
    })
    it('should NOT UNSHARE lick with user who doesnt exist', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        const lickToBeShared: Lick = new Lick()
        lickToBeShared.name = "cool lick";
        lickToBeShared.isPublic = false;
        lickToBeShared.owner = lickOwner;
        lickToBeShared.sharedWith = [];

        stubGetUserRepository({
            findOne: function() { return null }
        });

        stubGetLickRepository({
            findOne: function() { return lickToBeShared },
            save: function() { return lickToBeShared }
        });

        const ctx: any = createMockContext();
        ctx.request.body = { share: false };
        ctx.params = {};
        ctx.state.user = lickOwner;
        await LickController.updateLickSharedWith(ctx)

        expect(ctx.status).toBe(412)
        expect(ctx.body.errors.error).toContain("trying to (un)share with doesn't exist")
    })
    /**
     * Test unfollowLick()
     */
    it('should UNFOLLOW lick shared with user', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        const userUnfollowingLick: User = new User()
        userUnfollowingLick.id = 2 // must set id

        const lickToBeUnfollowed: Lick = new Lick()
        lickToBeUnfollowed.name = "cool lick";
        lickToBeUnfollowed.isPublic = false;
        lickToBeUnfollowed.owner = lickOwner;
        lickToBeUnfollowed.sharedWith = [userUnfollowingLick];

        stubGetLickRepository({
            findOne: function() { return lickToBeUnfollowed },
            save: function(lick) {
                return lick
            },
        });

        const ctx: any = createMockContext();
        ctx.request.body = { share: false };
        ctx.params = {};
        ctx.state.user = userUnfollowingLick;
        await LickController.unfollowLick(ctx)

        expect(ctx.status).toBe(200)
        // cant check that user entity was updated since only lick is returned
        // this is checked in integration tests
    })
    it('should NOT UNFOLLOW lick that doesnt exist', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        stubGetLickRepository({
            findOne: function() { return null }
        });

        const ctx: any = createMockContext();
        ctx.request.body = { share: false };
        ctx.params = {};
        ctx.state.user = lickOwner;
        await LickController.unfollowLick(ctx)

        expect(ctx.status).toBe(400)
        expect(ctx.body.errors.error).toContain("trying to retrieve doesn't exist")
    })
})
