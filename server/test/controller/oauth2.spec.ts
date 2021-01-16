// must be imported first so env vars are available to all imported modules -- use .env.test
require('dotenv').config({ path: './.env.test' });

import { createSandbox, SinonSandbox } from 'sinon'
import { createMockContext } from '@shopify/jest-koa-mocks';
import OAuth2Controller from "../../src/controller/oauth2";
import * as googleApis from "googleapis";
import { UserController } from '../../src/controller/user';

describe('Unit test: User endpoint', () => {

    let sandbox: SinonSandbox

    beforeEach(() => {
        sandbox = createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

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
        // Copied from OAuth2Controller
        const scopes = [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ];

        const devLoginURL = "https://accounts.google.com/o/oauth2/v2/auth?scope=" +
            encodeURIComponent(scopes[0] + " " + scopes[1]) +
            "&response_type=code" +
            "&client_id=" + encodeURIComponent(process.env.OAUTH_CLIENT_ID) +
            "&redirect_uri=" + encodeURIComponent(process.env.OAUTH_REDIRECT_URL);

        const ctx = createMockContext();
        await OAuth2Controller.loginUrl(ctx)

        expect(ctx.status).toBe(200)
        expect(ctx.body).toEqual(devLoginURL);
    })

    it('should GET jwt tokens and first name', async () => {
        const ctx = createMockContext();
        ctx.query["code"] = "abcde";

        sandbox.stub(googleApis.google.auth.OAuth2.prototype, "getToken").returns(mockToken);
        sandbox.stub(googleApis.google.auth.OAuth2.prototype, "verifyIdToken").returns(mockTicket);
        sandbox.stub(UserController, "getOrCreateUser").returns(mockUser);
        await OAuth2Controller.tokenExchange(ctx);

        expect(ctx.status).toEqual(200);
        expect(ctx.body).toBe(mockTicket.getPayload());
    })

    it('should FAIL to verify id_token', async () => {
        sandbox.stub(googleApis.google.auth.OAuth2.prototype, "verifyIdToken").throws(new Error());
        const response = await OAuth2Controller.verifyToken("");

        expect(response).toEqual(null);
    })
})
