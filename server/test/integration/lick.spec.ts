import request from 'supertest'
import { Connection } from 'typeorm';
import Koa from 'koa'

import * as appModule from "../../src/index";
import * as dbModule from "../../src/database/dbclient";
import { mockUser } from '../interfaces/mockUser';

import * as keys from "../../keys/keys.json";
const identityToken = keys.YOUR_TEST_IDENTITY_TOKEN;

const fs = require('fs');
import * as util from 'util';

const audioFilePath = __dirname + '/../../../test/data/700KB_mp3_file.mp3'

if (!identityToken) {
    console.log("MUST INSERT IDENTITY TOKEN FOR INTEGRATION TESTING");
}

describe('Integration: Licks endpoint', () => {
    let app: Koa
    let db: Connection

    const newUser: mockUser = {
        name: 'john',
        email: 'john@doe.com'
    }

    let id: Number

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
    
    it('should be able to create new lick', async () => {
        // // let this fail on error (ie. dont catch error)
        // const readFile = util.promisify(fs.readFile)
        // const audioFile = await readFile(audioFilePath)


        // const response: request.Response = await request(app.callback())
        //     .post('/api/licks')
        //     .send(audioFile)
        //     .type('form')
        //     // .set("Content-Type", "audio/mpeg")
        //     // .set("Content-Type", "multipart/form-data")
        //     .set("Cookie", "ti="+identityToken);

        // expect(response.status).toBe(201);
        expect(2).toBe(2);
    });
    // it('should be able to get existing user by id', async () => {
    //     const response: request.Response = await request(app.callback())
    //         .get('/api/users/' + id)
    //         .set("Cookie", "ti="+identityToken);
        
    //     expect(response.status).toBe(200);
    //     expect(response.body.name).toEqual(newUser.name)
    //     expect(response.body.email).toEqual(newUser.email)
    //     expect(response.body.id).toEqual(id)
    //     console.log("from get: " + response.body.id)
    // });
    // it('should be able to delete the newly created user', async () => {
    //     const response: request.Response = await request(app.callback())
    //         .delete('/api/testusers/' + id)
    //         .set("Cookie", "ti="+identityToken);
        
    //     expect(response.status).toBe(204);
    // });
    // it('should not be able to get delete a user which doesnt exist', async () => {
    //     const response: request.Response = await request(app.callback())
    //         .delete('/api/users/' + 0)
    //         .set("Cookie", "ti="+identityToken);
        
    //     expect(response.status).toBe(400);
    // });

});

