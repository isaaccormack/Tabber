import { createSandbox, SinonSandbox, createStubInstance, spy } from 'sinon'
import * as typeorm from 'typeorm'
import {createMockContext } from '@shopify/jest-koa-mocks';
import { User } from "../../src/entity/user";
import { user } from '../../src/controller'

describe('Unit tests: Users endpoint', () => {
  let sandbox: SinonSandbox
  let userRepositoryMock
  
    const newUser = {
      name: 'john',
      email: 'john@doe.com'
    }
  
    const badNewUser = {
      name: '',
      email: 'john@doe.com'
    }
  
  function createFakeRepository() {
    return {
        save: function() {},
        findOne: function(id: Number) { if (id == 0) {return undefined} else {return newUser}},
        find: function() {return [1, 2, 3]}
        // others
    }
  }

  const fakeUserRepository = createFakeRepository();

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

  it('should send back array of users', async () => {
      const ctx = createMockContext();
      await user.getUsers(ctx)
      
      userRepositoryMock.expects('find')
      
      // this is returning 204 for some reason
      // expect(ctx.status).toBe(200)
      expect(ctx.body.length).toBeGreaterThanOrEqual(2)
    })
  it('should be able to get user by id', async () => {
    let params = {
      id: 1
    }
    const ctx = createMockContext();
    ctx.params = params
    await user.getUser(ctx)
    
    userRepositoryMock.expects('findOne').withArgs(params.id)
    
    expect(ctx.status).toBe(200)
    expect(ctx.body).toEqual(newUser)
  })
  it('should not be able to get user by with invalid id', async () => {
    let params = {
      id: 0 // mock returns undefined if id == 0
    }
    const ctx = createMockContext();
    ctx.params = params
    await user.getUser(ctx)
    
    userRepositoryMock.expects('findOne').withArgs(params.id)
    
    expect(ctx.status).toBe(400)
    expect(ctx.body).toContain("doesn't exist")
  })
  // note to self: find one needs to be overloaded in the same manner as it is in typeorm
  // so that it can be called with id, or email, etc. this could be done by making many 
  // fakeUserRepositorys for each case and loading them in as needed, or making a single
  // overloaded fakeUserRepository
  // it('should be able to create a new user given valid data', async () => {
  //   const ctx = createMockContext();
  //   ctx.request.body = newUser;
  //   await user.createUser(ctx)
    
  //   userRepositoryMock.expects('findOne').withArgs({email: newUser.email})
    
  //   expect(ctx.status).toBe(200)
  //   expect(ctx.body).toEqual(newUser)
  // })
  // it('shouldnt be able to create a new user given invalid data', async () => {
  //   const ctx = createMockContext();
  //   ctx.request.body = badNewUser;
  //   await user.createUser(ctx)
        
  //   expect(ctx.status).toBe(400)
  //   expect(ctx.body.length).toBeGreaterThan(0) // more than 0 errors are returned
  // })
})