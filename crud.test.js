const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const {
  getUserById,
  getAllUsers,
  createUser,
  removeUserById,
  updateUserById
} = require('./crud');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

describe('CRUD Operations', () => {
  test('createUser should create a new user', async () => {
    const userDetails = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    };
    const user = await createUser(userDetails);
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.email).toBe('john.doe@example.com');
    expect(user._id).toBeDefined();
  });

  test('getAllUsers should return all users', async () => {
    const user1 = await createUser({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com'
    });
    const user2 = await createUser({
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@example.com'
    });
    const users = await getAllUsers();
    expect(users.length).toBe(2);
    expect(users.map(u => u.email)).toEqual(
      expect.arrayContaining(['jane.smith@example.com', 'bob.johnson@example.com'])
    );
  });

  test('getUserById should return the correct user', async () => {
    const user = await createUser({
      firstName: 'Alice',
      lastName: 'Wonder',
      email: 'alice.wonder@example.com'
    });
    const foundUser = await getUserById(user._id);
    expect(foundUser.firstName).toBe('Alice');
    expect(foundUser.email).toBe('alice.wonder@example.com');
  });

  test('updateUserById should update the user', async () => {
    const user = await createUser({
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie.brown@example.com'
    });
    const update = { firstName: 'Charles' };
    const updatedUser = await updateUserById(user._id, update);
    expect(updatedUser.firstName).toBe('Charles');
    expect(updatedUser.lastName).toBe('Brown'); // unchanged
  });

  test('removeUserById should delete the user', async () => {
    const user = await createUser({
      firstName: 'David',
      lastName: 'Lee',
      email: 'david.lee@example.com'
    });
    await removeUserById(user._id);
    const foundUser = await getUserById(user._id);
    expect(foundUser).toBeNull();
  });
});