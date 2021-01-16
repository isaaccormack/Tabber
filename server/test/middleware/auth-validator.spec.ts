require('dotenv').config(); // must be imported first so env vars are available to all imported modules

import {createMockContext, createMockCookies} from "@shopify/jest-koa-mocks";
import { createSandbox, SinonSandbox } from 'sinon'
import {authValidator, isAuthenticated} from "../../src/middleware/auth-validator";
import OAuth2Controller from "../../src/controller/oauth2";
import { UserController } from '../../src/controller/user';

describe('Unit test: User endpoint', () => {
    let sandbox: SinonSandbox = createSandbox();

    beforeEach(() => {
        sandbox = createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    const next = function(){};
    const mockTicket = {
        getPayload(): any | undefined {
            return this.payload;
        },
        payload: {
            email: "someEmail@email.com",
            name: "firstname lastname",
            given_name: "firstname",
            family_name: "lastname"
        }
    }
    const mockUser = {
        name: 'john',
        email: 'john@doe.com'
    }

    it('should SET isAuthenticated=true and set state to user object', async () => {
        const ctx = createMockContext();
        ctx.cookies = createMockCookies({
            ti: "someJwtToken"
        });

        sandbox.stub(OAuth2Controller, "verifyToken").returns(mockTicket);
        sandbox.stub(UserController, "getOrCreateUser").returns(mockUser);
        await authValidator(ctx, next);

        expect(ctx.state.isAuthenticated).toBe(true);
        expect(ctx.state.user).toBe(mockUser);
    })

    it('should SET isAuthenticated=false if no jwt in cookie', async () => {
        const ctx = createMockContext();

        sandbox.stub(OAuth2Controller, "verifyToken").returns(mockTicket);
        sandbox.stub(UserController, "getOrCreateUser").returns(mockUser);
        await authValidator(ctx, next);

        expect(ctx.state.isAuthenticated).toBe(false);
        expect(ctx.state.state).toBe(undefined);
    })

    it('should SET isAuthenticated=false with invalid jwt', async () => {
        const ctx = createMockContext();
        ctx.cookies = createMockCookies({
            ti: "someJwtToken"
        });

        sandbox.stub(OAuth2Controller, "verifyToken").returns(undefined);
        sandbox.stub(UserController, "getOrCreateUser").returns(mockUser);
        await authValidator(ctx, next);

        expect(ctx.state.isAuthenticated).toBe(false);
        expect(ctx.state.state).toBe(undefined);
    })

    it('should SET isAuthenticated=false if user cant be created', async () => {
        const ctx = createMockContext();
        ctx.cookies = createMockCookies({
            ti: "someJwtToken"
        });

        sandbox.stub(OAuth2Controller, "verifyToken").returns(mockTicket);
        sandbox.stub(UserController, "getOrCreateUser").returns(undefined);
        await authValidator(ctx, next);

        expect(ctx.state.isAuthenticated).toBe(false);
        expect(ctx.state.state).toBe(undefined);
    })

    it('should SET response status = 401', async () => {
        const ctx = createMockContext();
        ctx.state.isAuthenticated = false;

        await isAuthenticated(ctx, next);
        expect(ctx.response.status).toBe(401);
    })

    // todo: this test needs to be improved to spy next() to see if called
    it('should CALL the next function', async () => {
        const ctx = createMockContext();
        ctx.state.isAuthenticated = true;

        await isAuthenticated(ctx, next);

        expect(ctx.response.status).toEqual(404);
    })

})
