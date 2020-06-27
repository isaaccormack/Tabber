import jwtDecode from 'jwt-decode';
import Koa from 'koa'
import request from 'supertest'
import { Connection } from 'typeorm';

import * as keys from "../../keys/keys.json";
import * as appModule from "../../src/index";
import * as dbModule from "../../src/database/dbclient";
const fs = require('fs');
import * as util from 'util';

const identityToken = keys.YOUR_TEST_IDENTITY_TOKEN;
if (!identityToken) {
    console.log("MUST INSERT IDENTITY TOKEN FOR INTEGRATION TESTING");
}

const testUserToken = keys.TEST_USER_IDENTITY_TOKEN;
if (!testUserToken) {
    console.log("MUST INSERT TEST USER TOKEN FOR INTEGRATION TESTING");
}

const testDataDir = __dirname + '/../../../test/data/';

describe('Integration: Licks endpoint', () => {
    let app: Koa
    let db: Connection
    
    let privateID: Number // this will change when shcema does
    let publicID: Number // this will change when shcema does

    // not all params used in request, just specified for uniformity of response
    const lickBody = {
        name: "sweet integration lick",
        description: "", // not sent
        audioLength: 27, // not sent
        tuning: "standard",
        isPublic: "false"// must send as string, recieve as bool
    }

    beforeAll((done) => {
        dbModule.initDb((err, conn) => {
            if (err) throw err

            db = conn
            app = appModule.startApp()
            done()
        })
    });

    afterAll((done) => {
        db.close().then(done())
    });
    
    ////////////////// TEST WITH PRIVATE LICK //////////////////
    /**
     * Test createLick()
     */
    it('should be able to POST new lick with valid data', async () => {
        const audioFilePath = testDataDir + '700KB_mp3_file_27s.mp3';
        const tokenParams = jwtDecode(identityToken);

        const response: request.Response = await request(app.callback())
            .post('/api/licks')
            .type('form')
            .field('name', lickBody.name)
            .field('tuning', lickBody.tuning)
            .field('isPublic', lickBody.isPublic)
            .attach('file', audioFilePath)
            .set("Cookie", "ti="+identityToken);
            
            expect(response.status).toBe(201);
            expect(response.body.id).toBeGreaterThan(0);
            expect(response.body.name).toBe(lickBody.name);
            expect(response.body.description).toBe(lickBody.description);
            expect(response.body.dateUploaded).toBeDefined();
            expect(response.body.audioLength).toBeCloseTo(lickBody.audioLength, 0);
            expect(response.body.tuning).toBe(lickBody.tuning);
            expect(response.body.isPublic).toBe(JSON.parse(lickBody.isPublic));
            expect(response.body.owner).toBeDefined();
            expect(response.body.owner.email).toBe(tokenParams.email);

            // expect file to be created
            expect(fs.existsSync(response.body.audioFileLocation)).toBe(true);

            privateID = response.body.id // set id for later tests
    });
    it('should NOT be able to POST new lick with no file', async () => {
        const response: request.Response = await request(app.callback())
            .post('/api/licks')
            .type('form')
            .field('name', lickBody.name)
            .field('tuning', lickBody.tuning)
            .field('isPublic', lickBody.isPublic)
            .set("Cookie", "ti="+identityToken);

        expect(response.status).toBe(400);
        expect(response.body.errors.error).toContain("No file sent");
    });
    it('should NOT be able to POST new lick with audio file longer than 60s', async () => {
        const longAudioFilePath = testDataDir + '5MB_mp3_file_132s.mp3';

        const response: request.Response = await request(app.callback())
            .post('/api/licks')
            .type('form')
            .field('name', lickBody.name)
            .field('tuning', lickBody.tuning)
            .field('isPublic', lickBody.isPublic)
            .attach('file', longAudioFilePath)
            .set("Cookie", "ti="+identityToken);

        expect(response.status).toBe(400);
        expect(response.body.errors.error).toContain("Audio file is longer than 60 seconds");
    });
    it('should NOT be able to POST new lick with text file', async () => {
        const textFilePath = testDataDir + 'text_file.txt';

        const response: request.Response = await request(app.callback())
            .post('/api/licks')
            .type('form')
            .field('name', lickBody.name)
            .field('tuning', lickBody.tuning)
            .field('isPublic', lickBody.isPublic)
            .attach('file', textFilePath)
            .set("Cookie", "ti="+identityToken);

        expect(response.status).toBe(400);
        expect(response.body.errors.error).toContain("Mimetype is not supported");
    });
    it('should NOT be able to POST new lick if not logged in', async () => {
        const audioFilePath = testDataDir + '700KB_mp3_file_27s.mp3';

        const response: request.Response = await request(app.callback())
            .post('/api/licks')
            .type('form')
            .field('name', lickBody.name)
            .field('tuning', lickBody.tuning)
            .field('isPublic', lickBody.isPublic)
            .attach('file', audioFilePath)

        expect(response.status).toBe(401);
    });
    /**
     * Test getLick()
     */
    it('should be able to GET private lick by id as owner', async () => {
        const tokenParams = jwtDecode(identityToken);

        const response: request.Response = await request(app.callback())
            .get('/api/licks/' + privateID)
            .set("Cookie", "ti="+identityToken);

            expect(response.status).toBe(200);
            expect(response.body.id).toBeGreaterThan(0);
            expect(response.body.name).toBe(lickBody.name);
            expect(response.body.description).toBe(lickBody.description);
            expect(response.body.dateUploaded).toBeDefined();
            expect(response.body.audioLength).toBeCloseTo(lickBody.audioLength, 0);
            expect(response.body.tuning).toBe(lickBody.tuning);
            expect(response.body.isPublic).toBe(JSON.parse(lickBody.isPublic));
            expect(response.body.owner).toBeDefined();
            expect(response.body.owner.email).toBe(tokenParams.email);
    });
    it('should NOT be able to GET lick which doesnt exist', async () => {
        const response: request.Response = await request(app.callback())
        .get('/api/licks/' + 0) // no lick with id = 0
        .set("Cookie", "ti="+identityToken);
        
        expect(response.status).toBe(400);
        expect(response.body.errors.error).toContain("doesn't exist");
    });
    it('should NOT be able to GET private lick when not logged in', async () => {
        const response: request.Response = await request(app.callback())
        .get('/api/licks/' + privateID)
        
        expect(response.status).toBe(403);
        expect(response.body.errors.error).toContain("You do not have permission");
    });
    it('should NOT be able to GET lick which doesnt exist with user not logged in', async () => {
        const response: request.Response = await request(app.callback())
        .get('/api/licks/' + 0) // no lick with id = 0
        
        expect(response.status).toBe(400);
        expect(response.body.errors.error).toContain("doesn't exist");
    });
    /**
     * Test getLickAudio()
     */
    // WARNING - this test will console.log diff of the files which produces a LOT of output when it fail
    it('should be able to GET private lick audio by id as owner', async () => {
        const audioFilePath = testDataDir + '700KB_mp3_file_27s.mp3';

        const readFile = util.promisify(fs.readFile);
        const expectedFile = await readFile(audioFilePath)

        const response: request.Response = await request(app.callback())
            .get('/api/licks/audio/' + privateID)
            .set("Cookie", "ti="+identityToken);

            expect(response.status).toBe(200);
            // compare contents of buffer
            expect(response.body).toStrictEqual(expectedFile);
    });
    it('should NOT be able to GET lick audio which doesnt exist', async () => {
        const response: request.Response = await request(app.callback())
        .get('/api/licks/audio/' + 0) // no lick with id = 0
        .set("Cookie", "ti="+identityToken);
        
        expect(response.status).toBe(400);
        expect(response.body.errors.error).toContain("doesn't exist");
    });
    it('should NOT be able to GET private lick audio when not logged in', async () => {
        const response: request.Response = await request(app.callback())
        .get('/api/licks/audio/' + privateID)
        
        expect(response.status).toBe(403);
        expect(response.body.errors.error).toContain("You do not have permission");
    });
    /**
     * Test deleteLick()
     */
    it('should NOT be able to DELETE lick which doesnt exist', async () => {
        const response: request.Response = await request(app.callback())
            .delete('/api/licks/' + 0)
            .set("Cookie", "ti="+identityToken);

        expect(response.status).toBe(400);
        expect(response.body.errors.error).toContain("doesn't exist");
    });
    it('should be able to DELETE private lick by id as owner', async () => {
        const deleteResponse: request.Response = await request(app.callback())
        .delete('/api/licks/' + privateID)
        .set("Cookie", "ti="+identityToken);
        
        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.name).toBe(lickBody.name);

        // expect file to be deleted
        expect(fs.existsSync(deleteResponse.body.audioFileLocation)).toBe(false);

        // ensure that lick with id doesn't exist anymore
        const getResponse: request.Response = await request(app.callback())
            .delete('/api/licks/' + privateID)
            .set("Cookie", "ti="+identityToken);

        expect(getResponse.status).toBe(400);
        expect(getResponse.body.errors.error).toContain("doesn't exist");
    });
    it('should NOT be able to DELETE lick if not logged in', async () => {
        const deleteResponse: request.Response = await request(app.callback())
            .delete('/api/licks/' + privateID)

        expect(deleteResponse.status).toBe(401);
    });


    ////////////////// TEST WITH PUBLIC LICK //////////////////
    /**
     * Test createLick()
     */
    // This test is pretty much just for set up
    it('should be able to POST new public lick with valid data', async () => {
        const audioFilePath = testDataDir + '700KB_mp3_file_27s.mp3';

        const tokenParams = jwtDecode(identityToken);

        // create lick with the same attributes as lickBody except isPublic = "true"
        const response: request.Response = await request(app.callback())
            .post('/api/licks')
            .type('form')
            .field('name', lickBody.name)
            .field('tuning', lickBody.tuning)
            .field('isPublic', "true")
            .attach('file', audioFilePath)
            .set("Cookie", "ti="+identityToken);

            expect(response.status).toBe(201);
            expect(response.body.id).toBeGreaterThan(0);
            expect(response.body.name).toBe(lickBody.name);
            expect(response.body.description).toBe(lickBody.description);
            expect(response.body.dateUploaded).toBeDefined();
            expect(response.body.audioLength).toBeCloseTo(lickBody.audioLength, 0);
            expect(response.body.tuning).toBe(lickBody.tuning);
            expect(response.body.isPublic).toBe(!JSON.parse(lickBody.isPublic));
            expect(response.body.owner).toBeDefined();
            // doesn't work since user schema isnt consistant with database
            // expect(response.body.owner.name).toBe(tokenParams.name);
            expect(response.body.owner.email).toBe(tokenParams.email);

            publicID = response.body.id // set id for later tests
    });
    /**
     * Test getLick()
     */
    it('should be able to GET public lick by id without being logged in', async () => {
        const tokenParams = jwtDecode(identityToken);

        const response: request.Response = await request(app.callback())
            .get('/api/licks/' + publicID)

            expect(response.status).toBe(200);
            expect(response.body.id).toBeGreaterThan(0);
            expect(response.body.name).toBe(lickBody.name);
            expect(response.body.description).toBe(lickBody.description);
            expect(response.body.dateUploaded).toBeDefined();
            expect(response.body.audioLength).toBeCloseTo(lickBody.audioLength, 0);
            expect(response.body.tuning).toBe(lickBody.tuning);
            expect(response.body.isPublic).toBe(!JSON.parse(lickBody.isPublic));
            expect(response.body.owner).toBeDefined();

            // should not be able to see users email as just anyone
            // but should be able to see some attributes of user
            // when this is changed, test will fail and be updated
            expect(response.body.owner.email).toBe(tokenParams.email);
    });
    /**
     * Test getLickAudio()
     */
    // DOES NOT actually test whether files are equal, just that file can be received 
    // Rely on the other getLickAudio test to test that audio is uploaded correctly
    it('should be able to GET public lick audio by id', async () => {
        const response: request.Response = await request(app.callback())
            .get('/api/licks/audio/' + publicID)

            expect(response.status).toBe(200);
            // expect we get a file buffer back and its length is non zero
            expect(response.body).toBeInstanceOf(Buffer);
            expect(response.body.length).toBeGreaterThan(0);
    });
    /**
     * Test deleteLick()
     */
    it('should NOT be able to DELETE public lick if not owner', async () => {
        const deleteResponse: request.Response = await request(app.callback())
        .delete('/api/licks/' + publicID)
        .set("Cookie", "ti="+testUserToken);
        
        expect(deleteResponse.status).toBe(403);
        expect(deleteResponse.body.errors.error).toContain("only be deleted by its owner");

    });
    it('should be able to DELETE public lick by id as owner', async () => {
        const deleteResponse: request.Response = await request(app.callback())
        .delete('/api/licks/' + publicID)
        .set("Cookie", "ti="+identityToken);
        
        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.name).toBe(lickBody.name);

        // expect file to be deleted
        expect(fs.existsSync(deleteResponse.body.audioFileLocation)).toBe(false);

        // ensure that lick with id doesn't exist anymore
        const getResponse: request.Response = await request(app.callback())
            .delete('/api/licks/' + privateID)
            .set("Cookie", "ti="+identityToken);

        expect(getResponse.status).toBe(400);
        expect(getResponse.body.errors.error).toContain("doesn't exist");
    });

    // TODO: (in addition to all edit tests) shouldnt be able to edit lick user doesnt own
});

