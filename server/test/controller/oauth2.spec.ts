import { createSandbox, SinonSandbox, spy } from 'sinon'
import {createMockContext, createMockCookies} from '@shopify/jest-koa-mocks';
import OAuth2Controller from "../../src/controller/oauth2";
import * as googleApis from "googleapis";
import { LoginTicket } from "google-auth-library";
import * as typeorm from "typeorm";
import {User} from "../../src/entity/user";

describe('Unit test: User endpoint', () => {
    let sandbox: SinonSandbox
    const devLoginURL = "https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code&client_id=594643125025-ndqhiavpdodt3r0eqd6sphphne8ked56.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Ftabber.io%2Foauth";

    beforeEach(() => {
        sandbox = createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    function stubGetUserRepository(fakeMethod: any): void {
        sandbox.stub(typeorm, "getManager").callsFake(() => {
            return {
                getRepository: sandbox.stub().withArgs(User).returns(fakeMethod)
            };
        });
    }

    const mockTicket = {
        getPayload(): any {
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
    const mockToken = {
        tokens: {
            access_token: "accessToken",
            id_token: "idToken"
        }
    }

    it('should GET Googleapis loginURL', async () => {
        const ctx = createMockContext();
        await OAuth2Controller.loginUrl(ctx)
        
        expect(ctx.status).toBe(200)
        expect(ctx.body).toEqual(devLoginURL);
    })

    it('should GET jwt tokens and first name', async () => {
        const ctx = createMockContext();
        ctx.query["code"] = "abcde";

        sandbox.stub(googleApis.google.auth.OAuth2.prototype, "getToken").returns(Promise.resolve(mockToken));
        sandbox.stub(googleApis.google.auth.OAuth2.prototype, "verifyIdToken").returns(Promise.resolve(mockTicket));
        stubGetUserRepository({findOne: () => {return mockUser}})
        await OAuth2Controller.tokenExchange(ctx);

        expect(ctx.status).toEqual(200);
        expect(ctx.body).toEqual(mockUser.name);
    })

    it('should FAIL to verify id_token', async () => {
        sandbox.stub(googleApis.google.auth.OAuth2.prototype, "verifyIdToken").throws(new Error());
        const response = await OAuth2Controller.verifyToken("");

        expect(response).toEqual(null);
    })

    // todo: thhis fails because stubbing returns a method, need to figure out multiple stubs later

    // it('should FAIL to get user and make a new one instead', async () => {
    //     sandbox.stub(googleApis.google.auth.OAuth2.prototype, "verifyIdToken").throws(new Error());
    //     stubGetUserRepository({findOne: () => {return null}})
    //     stubGetUserRepository({save: () => {return mockUser}})
    //
    //     const response = await OAuth2Controller.getOrCreateUser(mockTicket.payload);
    //
    //     expect(response).toEqual(mockUser);
    // })

})