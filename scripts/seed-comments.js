const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = "mongodb+srv://addawebadua:2006adda@confidev.5rnav.mongodb.net/?appName=confidev"
const dbName = 'confidev';

async function seedComments() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const comments = db.collection('comments');

    // Clear existing comments
    await comments.deleteMany({});

    // Sample post IDs - replace these with actual post IDs from your database
    const postIds = ['post1', 'post2'];
    
    // Sample user data
    const users = [
      { id: 'user1', name: 'John Doe', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
      { id: 'user2', name: 'Jane Smith', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' }
    ];

    // Create parent comments
    const parentComments = [
      {
        postId: postIds[0],
        user: {
          userId: users[0].id,
          name: users[0].name,
          image: users[0].image
        },
        content: 'This is a great post!',
        likes: [users[1].id],
        parentId: null,
        replies: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        postId: postIds[0],
        user: {
          userId: users[1].id,
          name: users[1].name,
          image: users[1].image
        },
        content: 'Very informative content',
        likes: [users[0].id],
        parentId: null,
        replies: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const parentResult = await comments.insertMany(parentComments);
    const parentIds = Object.values(parentResult.insertedIds);

    // Create replies
    const replies = [
      {
        postId: postIds[0],
        user: {
          userId: users[1].id,
          name: users[1].name,
          image: users[1].image
        },
        content: 'I agree with you!',
        likes: [],
        parentId: parentIds[0].toString(),
        replies: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await comments.insertMany(replies);

    // Update parent comment with reply reference
    await comments.updateOne(
      { _id: parentIds[0] },
      { $push: { replies: parentIds[0].toString() } }
    );

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seedComments().catch(console.error);