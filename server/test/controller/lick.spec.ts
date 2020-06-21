import { createSandbox, SinonSandbox } from 'sinon'
import * as typeorm from 'typeorm'
import {createMockContext } from '@shopify/jest-koa-mocks';
import { User } from "../../src/entity/user";
import { LickController } from '../../src/controller/lick'
import { UserController } from '../../src/controller/user'
import { Lick } from '../../src/entity/lick';

const audioDuration = require('get-audio-duration')

describe('Unit test: Lick endpoint', () => {
    let sandbox: SinonSandbox

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
     * Test createLick()
     */
    it('should CREATE lick with valid data', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        const now: Date = new Date();
        sandbox.useFakeTimers(now.getTime()); // stub new Date() to return now

        // This is what the endpoint will store in the database / is returned
        const fakeLick: Lick = new Lick()
        fakeLick.name = "cool lick";
        fakeLick.description = "good one";
        fakeLick.dateUploaded = now;
        fakeLick.tab = "";
        fakeLick.tuning = "drop d";
        fakeLick.isPublic = false;
        fakeLick.owner = lickOwner;
        fakeLick.sharedWith = [];
        fakeLick.audioFileLocation = "my/fake/path";
        fakeLick.audioLength = 27;

        // Pass in just the user defined parameters
        let body = {
            name: fakeLick.name,
            description: fakeLick.description,
            tuning: fakeLick.tuning,
            isPublic: fakeLick.isPublic
        }

        sandbox.stub(LickController, "validateAudioFile").returns(null);
        sandbox.stub(LickController, "saveAudioFile").returns(fakeLick.audioFileLocation);
        sandbox.stub(audioDuration, "getAudioDurationInSeconds").returns(fakeLick.audioLength);
        stubGetLickRepository({ save: function() { return fakeLick } });
 
        const ctx: any = createMockContext();
        ctx.request.body = body;
        ctx.request.files = {};
        ctx.state.user = lickOwner;
        await LickController.createLick(ctx)
        
        expect(ctx.status).toBe(201)
        expect(ctx.body).toBe(fakeLick)
    })
    it('should NOT CREATE lick with no name', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id
        
        let body = {
            name: "",
            description: "",
            tuning: "standard",
            isPublic: false
        }

        sandbox.stub(LickController, "validateAudioFile").returns(null);
 
        const ctx: any = createMockContext();
        ctx.request.body = body;
        ctx.request.files = {};
        ctx.state.user = lickOwner;
        await LickController.createLick(ctx)

        expect(ctx.status).toBe(400)
        expect(ctx.body.errors.length).toBeGreaterThanOrEqual(1)
        expect(ctx.body.errors[0].property).toBe('name')
    })
    it('should NOT CREATE lick when length of audio is longer than max', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        let body = {
            name: "another lick",
            description: "",
            tuning: "standard",
            isPublic: false
        }

        sandbox.stub(LickController, "validateAudioFile").returns(null);
        sandbox.stub(LickController, "saveAudioFile").returns(null);
        sandbox.stub(audioDuration, "getAudioDurationInSeconds").returns(1000);
        sandbox.stub(LickController, "attemptToDeleteFile").returns(null);
 
        const ctx: any = createMockContext();
        ctx.request.body = body;
        ctx.request.files = {};
        ctx.state.user = lickOwner;
        await LickController.createLick(ctx)
        
        expect(ctx.status).toBe(400)
        expect(ctx.body.errors.error).toContain("Audio file is longer than")
    })
    it('should NOT CREATE lick when no file sent', async () => {
        const ctx: any = createMockContext();
        ctx.request.files = {file: null};
        await LickController.createLick(ctx)
        
        expect(ctx.status).toBe(400)
        expect(ctx.body.errors.error).toContain(" No file sent");
    })
    /**
     * Test getLick()
     */
    it('should GET public lick by id', async () => {
        const fakeLick: Lick = new Lick()
        fakeLick.isPublic = true;

        stubGetLickRepository({ findOne: function() { return fakeLick } });

        const ctx = createMockContext();
        ctx.params = {}
        await LickController.getLick(ctx)
        
        expect(ctx.status).toBe(200)
        expect(ctx.body).toBe(fakeLick)
    })
    it('should NOT GET lick by id if lick doesnt exist', async () => {
        stubGetLickRepository({ findOne: function() { return undefined } });

        const ctx = createMockContext();
        ctx.params = {}
        await LickController.getLick(ctx)
        
        expect(ctx.status).toBe(400)
        expect(ctx.body.errors.error).toContain("doesn't exist")
    })
    it('should GET private lick by id if user owns lick', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        const fakeLick: Lick = new Lick()
        fakeLick.isPublic = false;
        fakeLick.owner = lickOwner;

        stubGetLickRepository({ findOne: function() { return fakeLick } });

        const ctx = createMockContext();
        ctx.params = {}
        ctx.state.user = lickOwner;
        await LickController.getLick(ctx)
        
        expect(ctx.status).toBe(200)
        expect(ctx.body).toBe(fakeLick)
    })
    it('should NOT GET private lick by id if user is not owner of lick and lick is not shared with user', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id
        const lickQuerier: User = new User()
        lickQuerier.id = 2

        const fakeLick: Lick = new Lick()
        fakeLick.isPublic = false;
        fakeLick.owner = lickOwner;
        fakeLick.sharedWith = [];

        stubGetLickRepository({ findOne: function() { return fakeLick } });

        const ctx = createMockContext();
        ctx.params = {}
        ctx.state.user = lickQuerier;
        await LickController.getLick(ctx)
        
        expect(ctx.status).toBe(403)
        expect(ctx.body.errors.error).toContain("do not have permission")
    })
    it('should NOT GET private lick by id when user isnt logged in', async () => {
        const fakeLick: Lick = new Lick()
        fakeLick.isPublic = false;

        stubGetLickRepository({ findOne: function() { return fakeLick } });

        const ctx = createMockContext();
        ctx.params = {}
        await LickController.getLick(ctx)
        
        expect(ctx.status).toBe(403)
        expect(ctx.body.errors.error).toContain("You do not have permission")
    })
    /**
     * Test getLickAudio() -> Integration tests cover that audio file is saved / retrieved properly
     */
    it('should NOT GET audio by id if lick doesnt exist', async () => {
        stubGetLickRepository({ findOne: function() { return undefined } });

        const ctx = createMockContext();
        ctx.params = {}
        await LickController.getLickAudio(ctx)
        
        expect(ctx.status).toBe(400)
        expect(ctx.body.errors.error).toContain("doesn't exist")
    })
    it('should NOT GET private audio by id if user is not owner of lick and lick is not shared with user', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id
        const lickQuerier: User = new User()
        lickQuerier.id = 2

        const fakeLick: Lick = new Lick()
        fakeLick.isPublic = false;
        fakeLick.owner = lickOwner;
        fakeLick.sharedWith = [];

        stubGetLickRepository({ findOne: function() { return fakeLick } });

        const ctx = createMockContext();
        ctx.params = {}
        ctx.state.user = lickQuerier;
        await LickController.getLickAudio(ctx)
        
        expect(ctx.status).toBe(403)
        expect(ctx.body.errors.error).toContain("do not have permission")
    })
    it('should NOT GET private audio by id when user isnt logged in', async () => {
        const fakeLick: Lick = new Lick()
        fakeLick.isPublic = false;

        stubGetLickRepository({ findOne: function() { return fakeLick } });

        const ctx = createMockContext();
        ctx.params = {}
        await LickController.getLickAudio(ctx)
        
        expect(ctx.status).toBe(403)
        expect(ctx.body.errors.error).toContain("You do not have permission")
    })
    /**
     * Test shareLick()
     */
    it('should NOT SHARE with lick owner', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        const body = {
            userID: lickOwner.id
        }

        const ctx: any = createMockContext();
        ctx.request.body = body;
        ctx.params = {};
        ctx.state.user = lickOwner;
        await LickController.shareLick(ctx)
                
        expect(ctx.status).toBe(400)
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

        sandbox.stub(UserController, "getUserByID").returns(anotherUser);
 
        const ctx: any = createMockContext();
        ctx.request.body = {};
        ctx.params = {};
        ctx.state.user = lickOwner;
        await LickController.shareLick(ctx)
        
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
        ctx.request.body = {};
        ctx.params = {};
        ctx.state.user = lickOwner;
        await LickController.shareLick(ctx)
                
        expect(ctx.status).toBe(400)
        expect(ctx.body.errors.error).toContain("trying to share doesn't exist")
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
        ctx.request.body = {};
        ctx.params = {};
        ctx.state.user = lickSharer;
        await LickController.shareLick(ctx)
                
        expect(ctx.status).toBe(403)
        expect(ctx.body.errors.error).toContain("can only be shared by its owner")
    })
    it('should NOT SHARE lick with user who doesnt exist', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id
        
        const lickToBeShared: Lick = new Lick()
        lickToBeShared.name = "cool lick";
        lickToBeShared.isPublic = false;
        lickToBeShared.owner = lickOwner;
        lickToBeShared.sharedWith = [];
        
        stubGetLickRepository({
            findOne: function() { return lickToBeShared }
        });

        sandbox.stub(UserController, "getUserByID").returns(null);

        const ctx: any = createMockContext();
        ctx.request.body = {};
        ctx.params = {};
        ctx.state.user = lickOwner;
        await LickController.shareLick(ctx)
                
        expect(ctx.status).toBe(400)
        expect(ctx.body.errors.error).toContain("trying to share with doesn't exist")
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

        stubGetLickRepository({
            findOne: function() { return lickToBeUnshared },
            save: function(lick) { 
                return lick
            },   
        });

        sandbox.stub(UserController, "getUserByID").returns(anotherUser);
 
        const ctx: any = createMockContext();
        ctx.request.body = {};
        ctx.params = {};
        ctx.state.user = lickOwner;
        await LickController.unshareLick(ctx)

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
        ctx.request.body = {};
        ctx.params = {};
        ctx.state.user = lickOwner;
        await LickController.unshareLick(ctx)
                
        expect(ctx.status).toBe(400)
        expect(ctx.body.errors.error).toContain("trying to unshare doesn't exist")
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
        ctx.request.body = {};
        ctx.params = {};
        ctx.state.user = lickSharer;
        await LickController.unshareLick(ctx)
                
        expect(ctx.status).toBe(403)
        expect(ctx.body.errors.error).toContain("can only be unshared by its owner")
    })
    it('should NOT UNSHARE lick with user who doesnt exist', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id
        
        const lickToBeShared: Lick = new Lick()
        lickToBeShared.name = "cool lick";
        lickToBeShared.isPublic = false;
        lickToBeShared.owner = lickOwner;
        lickToBeShared.sharedWith = [];
        
        stubGetLickRepository({
            findOne: function() { return lickToBeShared }
        });

        sandbox.stub(UserController, "getUserByID").returns(null);

        const ctx: any = createMockContext();
        ctx.request.body = {};
        ctx.params = {};
        ctx.state.user = lickOwner;
        await LickController.unshareLick(ctx)
                
        expect(ctx.status).toBe(400)
        expect(ctx.body.errors.error).toContain("trying to unshare with doesn't exist")
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
        ctx.request.body = {};
        ctx.params = {};
        ctx.state.user = userUnfollowingLick;
        await LickController.unfollowLick(ctx)
        
        expect(ctx.status).toBe(200)
        expect(ctx.body.name).toBe(lickToBeUnfollowed.name)
        expect(ctx.body.sharedWith.length).toBe(0)
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
        ctx.request.body = {};
        ctx.params = {};
        ctx.state.user = lickOwner;
        await LickController.unfollowLick(ctx)
                
        expect(ctx.status).toBe(400)
        expect(ctx.body.errors.error).toContain("trying to unfollow doesn't exist")
    })
    /**
     * Test deleteLick()
     */
    it('should DELETE lick by id from owner', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        const fakeLick: Lick = new Lick()
        fakeLick.isPublic = false;
        fakeLick.owner = lickOwner;
        fakeLick.sharedWith = [];

        sandbox.stub(LickController, "unlinkAsync").returns(null);
        stubGetLickRepository({
            findOne: function() { return fakeLick },
            remove: function() { return fakeLick }
        });

        const ctx = createMockContext();
        ctx.state.user = lickOwner;
        ctx.params = {}
        await LickController.deleteLick(ctx)
        
        expect(ctx.status).toBe(200)
        expect(ctx.body).toBe(fakeLick)
    })
    it('should NOT DELETE lick by id if user isnt owner', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        const lickDeleter: User = new User()
        lickOwner.id = 2 // must set id

        const fakeLick: Lick = new Lick()
        fakeLick.isPublic = false;
        fakeLick.owner = lickOwner;
        fakeLick.sharedWith = [];

        stubGetLickRepository({ findOne: function() { return fakeLick } });

        const ctx = createMockContext();
        ctx.state.user = lickDeleter;
        ctx.params = {}
        await LickController.deleteLick(ctx)
        
        expect(ctx.status).toBe(403)
        expect(ctx.body.errors.error).toContain("can only be deleted by its owner")
    })
    it('should NOT DELETE lick which doesnt exist', async () => {
        stubGetLickRepository({
            findOne: function() { return undefined },
            remove: function() { return null }
        });
        const ctx = createMockContext();
        ctx.params = {}
        await LickController.deleteLick(ctx)
        
        expect(ctx.status).toBe(400)
        expect(ctx.body.errors.error).toContain("doesn't exist")
    })
})