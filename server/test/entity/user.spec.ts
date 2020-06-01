import { validate, ValidationError } from "class-validator";

import { mockUser } from '../interfaces/mockUser';
import { User } from "../../src/entity/user";

describe('Unit test: User schema', () => {
    function makeUserEntity(mockUser: mockUser): User {
        // must create new User with no params then initialize attributes
        const user = new User();
        user.id = 1
        user.name = mockUser.name
        user.email = mockUser.email
        return user;
    }

    it('should return no errors with valid user data', async () => {
        const validUser: mockUser = {
            name: 'john',
            email: 'john@doe.com'
        }

        const user: User = makeUserEntity(validUser);
        const errors: ValidationError[] = await validate(user);

        expect(errors.length).toBe(0);
    })
    it('should reject a user with no name', async () => {
        const noNameUser: mockUser = {
            name: '',
            email: 'john@doe.com'
        }

        const user: User = makeUserEntity(noNameUser);
        const errors: ValidationError[] = await validate(user);

        expect(errors.length).toBe(1);
        expect(errors[0].property).toBe('name');
    })
    it('should reject a user with no email', async () => {
        const noNameUser: mockUser = {
            name: 'john',
            email: ''
        }

        const user: User = makeUserEntity(noNameUser);
        const errors: ValidationError[] = await validate(user);

        expect(errors.length).toBe(1);
        expect(errors[0].property).toBe('email');
    })
    it('should reject a user with invalid email', async () => {
        const noNameUser: mockUser = {
            name: 'john',
            email: 'doe.com'
        }

        const user: User = makeUserEntity(noNameUser);
        const errors: ValidationError[] = await validate(user);

        expect(errors.length).toBe(1);
        expect(errors[0].property).toBe('email');
    })
})