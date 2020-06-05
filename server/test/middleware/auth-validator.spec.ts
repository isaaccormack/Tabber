import {createMockContext, createMockCookies} from "@shopify/jest-koa-mocks";
import { createSandbox, SinonSandbox, spy } from 'sinon'
import {authValidator} from "../../src/middleware/auth-validator";
import OAuth2Controller from "../../src/controller/oauth2";



describe('Unit test: User endpoint', () => {
    let sandbox: SinonSandbox = createSandbox();

    beforeEach(() => {
        sandbox = createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    const next = function(){return;};
    const mockTicket = {
        getPayload(): any | undefined {
            return this.payload;
        },
        payload: {
            email: "someEmail@email.com",
            given_name: "firstname",
            family_name: "lastname"
        }
    }
    const mockUser = {
        name: 'john',
        email: 'john@doe.com'
    }

    it('should SET isAuthenticated=true and user objects', async () => {
        const ctx = createMockContext();
        ctx.cookies = createMockCookies({
            ti: "someJwtToken"
        });

        sandbox.stub(OAuth2Controller, "verifyToken").returns(mockTicket);
        sandbox.stub(OAuth2Controller, "getOrCreateUser").returns(mockUser);
        await authValidator(ctx, next);

        expect(ctx.state.isAuthenticated).toBe(true);
        expect(ctx.state.user).toBe(mockUser);
    })

    it('should SET isAuthenticated=false (no jwt)', async () => {
        const ctx = createMockContext();

        sandbox.stub(OAuth2Controller, "verifyToken").returns(mockTicket);
        sandbox.stub(OAuth2Controller, "getOrCreateUser").returns(mockUser);
        await authValidator(ctx, next);

        expect(ctx.state.isAuthenticated).toBe(false);
    })

    it('should SET isAuthenticated=false (invalid jwt)', async () => {
        const ctx = createMockContext();
        ctx.cookies = createMockCookies({
            ti: "someJwtToken"
        });

        sandbox.stub(OAuth2Controller, "verifyToken").returns(undefined);
        sandbox.stub(OAuth2Controller, "getOrCreateUser").returns(mockUser);
        await authValidator(ctx, next);

        expect(ctx.state.isAuthenticated).toBe(false);
    })

    it('should SET isAuthenticated=false (failed to create user)', async () => {
        const ctx = createMockContext();
        ctx.cookies = createMockCookies({
            ti: "someJwtToken"
        });

        sandbox.stub(OAuth2Controller, "verifyToken").returns(mockTicket);
        sandbox.stub(OAuth2Controller, "getOrCreateUser").returns(undefined);
        await authValidator(ctx, next);

        expect(ctx.state.isAuthenticated).toBe(false);
    })


})