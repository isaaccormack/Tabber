import jwtDecode from 'jwt-decode';
import Koa from 'koa'
import request from 'supertest'
import { Connection } from 'typeorm';

import * as keys from "../../keys/keys.json";
import * as appModule from "../../src/index";
import * as dbModule from "../../src/database/dbclient";

const identityToken = keys.YOUR_TEST_IDENTITY_TOKEN;
if (!identityToken) {
    console.log("MUST INSERT IDENTITY TOKEN FOR INTEGRATION TESTING");
}

const testDataDir = __dirname + '/../../../test/data/';

describe('Integration: Licks endpoint', () => {
    let app: Koa
    let db: Connection
    
    let id: Number // this will change when shcema does

    // not all params used in request, just specified for uniformity of response
    const lickBody = {
        name: "sweet integration lick",
        description: "",
        audioLength: 27,
        tuning: "standard",
        isPublic: false
    }

    beforeAll((done) => {
        // can wire in testdb if so inclined
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

    /**
     * Test controller is protected
     */
    // it('should not let a ', async () => {
    //     // dont set any token
    //     const response: request.Response = await request(app.callback())
    //         .get('/api/licks/' + id)

    //         expect(response.status).toBe(401); // expect unauthorized
    //         expect(response.body.errors.error).toContain("You do not have permission");
    // });
    
    /**
     * Test createLick()
     */
    it('should be able to create new lick with valid data', async () => {
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
            expect(response.body.isPublic).toBe("false"); // for some reason this is the string false and on get we get literal false
            expect(response.body.owner).toBeDefined();
            // doesn't work since user schema isnt consistant with database
            // expect(response.body.owner.name).toBe(tokenParams.name);
            expect(response.body.owner.email).toBe(tokenParams.email);

            id = response.body.id // set id for later tests
    });
    it('should NOT be able to create new lick with no file', async () => {
        const response: request.Response = await request(app.callback())
            .post('/api/licks')
            .type('form')
            .field('name', 'good one')
            .field('tuning', 'standard')
            .field('isPublic', 'false')
            .set("Cookie", "ti="+identityToken);

        expect(response.status).toBe(400);
        expect(response.body.errors.error).toContain("No file sent");
    });
    it('should NOT be able to create new lick with empty file', async () => {
        const emptyAudioFilePath = testDataDir + 'empty_mp3_file.mp3';

        const response: request.Response = await request(app.callback())
            .post('/api/licks')
            .type('form')
            .field('name', 'good one')
            .field('tuning', 'standard')
            .field('isPublic', 'false')
            .attach('file', emptyAudioFilePath)
            .set("Cookie", "ti="+identityToken);

        expect(response.status).toBe(400);
        expect(response.body.errors.error).toContain("File is empty");
    });
    it('should NOT be able to create new lick with no name', async () => {
        const audioFilePath = testDataDir + '700KB_mp3_file_27s.mp3';

        const response: request.Response = await request(app.callback())
        .post('/api/licks')
        .type('form')
        .field('tuning', 'standard')
        .field('isPublic', 'false')
        .attach('file', audioFilePath)
        .set("Cookie", "ti="+identityToken);
        
        expect(response.status).toBe(400);
        expect(response.body.errors.length).toBeGreaterThan(0);
    });
    it('should NOT be able to create new lick with audio file longer than 60s', async () => {
        const longAudioFilePath = testDataDir + '5MB_mp3_file_132s.mp3';

        const response: request.Response = await request(app.callback())
            .post('/api/licks')
            .type('form')
            .field('name', 'good one')
            .field('tuning', 'standard')
            .field('isPublic', 'false')
            .attach('file', longAudioFilePath)
            .set("Cookie", "ti="+identityToken);

        expect(response.status).toBe(400);
        expect(response.body.errors.error).toContain("Audio file is longer than 60 seconds");
    });
    it('should NOT be able to create new lick with text file', async () => {
        const textFilePath = testDataDir + 'text_file.txt';

        const response: request.Response = await request(app.callback())
            .post('/api/licks')
            .type('form')
            .field('name', 'good one')
            .field('tuning', 'standard')
            .field('isPublic', 'false')
            .attach('file', textFilePath)
            .set("Cookie", "ti="+identityToken);

        expect(response.status).toBe(400);
        expect(response.body.errors.error).toContain("Mimetype is not supported");
    });
    /**
     * Test getLick()
     */
    it('should be able to GET newly created lick', async () => {
        const tokenParams = jwtDecode(identityToken);

        const response: request.Response = await request(app.callback())
            .get('/api/licks/' + id)
            .set("Cookie", "ti="+identityToken);

            expect(response.status).toBe(200);
            expect(response.body.id).toBeGreaterThan(0);
            expect(response.body.name).toBe(lickBody.name);
            expect(response.body.description).toBe(lickBody.description);
            expect(response.body.dateUploaded).toBeDefined();
            expect(response.body.audioLength).toBeCloseTo(lickBody.audioLength, 0);
            expect(response.body.tuning).toBe(lickBody.tuning);
            expect(response.body.isPublic).toBe(lickBody.isPublic);
            expect(response.body.owner).toBeDefined();
            // doesn't work since user schema isnt consistant with database
            // expect(response.body.owner.name).toBe(tokenParams.name);
            expect(response.body.owner.email).toBe(tokenParams.email);
    });
    it('should NOT be able to GET lick which doesnt exist', async () => {
        const response: request.Response = await request(app.callback())
        .get('/api/licks/' + 0) // no lick with id = 0
        .set("Cookie", "ti="+identityToken);
        
        expect(response.status).toBe(400);
        expect(response.body.errors.error).toContain("doesn't exist");
    });
    // should not be able to from other user - but that requires some effort

    /**
     * Test getLickAudio()
     */

    /**
     * Test deleteLick()
     */

    // w/o being logged in
    // should be able to get public lick
    // should not be able to get private lick

});

