import { createSandbox, SinonSandbox, spy } from 'sinon'
import {createMockContext } from '@shopify/jest-koa-mocks';
import OAuth2Controller from "../../src/controller/oauth2";

describe('Unit test: User endpoint', () => {
    let sandbox: SinonSandbox
    const devLoginURL = "https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code&client_id=594643125025-ndqhiavpdodt3r0eqd6sphphne8ked56.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Ftabber.io%2Foauth";

    beforeEach(() => {
        sandbox = createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('should GET Googleapis loginURL', async () => {
        const ctx = createMockContext();
        await OAuth2Controller.loginUrl(ctx)
        
        expect(ctx.status).toBe(200)
        expect(ctx.body).toEqual(devLoginURL);
    })

    it('should GET jwt tokens and first name', async () => {
        //todo
    })

})