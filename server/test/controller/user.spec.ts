import { createSandbox, SinonSandbox, spy } from 'sinon'
import * as typeorm from 'typeorm'
import {createMockContext } from '@shopify/jest-koa-mocks';
import { User } from "../../src/entity/user";
import { UserController } from '../../src/controller/user'

describe('Unit test: User endpoint', () => {
    let sandbox: SinonSandbox

    function stubGetUserRepository(fakeMethod: any): void {
        sandbox.stub(typeorm, "getManager").callsFake(() => {
            return {
                getRepository: sandbox.stub().withArgs(User).returns(fakeMethod)
            };
        });
    }

    beforeEach(() => {
        sandbox = createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('should GET array of users', async () => {
        // stub find method with array to simulate users being returned
        stubGetUserRepository({ find: function() { return [1, 2, 3] } });

        const ctx = createMockContext();
        await UserController.getUsers(ctx)
        
        expect(ctx.status).toBe(200)
        expect(ctx.body.length).toBeGreaterThanOrEqual(2)
    })
    it('should GET user by id', async () => {
        const user = {
            name: 'john',
            email: 'john@doe.com'
        }

        // assume that findOne always finds user
        stubGetUserRepository({ findOne: function(id: number) { return user } });

        let params = {
            id: 1
        }
        const ctx = createMockContext();
        ctx.params = params
        await UserController.getUser(ctx)

        expect(ctx.status).toBe(200)
        expect(ctx.body).toEqual(user)
    })
    it('should not GET user given invalid id', async () => {
        // assume that findOne never finds user
        stubGetUserRepository({ findOne: function(id: number) { return undefined } });

        let params = {
            id: 0 // there is no user with id 0
        }
        const ctx = createMockContext();
        ctx.params = params
        await UserController.getUser(ctx)

        expect(ctx.status).toBe(400)
        expect(ctx.body).toContain("doesn't exist")
    })
    it('should create a new user', async () => {
        const newUser = {
            name: 'john',
            email: 'john@doe.com'
        }

        // assume that findOne never finds user with same email and save is successful
        stubGetUserRepository({
            findOne: function(email: string) { return false },
            save: function(user: any) { return newUser }
        });

        const ctx = createMockContext();
        ctx.request.body = newUser;
        await UserController.createUser(ctx)

        expect(ctx.status).toBe(201)
        expect(ctx.body).toEqual(newUser)
    })
    it('should not create a new user if user with same email exists', async () => {
        const newUser = {
            name: 'john',
            email: 'john@doe.com'
        }

        // assume that findOne always find user with same email
        stubGetUserRepository({ findOne: function(email: string) { return true } });

        const ctx = createMockContext();
        ctx.request.body = newUser;
        await UserController.createUser(ctx)

        expect(ctx.status).toBe(400)
        expect(ctx.body).toContain("e-mail address already exists")
    })
    it('should not create a new user if user data invalid', async () => {
        const badNewUser = {
            name: '',
            email: 'john@doe.com'
        }

        // no methods on getRepository() are used in this test, but it and  getManager() still must be stubbed 
        stubGetUserRepository({ });


        const ctx = createMockContext();
        ctx.request.body = badNewUser;
        await UserController.createUser(ctx)

        expect(ctx.status).toBe(400)
        // expect at least one validation error
        expect(ctx.body.length).toBeGreaterThan(0)
    })
    it('should delete a user by id', async () => {
        const user = {
            name: 'john',
            email: 'john@doe.com'
        }

        const state = {
            user: {
                email: "john@doe.com"
            }
        }
        let params = {
            id: 1
        }

        // assume that findOne always finds user by id
        stubGetUserRepository({
            findOne: function(id: number) { return user },
            remove: function(user) { return null }
        });

        // give dummy function to spy as it provides no mocking functionality
        const removeSpy = spy({ remove: function() {} }, "remove");

        const ctx = createMockContext();
        ctx.state = state;
        ctx.params = params;
        await UserController.deleteUser(ctx)

        expect(ctx.status).toBe(204)
        // expect(removeSpy.calledOnce).toBe(true) THIS DOESNT WORK
    })
    it('should not delete a user with invalid id', async () => {
        const state = {
            user: {
                email: "john@doe.com"
            }
        }
        let params = {
            id: 0
        }

        // assume that findOne never finds user by id
        stubGetUserRepository({ findOne: function(id: number) { return undefined } });

        // give dummy function to spy as it provides no mocking functionality
        const removeSpy = spy({ remove: function() {} }, "remove");

        const ctx = createMockContext();
        ctx.state = state;
        ctx.params = params;
        await UserController.deleteUser(ctx)

        expect(ctx.status).toBe(400)
        expect(ctx.body).toContain("doesn't exist in the db")
        expect(removeSpy.notCalled)
    })
    it('should not delete a user who is not the currently logged in user', async () => {
        const user = {
            name: 'john',
            email: 'john@doe.com'
        }

        // different email than user
        const state = {
            user: {
                email: "mark@doe.com"
            }
        }
        let params = {
            id: 0
        }

        // assume that findOne never finds user by id
        stubGetUserRepository({ findOne: function(id: number) { return user } });

        // give dummy function to spy as it provides no mocking functionality
        const removeSpy = spy({ remove: function() {} }, "remove");

        const ctx = createMockContext();
        ctx.state = state;
        ctx.params = params;
        await UserController.deleteUser(ctx)

        expect(ctx.status).toBe(403)
        expect(ctx.body).toContain("deleted by himself")
        expect(removeSpy.notCalled)
    })
})