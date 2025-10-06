# My Instagram Clone

This project is a feature-rich Instagram clone built using [Next.js](https://nextjs.org). It provides a social media platform where users can connect, share, and interact with each other. The application is designed to mimic the core functionalities of Instagram while offering a modern and responsive user experience.

## Features

### User Authentication
- Sign up and log in functionality.

### User Profiles
- View and edit user profiles.
- Upload profile pictures.
- Track followers and followings.

### Posts
- Create, edit, and delete posts.
- Upload images.
- Like, comment, and share posts.

### Messaging
- Messaging between users.
- Creating conversations/groups.
- Notifications for new messages.

### Notifications
- Receive notifications for likes, comments, and follows.
- View all notifications in a dedicated section.

### Search
- Search for users, posts, and hashtags.
- Explore trending content.

### Social Features
- Follow and unfollow users.
- View followers and followings.
- Discover new connections.

## Getting Started

### Development Server
To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### File Structure
- `src/app`: Contains the main application logic and components.
- `src/services`: Handles API calls and data fetching.
- `src/store`: Manages application state using Zustand.
- `public/uploads`: Stores uploaded images and assets.

## Deployment

The application can be deployed using [Vercel](https://vercel.com). For detailed instructions, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Zustand State Management](https://zustand-demo.pmnd.rs/)
- [Material-UI](https://mui.com/)
