import { createSandbox, SinonSandbox } from 'sinon'
const audioDuration = require('get-audio-duration')
import { createMockContext } from '@shopify/jest-koa-mocks';

import { User } from "../../src/entity/user";
import { LickController } from '../../src/controller/lick'
import { Lick } from '../../src/entity/lick';
import { LickDAO } from "../../src/dao/lick";
import { LickAssertions } from "../../src/controller/lickAssertions";
import { LickUtils } from "../../src/controller/lickUtils";
const TabModule = require('../../src/tabbing/tabLick');

describe('Unit test: Lick endpoint', () => {
    let sandbox: SinonSandbox
    beforeEach(() => { sandbox = createSandbox() })
    afterEach(() => { sandbox.restore() })

    /**
     * Test createLick()
     */
    it('should CREATE lick with valid data', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        const now: Date = new Date();
        sandbox.useFakeTimers(now.getTime()); // stub new Date() to return now

        // This is what the endpoint will store in the database / is returned
        const mockSavedLick: Lick = new Lick()
        mockSavedLick.name = "cool lick";
        mockSavedLick.description = "good one";
        mockSavedLick.dateUploaded = now;
        mockSavedLick.tab = "";
        mockSavedLick.tuning = "Drop D";
        mockSavedLick.capo = 0;
        mockSavedLick.isPublic = false;
        mockSavedLick.owner = lickOwner;
        mockSavedLick.sharedWith = [];
        mockSavedLick.audioFileLocation = "my/fake/path";
        mockSavedLick.audioLength = 12;

        // Pass in just the user defined parameters
        let body = {
            name: mockSavedLick.name,
            description: mockSavedLick.description,
            tuning: mockSavedLick.tuning,
            capo: mockSavedLick.capo,
        }

        // TODO: fix coupling between lick assertions and this
        sandbox.stub(LickUtils, "validateAudioFile").returns(null);
        sandbox.stub(LickUtils, "saveAudioFile").returns(mockSavedLick.audioFileLocation);
        sandbox.stub(audioDuration, "getAudioDurationInSeconds").returns(mockSavedLick.audioLength);
        sandbox.stub(TabModule, "tabLick").returns("");
        sandbox.stub(LickDAO, "saveLickToDb").returns(mockSavedLick);

        const ctx: any = createMockContext();
        ctx.request.body = body;
        ctx.request.files = {};
        ctx.state.user = lickOwner;
        await LickController.createLick(ctx)

        expect(ctx.status).toBe(201)
        expect(ctx.body).toBe(mockSavedLick)
    })
    it('should NOT CREATE lick with no name', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        let body = {
            name: "",
            tuning: "Drop D",
            capo: 0,
        }

        sandbox.stub(LickUtils, "validateAudioFile").returns(null);

        const ctx: any = createMockContext();
        ctx.request.body = body;
        ctx.request.files = {};
        ctx.state.user = lickOwner;
        await LickController.createLick(ctx)

        expect(ctx.status).toBe(400)
        expect(ctx.body.errors.length).toEqual(1)
        expect(ctx.body.errors[0].property).toBe('name')
    })
    it('should NOT CREATE lick when no file sent', async () => {
        const ctx: any = createMockContext();
        ctx.request.files = {file: null};
        await LickController.createLick(ctx)

        expect(ctx.status).toBe(400)
        expect(ctx.body.errors.error).toContain(" No file sent");
    })
    it('should NOT CREATE lick when length of audio is longer than max', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        let body = {
            name: "another lick",
            tuning: "Drop D",
            capo: 0,
        }

        sandbox.stub(LickUtils, "validateAudioFile").returns(null);
        sandbox.stub(LickUtils, "saveAudioFile").returns(null);
        sandbox.stub(audioDuration, "getAudioDurationInSeconds").returns(1000);
        sandbox.stub(LickUtils, "attemptToDeleteFile").returns(null);

        const ctx: any = createMockContext();
        ctx.request.body = body;
        ctx.request.files = {};
        ctx.state.user = lickOwner;
        await LickController.createLick(ctx)

        expect(ctx.status).toBe(400)
        expect(ctx.body.errors.error).toContain("Audio file is longer than")
    })
    /**
     * Test getLick()
     */
    it('should GET public lick by id', async () => {
        // add more attributes here so tests pass
        const mockLick: Lick = new Lick()
        mockLick.isPublic = true;
        mockLick.owner = new User();
        mockLick.sharedWith = [];

        sandbox.stub(LickDAO, "getLickFromDbById").returns(mockLick);

        const ctx = createMockContext();
        ctx.params = {}
        await LickController.getLick(ctx)

        expect(ctx.status).toBe(200)
        expect(ctx.body).toBe(mockLick)
    })
    it('should NOT GET lick by id if lick doesnt exist', async () => {
        sandbox.stub(LickDAO, "getLickFromDbById").returns(undefined);

        const ctx = createMockContext();
        ctx.params = {}
        await LickController.getLick(ctx)

        expect(ctx.status).toBe(400)
        expect(ctx.body.errors.error).toContain("doesn't exist")
    })
    it('should GET private lick by id if user owns lick', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        const mockLick: Lick = new Lick()
        mockLick.isPublic = false;
        mockLick.owner = lickOwner;
        mockLick.sharedWith = [];

        sandbox.stub(LickDAO, "getLickFromDbById").returns(mockLick);

        const ctx = createMockContext();
        ctx.params = {}
        ctx.state.user = lickOwner;
        await LickController.getLick(ctx)

        expect(ctx.status).toBe(200)
        expect(ctx.body).toBe(mockLick)
    })
    it('should NOT GET private lick by id if user is not owner of lick and lick is not shared with user', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id
        const lickQuerier: User = new User()
        lickQuerier.id = 2

        const mockLick: Lick = new Lick()
        mockLick.isPublic = false;
        mockLick.owner = lickOwner;
        mockLick.sharedWith = [];

        sandbox.stub(LickDAO, "getLickFromDbById").returns(mockLick);

        const ctx = createMockContext();
        ctx.params = {}
        ctx.state.user = lickQuerier;
        await LickController.getLick(ctx)

        expect(ctx.status).toBe(403)
        expect(ctx.body.errors.error).toContain("do not have permission")
    })
    it('should NOT GET private lick by id when user isnt logged in', async () => {
        const mockLick: Lick = new Lick()
        mockLick.isPublic = false;
        mockLick.owner = new User();
        mockLick.sharedWith = [];

        sandbox.stub(LickDAO, "getLickFromDbById").returns(mockLick);

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
        sandbox.stub(LickDAO, "getLickFromDbById").returns(undefined);

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

        const mockLick: Lick = new Lick()
        mockLick.isPublic = false;
        mockLick.owner = lickOwner;
        mockLick.sharedWith = [];

        sandbox.stub(LickDAO, "getLickFromDbById").returns(mockLick);

        const ctx = createMockContext();
        ctx.params = {}
        ctx.state.user = lickQuerier;
        await LickController.getLickAudio(ctx)

        expect(ctx.status).toBe(403)
        expect(ctx.body.errors.error).toContain("do not have permission")
    })
    it('should NOT GET private audio by id when user isnt logged in', async () => {
        const mockLick: Lick = new Lick()
        mockLick.isPublic = false;
        mockLick.owner = new User();
        mockLick.sharedWith = [];

        sandbox.stub(LickDAO, "getLickFromDbById").returns(mockLick);

        const ctx = createMockContext();
        ctx.params = {}
        await LickController.getLickAudio(ctx)

        expect(ctx.status).toBe(403)
        expect(ctx.body.errors.error).toContain("You do not have permission")
    })
    /**
     * Test deleteLick()
     */
    it('should DELETE lick by id from owner', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        const mockLick: Lick = new Lick()
        mockLick.isPublic = false;
        mockLick.owner = lickOwner;
        mockLick.sharedWith = [];

        sandbox.stub(LickDAO, "getLickFromDbById").returns(mockLick);
        sandbox.stub(LickUtils, "unlinkAsync").returns(null);
        sandbox.stub(LickDAO, "deleteLickFromDb").returns(mockLick);

        const ctx = createMockContext();
        ctx.state.user = lickOwner;
        ctx.params = {}
        await LickController.deleteLick(ctx)

        expect(ctx.status).toBe(200)
        expect(ctx.body).toBe(mockLick)
    })
    it('should NOT DELETE lick by id if user isnt owner', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        const lickDeleter: User = new User()
        lickOwner.id = 2 // must set id

        const mockLick: Lick = new Lick()
        mockLick.isPublic = false;
        mockLick.owner = lickOwner;
        mockLick.sharedWith = [];

        sandbox.stub(LickDAO, "getLickFromDbById").returns(mockLick);

        const ctx = createMockContext();
        ctx.state.user = lickDeleter;
        ctx.params = {}
        await LickController.deleteLick(ctx)

        expect(ctx.status).toBe(403)
        expect(ctx.body.errors.error).toContain("do not have permission to edit this lick")
    })
    it('should NOT DELETE lick which doesnt exist', async () => {
        sandbox.stub(LickDAO, "getLickFromDbById").returns(undefined);

        const ctx = createMockContext();
        ctx.params = {}
        await LickController.deleteLick(ctx)

        expect(ctx.status).toBe(400)
        expect(ctx.body.errors.error).toContain("doesn't exist")
    })
})
