import { RequestContext } from "nestjs-request-context";
import { HttpContext } from "src/misc/context";
import { UserRepository } from "src/repositories/user.repository";
import { faker } from "./faker";
import { TestContext } from "./TestContext";
import { User } from "src/entities/user-entity";
import { UserFactory } from "./factories/user.factory";
import { MiscFunction } from "src/misc/miscfunction";

interface UserDto { id: string, username: string }

export const mockAuthUser = (overrides?: Partial<UserDto>): UserDto => ({
    id: '',
    username: '',
    ...overrides,
});


export const setupHttpContextMock = (user: UserDto) => {
    const httpContextSpy = jest.spyOn(HttpContext, 'get' as any);
    const mockRequest = { user } as Request & { user: UserDto };

    const mockContext = {
        req: mockRequest,
    } as RequestContext<Request & { user: UserDto }, Response>;

    httpContextSpy.mockReturnValue(mockContext);

    return httpContextSpy;
};

export const UserRepositoryMock = (createdUser: User) => {

    const verifyUserSpy = jest.spyOn(UserRepository.prototype, 'verifyUser')

    const user = {
        id: createdUser.id,
        username: createdUser.username,
        toDto() {
            return {
                username: createdUser.username,
                email: createdUser.email,
                bio: createdUser.bio,
                image: createdUser.image,
            }
        }
    } as User

    verifyUserSpy.mockResolvedValue(user)

    return verifyUserSpy
}

export const MiscMocking = () => {
    const miscInstance = MiscFunction.prototype
    const timeConsumingSpy = jest.spyOn(miscInstance, 'timeConsuming')
    
    const value = "Not checking metrics before following"

    timeConsumingSpy.mockReturnValue(value)

    return timeConsumingSpy
}