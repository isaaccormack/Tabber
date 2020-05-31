import { createSandbox, SinonSandbox } from 'sinon'
import * as typeorm from 'typeorm'
import {createMockContext } from '@shopify/jest-koa-mocks';

import { mockUser } from '../interfaces/mockUser';
import { User } from "../../src/entity/user";
import { UserController } from '../../src/controller/user'

describe('Unit test: Users endpoint', () => {
    let sandbox: SinonSandbox
    let userRepositoryMock

    const newUser: mockUser = {
        name: 'john',
        email: 'john@doe.com'
    }

    const badNewUser: mockUser = {
        name: '',
        email: 'john@doe.com'
    }

    // could make a type interface for this test thing
    function createFakeRepository() {
    return {
        save: function() {},
        findOne: function(id: Number) { if (id == 0) {return undefined} else {return newUser}},
        find: function() {return [1, 2, 3]}
        // others
        }
    }

    const fakeUserRepository = createFakeRepository();

    // maybe this should be explicityly done in each test case as thats kind of part of the
    // test case and having one huge mock is just kind of gross
    beforeEach(() => {
        sandbox = createSandbox()
        sandbox.stub(typeorm, "getManager").callsFake(() => {
            return {
                getRepository: sandbox.stub().withArgs(User).returns(fakeUserRepository)
            };
        });
        userRepositoryMock = sandbox.mock(fakeUserRepository);
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('should get all users', async () => {
        const ctx = createMockContext();
        await UserController.getUsers(ctx)
        
        userRepositoryMock.expects('find')
        
        expect(ctx.status).toBe(200)
        expect(ctx.body.length).toBeGreaterThanOrEqual(2)
    })
    it('should get user by id', async () => {
        let params = {
            id: 1
        }
        const ctx = createMockContext();
        ctx.params = params
        await UserController.getUser(ctx)

        userRepositoryMock.expects('findOne').withArgs(params.id)

        expect(ctx.status).toBe(200)
        expect(ctx.body).toEqual(newUser)
    })
    it('should not get user by with invalid user id', async () => {
        let params = {
            id: 0 // mock returns undefined if id == 0
        }
        const ctx = createMockContext();
        ctx.params = params
        await UserController.getUser(ctx)

        userRepositoryMock.expects('findOne').withArgs(params.id)

        expect(ctx.status).toBe(400)
        expect(ctx.body).toContain("doesn't exist")
    })
    // note to self: find one needs to be overloaded in the same manner as it is in typeorm
    // so that it can be called with id, or email, etc. this could be done by making many 
    // fakeUserRepositorys for each case and loading them in as needed, or making a single
    // overloaded fakeUserRepository
    it('should create a new user', async () => {
        const ctx = createMockContext();
        ctx.request.body = newUser;
        await UserController.createUser(ctx)

        userRepositoryMock.expects('findOne').withArgs({email: newUser.email})

        expect(ctx.status).toBe(200)
        expect(ctx.body).toEqual(newUser)
    })
    // it('shouldnt be able to create a new user given invalid data', async () => {
    //     const ctx = createMockContext();
    //     ctx.request.body = badNewUser;
    //     await UserController.createUser(ctx)

    //     expect(ctx.status).toBe(400)
    //     expect(ctx.body.length).toBeGreaterThan(0) // more than 0 errors are returned
    // })
})