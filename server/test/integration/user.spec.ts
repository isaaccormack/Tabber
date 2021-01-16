require('dotenv').config({ path: './.env.test' });

import request from 'supertest'
import { Connection } from 'typeorm';
import Koa from 'koa'

import * as appModule from "../../src/index";
import * as dbModule from "../../src/database/dbclient";

var jwtDecode = require('jwt-decode');

const IDENTITY_TOKEN = process.env.YOUR_TEST_IDENTITY_TOKEN;
if (!IDENTITY_TOKEN) throw new Error("MUST INSERT IDENTITY TOKEN FOR INTEGRATION TESTING");


/**
 * User tests.
 *
 * Testing of basic functionality in the user endpoint.
 *
 * LAST MODIFIED: June 21 2020
 */
describe('Integration: Users endpoint', () => {
    let app: Koa
    let db: Connection
    let id: Number

    const token = jwtDecode(IDENTITY_TOKEN);

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

    it('should GET currently authenticated user', async () => {
        console.log('IDENTITY_TOKEN')
        console.log(IDENTITY_TOKEN)

        // since the user is initialzed with the data in the jwt,
        // the user returned is guaranteed to have at least as much
        // data as that in the jwt token
        const response: request.Response = await request(app.callback())
        .get('/api/user')
        .set("Cookie", "ti="+IDENTITY_TOKEN);

        expect(response.status).toBe(200);
        expect(response.body.name).toEqual(token.name)
        expect(response.body.email).toEqual(token.email)
        expect(response.body.id).toBeGreaterThan(0)

        id = response.body.id;
    });
    it('should GET all users', async () => {
        const response: request.Response = await request(app.callback())
            .get('/api/users')
            .set("Cookie", "ti="+IDENTITY_TOKEN);

        expect(response.status).toBe(200);
        // since at least the account created above exists
        expect(response.body.length).toBeGreaterThan(0)
    });
    it('should GET user by id', async () => {
        const response: request.Response = await request(app.callback())
            .get('/api/users/' + id)
            .set("Cookie", "ti="+IDENTITY_TOKEN);

        expect(response.status).toBe(200);
        expect(response.body.name).toEqual(token.name)
        expect(response.body.email).toEqual(token.email)
        expect(response.body.id).toEqual(id)
    });
    it('should DELETE the new user', async () => {
        const response: request.Response = await request(app.callback())
            .delete('/api/user')
            .set("Cookie", "ti="+IDENTITY_TOKEN);

        expect(response.status).toBe(204);

        // expect there to no longer exist a user with the deleted id
        const res: request.Response = await request(app.callback())
            .get('/api/users/' + id)
            .set("Cookie", "ti="+IDENTITY_TOKEN);

        expect(res.status).toBe(400);
        expect(res.body.errors.error).toContain("doesn't exist in the db");
    });

});

