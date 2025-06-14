import { hash } from 'bcrypt';
import { MongoClient } from 'mongodb';

// MongoDB connection
const uri =
  'mongodb+srv://srijan:srijan@cluster0.uevfsjx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
if (!uri) {
  console.error('Please set the MONGODB_URI environment variable');
  process.exit(1);
}

async function createAdminUser() {
  const adminUser = {
    name: 'Name',
    email: 'gopal@nepal',
    password: 'gopalNepal#123@',
    role: 'admin',
  };

  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();

    // Check if user already exists
    const existingUser = await db
      .collection('users')
      .findOne({ email: adminUser.email });

    if (existingUser) {
      console.log(`User with email ${adminUser.email} already exists`);
      return;
    }

    // Hash the password
    const hashedPassword = await hash(adminUser.password, 10);

    // Insert the user
    const result = await db.collection('users').insertOne({
      name: adminUser.name,
      email: adminUser.email,
      password: hashedPassword,
      role: adminUser.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`Admin user created with ID: ${result.insertedId}`);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
createAdminUser();
