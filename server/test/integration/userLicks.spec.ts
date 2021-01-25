require('dotenv').config({ path: './.env.test' });

import request from 'supertest'
import { Connection } from 'typeorm';
import Koa from 'koa'

import * as appModule from "../../src/index";
import * as dbModule from "../../src/database/dbclient";

const IDENTITY_TOKEN = process.env.YOUR_TEST_IDENTITY_TOKEN;
if (!IDENTITY_TOKEN) throw new Error("MUST INSERT IDENTITY TOKEN FOR INTEGRATION TESTING");

const testDataDir = __dirname + '/../../../test/data/';

/**
 * Get user's licks test.
 *
 * This test was broken into its own test unit as it depends on functionality
 * in the lick endpoint (ie. uploading and deleting licks) and therefore shouldnt
 * be grouped into the user tests as this would increase coupling.
 *
 * LAST MODIFIED: Aug 24 2020
 */
describe('Integration: Users licks', () => {
    let app: Koa
    let db: Connection
    let lickIDs = []

    const licks = [
        {
            name: "lick1",
            tuning: "Standard",
            capo: 0,
            isPublic: "false", // must send as string, recieve as bool
            audioFilePath: testDataDir + '700KB_mp3_file_27s.mp3'
        },
        {
            name: "lick2",
            tuning: "Drop D",
            capo: 0,
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
            .field('capo', lick.capo)
            .field('skipTabbing', "true")
            .field('isPublic', lick.isPublic)
            .attach('file', lick.audioFilePath)
            .set("Cookie", "ti="+IDENTITY_TOKEN)
            lickIDs.push(response.body.id)
    }

    async function deleteLick(lickID): Promise<void> {
        await request(app.callback())
        .delete('/api/licks/' + lickID)
            .set("Cookie", "ti="+IDENTITY_TOKEN);
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
            .set("Cookie", "ti="+IDENTITY_TOKEN);

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
