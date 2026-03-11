const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const {
  getUserById,
  getAllUsers,
  createUser,
  removeUserById,
  updateUserById
} = require('./crud');

async function demo() {
  console.log('🚀 Starting CRUD Demo...\n');

  // Start in-memory MongoDB
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  console.log('📊 Connected to in-memory MongoDB\n');

  try {
    // 1. Create users
    console.log('1. Creating users...');
    const user1 = await createUser({
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice@example.com',
      betaUser: true
    });
    console.log('✅ Created user:', user1.firstName, user1.email);

    const user2 = await createUser({
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'bob@example.com',
      birthDate: new Date('1990-01-01'),
      pets: ['dog', 'cat']
    });
    console.log('✅ Created user:', user2.firstName, user2.email, '\n');

    // 2. Get all users
    console.log('2. Getting all users...');
    const allUsers = await getAllUsers();
    console.log('📋 All users:', allUsers.map(u => `${u.firstName} (${u.email})`), '\n');

    // 3. Get user by ID
    console.log('3. Getting user by ID...');
    const foundUser = await getUserById(user1._id);
    console.log('🔍 Found user:', foundUser.firstName, foundUser.email, '\n');

    // 4. Update user
    console.log('4. Updating user...');
    const updatedUser = await updateUserById(user2._id, {
      firstName: 'Robert',
      betaUser: true
    });
    console.log('✏️  Updated user:', updatedUser.firstName, updatedUser.email, '(betaUser:', updatedUser.betaUser + ')', '\n');

    // 5. Delete user
    console.log('5. Deleting user...');
    await removeUserById(user1._id);
    console.log('🗑️  Deleted user:', user1.firstName);

    // Verify deletion
    const remainingUsers = await getAllUsers();
    console.log('📋 Remaining users:', remainingUsers.map(u => u.firstName), '\n');

    console.log('🎉 Demo completed successfully!');

  } catch (error) {
    console.error('❌ Error during demo:', error);
  } finally {
    // Cleanup
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    console.log('🔌 Disconnected from MongoDB');
  }
}

demo();