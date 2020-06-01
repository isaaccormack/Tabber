import request from 'supertest'
import { Connection } from 'typeorm';
import Koa from 'koa'

import * as appModule from "../../src/index";
import * as dbModule from "../../src/database/dbclient";
import { mockUser } from '../interfaces/mockUser';

describe('Integration: Users endpoint', () => {
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
    
    it('should send back array of users', async () => {
        const response: request.Response = await request(app.callback()).get('/api/users')

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(0)
    });
    it('should be able to create new user', async () => {
        const response: request.Response = await request(app.callback()).post('/api/users').send(newUser)

        expect(response.status).toBe(201);
        expect(response.body.name).toEqual(newUser.name)
        expect(response.body.email).toEqual(newUser.email)
        expect(response.body.id).toBeGreaterThan(0)
        id = response.body.id
        console.log("from create: " + id)
    });
    it('should be able to get existing user by id', async () => {
        const response: request.Response = await request(app.callback()).get('/api/users/' + id)
        
        expect(response.status).toBe(200);
        expect(response.body.name).toEqual(newUser.name)
        expect(response.body.email).toEqual(newUser.email)
        expect(response.body.id).toEqual(id)
        console.log("from get: " + response.body.id)
    });
    it('should be able to delete the newly created user', async () => {
        const response: request.Response = await request(app.callback()).delete('/api/testusers/' + id)
        
        expect(response.status).toBe(204);
    });
    it('should not be able to get delete a user which doesnt exist', async () => {
        const response: request.Response = await request(app.callback()).delete('/api/users/' + 0)
        
        expect(response.status).toBe(400);
    });

});

