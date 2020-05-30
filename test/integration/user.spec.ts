import request from 'supertest'
import { Connection } from 'typeorm';
import { Server } from 'http';

describe('Integration: Users endpoint', () => {

    var dbModule = require("../../src/database/dbclient");
    var appModule = require("../../src/index");
    let app: Server
    let db: Connection

    // should make type or use type interface that exists in app
    // currently cant delete user without going into db, so just
    // increment number on email to ensure unique email everytime
    // NOT DOING THIS WILL CAUSE TESTS TO FAIL
    const newUser = {
        name: 'john',
        email: 'john@doe.com' // MUST increment this every test currently
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
        app.close()
        db.close().then(done())
    });
    
    it('should send back array of users', async () => {
        const response: request.Response = await request(app).get('/api/users')

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(0)
    });
    it('should be able to create new user', async () => {
        const response: request.Response = await request(app).post('/api/users').send(newUser)

        expect(response.status).toBe(201);
        expect(response.body.name).toEqual(newUser.name)
        expect(response.body.email).toEqual(newUser.email)
        expect(response.body.id).toBeGreaterThan(0)
        id = response.body.id
        console.log("from create: " + id)
    });
    it('should be able to get existing user by id', async () => {
        const response: request.Response = await request(app).get('/api/users/' + id)
        
        expect(response.status).toBe(200);
        expect(response.body.name).toEqual(newUser.name)
        expect(response.body.email).toEqual(newUser.email)
        expect(response.body.id).toEqual(id)
        console.log("from get: " + response.body.id)
    });
    it('should be able to delete the newly created user', async () => {
        const response: request.Response = await request(app).delete('/api/testusers/' + id)
        
        expect(response.status).toBe(204);
    });
    it('should not be able to get delete a user which doesnt exist', async () => {
        const response: request.Response = await request(app).delete('/api/users/' + 0)
        
        expect(response.status).toBe(400);
    });

});

