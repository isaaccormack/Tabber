import request from 'supertest'
import { Connection } from 'typeorm';
import Koa from 'koa'

import * as appModule from "../../src/index";
import * as dbModule from "../../src/database/dbclient";

import * as keys from "../../keys/keys.json";
const identityToken = keys.YOUR_TEST_IDENTITY_TOKEN;

if (!identityToken) {
    console.log("MUST INSERT IDENTITY TOKEN FOR INTEGRATION TESTING");
}

const testUserToken = keys.TEST_USER_IDENTITY_TOKEN;
if (!testUserToken) {
    console.log("MUST INSERT TEST USER TOKEN FOR INTEGRATION TESTING");
}

const testDataDir = __dirname + '/../../../test/data/';

/**
 * Lick sharing tests.
 * 
 * These tests focus on only the lick sharing aspects of functionality implemented in the
 * user and lick controllers.
 * 
 * NOTES:
 * - These tests assume the the user.spec.ts and lick.spec.ts integration tests all pass.
 *   Specifically, the ability to create, get, and delete licks is needed in setup for these
 *   tests. These tests also test the sharing functionality of these endpoints.
 * 
 * - These tests are directly dependent on each other. It is sometimes noted when the dependency
 *   is obscure, but mostly this is implied (ie. getting a shared lick must come after a lick was
 *   shared).
 * 
 * PRECONDITION:
 * - The database must not contain any records on any of the data used in this test before the 
 *   test is run. To make things easy, the database should be empty intially.
 * 
 * LAST MODIFIED: June 21 2020
 */
describe('Integration: Users shared licks', () => {
    let app: Koa
    let db: Connection
    let testUserID: number
    let lickIDs = []

    const licks = [
        {
            name: "lick1",
            tuning: "standard",
            isPublic: "false", // must send as string, recieve as bool
            audioFilePath: testDataDir + '700KB_mp3_file_27s.mp3'
        },
        {
            name: "lick2",
            tuning: "drop d",
            isPublic: "false", // must send as string, recieve as bool
            audioFilePath: testDataDir + '400KB_wav_file_2s.wav'
        }
    ]

    async function uploadLick(lick): Promise<void> {
        const response: request.Response = await request(app.callback())
            .post('/api/licks')
            .type('form')
            .field('name', lick.name)
            .field('tuning', lick.tuning)
            .field('isPublic', lick.isPublic)
            .attach('file', lick.audioFilePath)
            .set("Cookie", "ti="+identityToken)
            lickIDs.push(response.body.id)
    }

    async function deleteLick(lickID): Promise<void> {
        await request(app.callback())
        .delete('/api/licks/' + lickID)
            .set("Cookie", "ti="+identityToken);
    }

    async function getTestUserID(): Promise<void> {
        const response: request.Response = await request(app.callback())
        .get('/api/user')
        .set("Cookie", "ti="+testUserToken);
        testUserID = response.body.id;
    }

    beforeAll((done) => {
        dbModule.initDb((err, conn) => {
            if (err) throw err

            db = conn
            app = appModule.startApp()

            uploadLick(licks[0]).then(() => {
                return uploadLick(licks[1])
            }).then(() => {
                return getTestUserID()
            }).then(() => {
                done()
            })
        })

    });

    afterAll((done) => {
        deleteLick(lickIDs[0]).then(() => {
            return deleteLick(lickIDs[1])
        }).then(() => {
            return db.close()
        }).then(() => {
            done()
        })
    });
    
    /**
     * Test shareLick() and getLicksSharedWithAuthUser()
     */
    it('should allow the auth user to SHARE a lick with the test user', async () => {
        const shareRes: request.Response = await request(app.callback())
            .put('/api/lick/share/' + lickIDs[0])
            .type('form')
            .field('userID', testUserID)
            .set("Cookie", "ti="+identityToken);

        // expect the newly created lick to only be shared with test user
        expect(shareRes.status).toBe(200);
        expect(shareRes.body.sharedWith.length).toBe(1);
        expect(shareRes.body.sharedWith[0].name).toBe('Test User');
        expect(shareRes.body.sharedWith[0].id).toBe(testUserID);

        const userRes: request.Response = await request(app.callback())
        .get('/api/user/licksSharedWithMe')
        .set("Cookie", "ti="+testUserToken);
    
        // expect the lick to be shared with the test user
        expect(userRes.status).toBe(200);
        expect(userRes.body.length).toBe(1);
        expect(userRes.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({id: lickIDs[0]}),
              expect.objectContaining({name: licks[0].name}),
            ])
          );
    });
    // DEPENDS ON ABOVE TEST ('should allow the auth user to SHARE a lick with the test user')
    it('should silently allow a lick to be shared with the same user twice', async () => {
        const shareRes: request.Response = await request(app.callback())
            .put('/api/lick/share/' + lickIDs[0])
            .type('form')
            .field('userID', testUserID)
            .set("Cookie", "ti="+identityToken);

        // expect the shared with state of the lick to be the same as before
        expect(shareRes.status).toBe(200);
        expect(shareRes.body.sharedWith.length).toBe(1);
        expect(shareRes.body.sharedWith[0].name).toBe('Test User');
        expect(shareRes.body.sharedWith[0].id).toBe(testUserID);

        const userRes: request.Response = await request(app.callback())
        .get('/api/user/licksSharedWithMe')
        .set("Cookie", "ti="+testUserToken);
    
        // expect the lick to be shared with the test user
        expect(userRes.status).toBe(200);
        expect(userRes.body.length).toBe(1);
        expect(userRes.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({id: lickIDs[0]}),
              expect.objectContaining({name: licks[0].name})
            ])
          );
    });
    it('should allow auth user to SHARE another lick (mostly for setup of later tests)', async () => {
        const shareRes: request.Response = await request(app.callback())
        .put('/api/lick/share/' + lickIDs[1])
        .type('form')
        .field('userID', testUserID)
        .set("Cookie", "ti="+identityToken);

        // expect the newly created lick to only be shared with test user
        expect(shareRes.status).toBe(200);
        expect(shareRes.body.sharedWith.length).toBe(1);
        expect(shareRes.body.sharedWith[0].name).toBe('Test User');
        expect(shareRes.body.sharedWith[0].id).toBe(testUserID);

        const userRes: request.Response = await request(app.callback())
        .get('/api/user/licksSharedWithMe')
        .set("Cookie", "ti="+testUserToken);

        // expect the lick to be shared with the test user
        expect(userRes.status).toBe(200);
        expect(userRes.body.length).toBe(2);
        expect(userRes.body).toEqual(
            expect.arrayContaining([
            expect.objectContaining({id: lickIDs[0]}),
            expect.objectContaining({name: licks[0].name}),
            expect.objectContaining({id: lickIDs[1]}),
            expect.objectContaining({name: licks[1].name})
            ])
        );
    });
    /**
     * Test getLick() -> From user lick is shared with
     */
    it('should be able to GET lick shared with user', async () => {
        const response: request.Response = await request(app.callback())
            .get('/api/licks/' + lickIDs[0])
            .set("Cookie", "ti="+testUserToken);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(lickIDs[0]);
            expect(response.body.name).toBe(licks[0].name);
    });
    /**
     * Test getLickAudio() -> From user lick is shared with
     */
    it('should be able to GET lick audio shared with user', async () => {
        const response: request.Response = await request(app.callback())
            .get('/api/licks/audio/' + lickIDs[0])
            .set("Cookie", "ti="+testUserToken);

            expect(response.status).toBe(200);
            // expect we get a file buffer back and its length is non zero
            expect(response.body).toBeInstanceOf(Buffer);
            expect(response.body.length).toBeGreaterThan(0);
    });
    /**
     * Test unshareLick()
     */
    it('should allow auth user to UNSHARE a lick with test user', async () => {
        const shareRes: request.Response = await request(app.callback())
        .put('/api/lick/unshare/' + lickIDs[0])
        .type('form')
        .field('userID', testUserID)
        .set("Cookie", "ti="+identityToken);

        // expect the lick to not be shared with anyone
        expect(shareRes.status).toBe(200);
        expect(shareRes.body.name).toBe('lick1');
        expect(shareRes.body.sharedWith.length).toBe(0);

        const userRes: request.Response = await request(app.callback())
        .get('/api/user/licksSharedWithMe')
        .set("Cookie", "ti="+testUserToken);

        // expect the lick with lickIDs[0] to be unshared with user 
        expect(userRes.status).toBe(200);
        expect(userRes.body.length).toBe(1);
        expect(userRes.body).toEqual(
            expect.arrayContaining([
            expect.objectContaining({id: lickIDs[1]}),
            expect.objectContaining({name: licks[1].name})
            ])
        );
    });
    it('should allow auth user to UNSHARE a lick with a user who it was never shared with', async () => {
        const shareRes: request.Response = await request(app.callback())
        .put('/api/lick/unshare/' + lickIDs[0])
        .type('form')
        .field('userID', testUserID)
        .set("Cookie", "ti="+identityToken);

        // expect the lick to still not be shared with anyone
        expect(shareRes.status).toBe(200);
        expect(shareRes.body.sharedWith.length).toBe(0);

        const userRes: request.Response = await request(app.callback())
        .get('/api/user/licksSharedWithMe')
        .set("Cookie", "ti="+testUserToken);

        // expect the licks shared with the test user to remain the same
        expect(userRes.status).toBe(200);
        expect(userRes.body.length).toBe(1);
        expect(userRes.body).toEqual(
            expect.arrayContaining([
            expect.objectContaining({id: lickIDs[1]}),
            expect.objectContaining({name: licks[1].name})
            ])
        );
    });   
    /**
    * Test getLick() -> From user lick is shared with
    */
   it('should NOT be able to GET private lick NOTs shared with user', async () => {
       const response: request.Response = await request(app.callback())
       .get('/api/licks/' + lickIDs[0])
       .set("Cookie", "ti="+testUserToken);
       
       expect(response.status).toBe(403);
       expect(response.body.errors.error).toContain("You do not have permission");
    });
    /**
     * Test getLickAudio() -> From user lick is shared with
     */
    it('should NOT be able to GET private lick audio NOT shared with user', async () => {
    const response: request.Response = await request(app.callback())
        .get('/api/licks/audio/' + lickIDs[0])
        .set("Cookie", "ti="+testUserToken);

        expect(response.status).toBe(403);
        expect(response.body.errors.error).toContain("You do not have permission");
    });
    /**
     * Test unfollowLick()
     */
    it('should allow a user to UNFOLLOW a lick', async () => {
        const shareRes: request.Response = await request(app.callback())
        .put('/api/lick/unfollow/' + lickIDs[1])
        .type('form')
        .field('userID', testUserID)
        .set("Cookie", "ti="+testUserToken);

        expect(shareRes.status).toBe(204);

        // GET lick to see that it has been unfollowed by test user
        const lickRes: request.Response = await request(app.callback())
        .get('/api/licks/' + lickIDs[1])
        .set("Cookie", "ti="+identityToken);

        expect(lickRes.status).toBe(200);
        expect(lickRes.body.name).toBe('lick2');
        expect(lickRes.body.sharedWith.length).toBe(0);

        // GET user to see they no longer have the lick shared with them
        const userRes: request.Response = await request(app.callback())
        .get('/api/user/licksSharedWithMe')
        .set("Cookie", "ti="+testUserToken);

        // expect the test user to have no licks shared with them
        expect(userRes.status).toBe(200);
        expect(userRes.body.length).toBe(0);
    });
    // DEPENDS ON ABOVE TEST ('should allow a user to UNFOLLOW a lick')
    it('should allow a user to silently UNFOLLOW a lick they dont follow', async () => {
        // do the same test as above and expect same results, ie. no harm in unfollowing

        const shareRes: request.Response = await request(app.callback())
        .put('/api/lick/unfollow/' + lickIDs[1])
        .type('form')
        .field('userID', testUserID)
        .set("Cookie", "ti="+testUserToken);

        expect(shareRes.status).toBe(204);

        // GET lick to see that it has been unfollowed by test user
        const lickRes: request.Response = await request(app.callback())
        .get('/api/licks/' + lickIDs[1])
        .set("Cookie", "ti="+identityToken);

        expect(lickRes.status).toBe(200);
        expect(lickRes.body.name).toBe('lick2');
        expect(lickRes.body.sharedWith.length).toBe(0);

        // GET user to see they no longer have the lick shared with them
        const userRes: request.Response = await request(app.callback())
        .get('/api/user/licksSharedWithMe')
        .set("Cookie", "ti="+testUserToken);

        // expect the test user to have no licks shared with them
        expect(userRes.status).toBe(200);
        expect(userRes.body.length).toBe(0);
    });
});