import { createSandbox, SinonSandbox, spy } from 'sinon'
import * as typeorm from 'typeorm'
import {createMockContext } from '@shopify/jest-koa-mocks';
import { User } from "../../src/entity/user";
import { LickController } from '../../src/controller/lick'
import { Lick } from '../../src/entity/lick';
import { Context, Request } from 'koa'
import { Files } from "koa2-formidable";

// import * as audioDuration from 'get-audio-duration'; // for stubbing purposes

const audioDuration = require('get-audio-duration')

// need to move these interfaces somewhere
// files must be added to Request interface
interface FileRequest extends Request {
    files?: Files;
}

interface FileContext extends Context {
    request: FileRequest;
}

describe('Unit test: Lick endpoint', () => {
    let sandbox: SinonSandbox

    function stubGetLickRepository(fakeMethod: any): void {
        sandbox.stub(typeorm, "getManager").callsFake(() => {
            return {
                getRepository: sandbox.stub().withArgs(Lick).returns(fakeMethod)
            };
        });
    }

    beforeEach(() => {
        sandbox = createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    // DONT test any of the shared with, do that when implementing sharing

    // test get lick by id

    // test get lick audio

    // test create lick

    // test delete lick

    /**
     * Test getLick()
     */
    it('should GET public lick by id', async () => {
        const fakeLick: Lick = new Lick()
        fakeLick.isPublic = true;

        stubGetLickRepository({ findOne: function() { return fakeLick } });

        let params = {
            id: 1
        }
        const ctx = createMockContext();
        ctx.params = params
        await LickController.getLick(ctx)
        
        expect(ctx.status).toBe(200)
        expect(ctx.body).toBe(fakeLick)
    })
    it('should NOT GET lick by id if lick doesnt exist', async () => {
        const fakeLick: Lick = new Lick()

        stubGetLickRepository({ findOne: function() { return undefined } });

        // no id specified
        let params = {
        }
        const ctx = createMockContext();
        ctx.params = params
        await LickController.getLick(ctx)
        
        expect(ctx.status).toBe(400)
        expect(ctx.body).toContain("doesn't exist")
    })
    it('should GET private lick by id if user owns lick', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        const fakeLick: Lick = new Lick()
        fakeLick.isPublic = false;
        fakeLick.owner = lickOwner;

        stubGetLickRepository({ findOne: function() { return fakeLick } });

        let params = {
            id: 1
        }
        const ctx = createMockContext();
        ctx.params = params
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

        let params = {
            id: 1
        }
        const ctx = createMockContext();
        ctx.params = params
        ctx.state.user = lickQuerier;
        await LickController.getLick(ctx)
        
        expect(ctx.status).toBe(403)
        expect(ctx.body).toContain("do not have permission")
    })
    /**
     * Test getLickAudio()
     */
    it('should GET public lick audio by id', async () => {
        const fakeLick: Lick = new Lick()
        fakeLick.isPublic = true;

        // need to stub fs.readFile

        // going to need an integration test to really test this, but just happy path stuff

        // stop here and write integration tests to ensure the functionality actually works before writing unit tests for it

        stubGetLickRepository({ findOne: function() { return fakeLick } });

        let params = {
            id: 1
        }
        const ctx = createMockContext();
        ctx.params = params
        await LickController.getLick(ctx)
        
        expect(ctx.status).toBe(200)
        expect(ctx.body).toBe(fakeLick)
    })

    /**
     * Test createLick()
     */
    it('should create lick with valid data', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        const now: Date = new Date();
        sandbox.useFakeTimers(now.getTime()); // stub new Date() to return now

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

        sandbox.stub(LickController, "validateAudioFile").returns(null);
        sandbox.stub(LickController, "saveAudioFile").returns(fakeLick.audioFileLocation);
        sandbox.stub(audioDuration, "getAudioDurationInSeconds").returns(fakeLick.audioLength);
        stubGetLickRepository({ save: function() { return fakeLick } });

        let body = {
            name: fakeLick.name,
            description: fakeLick.description,
            tuning: fakeLick.tuning,
            isPublic: fakeLick.isPublic
        }
 
        const ctx: any = createMockContext();
        ctx.request.body = body;
        ctx.request.files = {};
        ctx.state.user = lickOwner;
        await LickController.createLick(ctx)
        
        expect(ctx.status).toBe(201)
        expect(ctx.body).toBe(fakeLick)
    })
    it('should NOT create lick with no name', async () => {
        const lickOwner: User = new User()
        lickOwner.id = 1 // must set id

        sandbox.stub(LickController, "validateAudioFile").returns(null);

        let body = {
            name: "",
            description: "",
            tuning: "standard",
            isPublic: false
        }
 
        const ctx: any = createMockContext();
        ctx.request.body = body;
        ctx.request.files = {};
        ctx.state.user = lickOwner;
        await LickController.createLick(ctx)
        
        expect(ctx.status).toBe(400)
        expect(ctx.body.length).toBeGreaterThanOrEqual(1)
    })
    it('should NOT create lick with invalid file', async () => {
        const ctx: any = createMockContext();
        ctx.request.files = {file: null};
        await LickController.createLick(ctx)
        
        expect(ctx.status).toBe(400)
        expect(ctx.body).toContain(" No file sent");
    })


    /**
     * Test deleteLick()
     */

})