import { RegisterUserInput } from "src/dtos/register.dto"
import { UserService } from "src/services/user.service"
import { TestContext } from "test/TestContext"
import { faker } from '../faker'
import { User } from "src/entities/user-entity"
import { UserFactory } from "test/factories/user.factory"
import { mockAuthUser, setupHttpContextMock, UserRepositoryMock } from "test/test-helper"

describe("Users test suits", () => {
    let userService: UserService
    let input: RegisterUserInput

    beforeEach(async () => {
        const modulesRef = await TestContext.createModule({
            providers: [UserService]
        }).compile()

        userService = modulesRef.get(UserService)
        input = {
            user: {
                email: faker.internet.email({ provider: 'yopmail.com' }),
                username: faker.person.firstName(),
                password: faker.internet.password(),
            }
        }

    })

    it("Register user", async () => {
        await userService.registerUser(input)

        const user = await TestContext.em.findOne(User, { email: input.user.email })
        
        expect(user?.email).toBe(input.user.email)
    })

    it("should update user information", async () => {
        const createUser = await TestContext.getFactory(UserFactory).createOne()

        const mockUser = mockAuthUser({ id: createUser.id, username: createUser.username })
        setupHttpContextMock(mockUser)

        const updateInput = {user: {username: "testing_will_be_fine"}}
        await userService.updateUser(updateInput)


        const user = await TestContext.em.findOne(User, { email: createUser.email })
        
        expect(user?.username).toBe(updateInput.user.username)
    })

    it("Should login User", async () => {
        const createUser = await TestContext.getFactory(UserFactory).createOne()

        UserRepositoryMock(createUser)

        const loggedInUser = await userService.loginUser({ user: { email: createUser.email, password: createUser.password } })
        
        expect(loggedInUser.user.token).not.toBeNull()
    })
    
})