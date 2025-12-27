import { TestContext } from 'test/TestContext';
import { faker } from '../faker';
import { ProfileService } from 'src/services/profile.service';
import {
  MiscMocking,
  mockAuthUser,
  setupHttpContextMock,
} from 'test/test-helper';
import { UserFactory } from 'test/factories/user.factory';

describe('Profile test suits', () => {
  let profileService: ProfileService;

  beforeEach(async () => {
    const modulesRef = await TestContext.createModule({
      imports: [],
      providers: [ProfileService],
    }).compile();

    profileService = modulesRef.get(ProfileService);
  });

  it('Fetches user profile', async () => {
    const createUser = await TestContext.getFactory(UserFactory).createOne();

    mockAuthUser({ id: createUser.id, username: createUser.username });

    setupHttpContextMock(createUser);

    const profile = await profileService.fetchProfile(createUser.username);

    expect(profile.profile.username).toBe(createUser.username);
  });

  it('Follow user', async () => {
    const createUser1 = await TestContext.getFactory(UserFactory).createOne();
    const createUser2 = await TestContext.getFactory(UserFactory).createOne();

    mockAuthUser({ id: createUser1.id, username: createUser1.username });

    setupHttpContextMock(createUser1);

    MiscMocking();

    const followedUser = await profileService.followUser(createUser2.username);

    expect(followedUser.profile.following).toBeTruthy();
  });

  it('Unfollow user', async () => {
    const createUser1 = await TestContext.getFactory(UserFactory).createOne();
    const createUser2 = await TestContext.getFactory(UserFactory).createOne();

    mockAuthUser({ id: createUser1.id, username: createUser1.username });

    setupHttpContextMock(createUser1);

    await profileService.followUser(createUser2.username);

    const unfollowedUser = await profileService.unfollowUser(
      createUser2.username,
    );

    console.log(unfollowedUser.profile.following);

    expect(unfollowedUser.profile.following).not.toBeTruthy();
  });
});
