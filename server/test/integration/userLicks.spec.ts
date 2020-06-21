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

const testDataDir = __dirname + '/../../../test/data/';

// This test could be in user.spec.ts, but it was made its own test to lower
// coupling between test suites.
// And theres lots of setup which is irrelevent to all other user tests.
describe('Integration: Users licks', () => {
    let app: Koa
    let db: Connection
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

    beforeAll((done) => {
        dbModule.initDb((err, conn) => {
            if (err) throw err

            db = conn
            app = appModule.startApp()

            uploadLick(licks[0]).then(() => {
                return uploadLick(licks[1])
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
    
    it('should GET auth users licks', async () => {
        const response: request.Response = await request(app.callback())
            .get('/api/user/licks')
            .set("Cookie", "ti="+identityToken);
        
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(2);
        expect(response.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({id: lickIDs[0]}),
              expect.objectContaining({name: licks[0].name}),
              expect.objectContaining({id: lickIDs[1]}),
              expect.objectContaining({name: licks[1].name})
            ])
          );
    });
});