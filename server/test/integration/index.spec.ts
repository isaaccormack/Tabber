import request from 'supertest'
import { Connection } from 'typeorm';
import Koa from 'koa'

import * as appModule from "../../src/index";
import * as dbModule from "../../src/database/dbclient";

describe('Integration: Home page', () => {
    let app: Koa
    let db: Connection

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
    
    it('should say render an html page"', async () => {
        const response: request.Response = await request(app.callback()).get('/')

        expect(response.status).toBe(200);
        expect(response.text).toContain('<!doctype html>');
    });
});


