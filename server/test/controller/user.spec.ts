import { createSandbox, SinonSandbox } from 'sinon'

import { User } from "../../src/entity/user";
import { UserController } from '../../src/controller/user';
import { UserDAO } from "../../src/dao/user";


describe('Unit test: User endpoint', () => {
    let sandbox: SinonSandbox
    beforeEach(() => { sandbox = createSandbox() })
    afterEach(() => { sandbox.restore() })

    it('should CREATE new user if no account with email exists', async () => {
        const payload = {
            // must contain iss, sub, aud, iat, and exp to match TokenPayload type
            iss: '',
            sub: '',
            aud: '',
            iat: 0,
            exp: 0,
            name: 'john doe',
            email: 'john@doe.com',
            picture: 'www.picture.com',
            given_name: 'john',
            family_name: 'doe'
        }

        const userFromPayload: User = {
            id: 0,
            name: payload.name,
            email: payload.email,
            picture_URL: payload.picture,
            given_name: payload.given_name,
            family_name: payload.family_name,
            licks: [],
            sharedWithMe: []
        }

        sandbox.stub(UserDAO, "getUserByEmail").returns(undefined);
        sandbox.stub(UserDAO, "saveUserToDb").returns(userFromPayload);

        const res = await UserController.getOrCreateUser(payload)

        expect(res).toBe(userFromPayload);
    })
    it('should GET user whos email belongs to existing account', async () => {
        const payload = {
            // must contain iss, sub, aud, iat, and exp to match TokenPayload type
            iss: '',
            sub: '',
            aud: '',
            iat: 0,
            exp: 0,
            name: 'john doe',
            email: 'john@doe.com',
            picture: 'www.picture.com',
            given_name: 'john',
            family_name: 'doe'
        }

        const userFromPayload: User = {
            id: 0,
            name: payload.name,
            email: payload.email,
            picture_URL: payload.picture,
            given_name: payload.given_name,
            family_name: payload.family_name,
            licks: [],
            sharedWithMe: []
        }

        sandbox.stub(UserDAO, "getUserByEmail").returns(userFromPayload);

        const res = await UserController.getOrCreateUser(payload)

        expect(res).toBe(userFromPayload);
    })
})
