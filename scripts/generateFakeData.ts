import { faker } from '@faker-js/faker';
import fs from 'fs';

const NUM_USERS = 10;
const POSTS_PER_USER = 5;

const users = [];
const profiles = [];
const posts = [];

for (let i = 0; i < NUM_USERS; i++) {
  const username = faker.internet.username().toLowerCase() + i;
  const email = faker.internet.email();
  const password = faker.internet.password();
  const avatarUrl = faker.image.avatar();
  const bio = faker.lorem.sentence();
  const user = {
    id: faker.string.uuid(),
    username,
    email,
    password,
    createdAt: faker.date.past().toISOString(),
  };
  const profile = {
    username,
    avatarUrl,
    bio,
    followers: [],
    following: [],
    createdAt: user.createdAt,
  };
  users.push(user);
  profiles.push(profile);
  for (let j = 0; j < POSTS_PER_USER; j++) {
    posts.push({
      id: faker.string.uuid(),
      username,
      content: faker.lorem.paragraph(),
      createdAt: faker.date.recent().toISOString(),
      likes: [],
      comments: [],
      mediaUrl: faker.image.urlPicsumPhotos({ width: 600, height: 400 }),
    });
  }
}

fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));
fs.writeFileSync('./data/profiles.json', JSON.stringify(profiles, null, 2));
fs.writeFileSync('./data/posts.json', JSON.stringify(posts, null, 2));

console.log('Fake users, profiles, and posts generated!');
