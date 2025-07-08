# 🌐 Social Sphere

**Social Sphere** is a modern, full-stack web-based social media platform designed to foster meaningful connections through real-time chat, user-generated content, and a clean, responsive interface. Built with a focus on seamless user experience, the app supports both guest and registered sessions, profile customization, and dynamic interactions.

---

## 🚀 Features

- **Create Posts**: Share your thoughts, media (images/videos), and ideas with others. Posts can be public, friends-only, private, or saved as drafts. Tag users and upload compressed media for efficiency.
- **Feed with Tabs**: Browse a personalized feed with "For You" (public posts) and "Following" (posts from users you follow). Infinite scroll and real-time updates.
- **Post Interactions**: Like, comment, share (including to chat), and bookmark posts. Comments support threaded replies and are loaded dynamically.
- **Real-Time Chat**: One-on-one messaging with emoji support, file/image sharing, read receipts, and timestamps. Chat sidebar lists all conversations, sorted by recent activity.
- **User Profiles**: Fully editable profiles with display picture, bio, location, website, interests, and username. View your own or other users' profiles.
- **Followers & Following**: View lists of followers and followings, with quick actions to view profiles or start chats. Follow/unfollow users directly from their profile or posts.
- **Guest Sessions**: Try the app as a guest with a 5-minute session timer. A visible countdown and modal prompt encourage registration or login before time expires.
- **Authentication**: Secure login/signup with email/password or Google. Firebase Authentication ensures safe session handling.
- **Bookmarks**: Save posts for later viewing. Bookmarked posts are listed with infinite scroll and user/post details.
- **Search**: Instantly find users by name or username with intelligent suggestions and quick navigation to profiles.
- **Theme Toggle**: Switch between dark and light modes at any time. Theme preference is saved locally.
- **Responsive UI**: Optimized for desktops, tablets, and mobile devices. Mobile-specific layouts and controls.
- **Smooth Routing**: Seamless navigation with React Router, including protected routes for authenticated features.
- **Notifications**: (Planned) Placeholder for future notification system.
- **Active Development Notice**: Users are informed that the app is in active development, with a feedback link for suggestions.

---

## 🧱 Tech Stack

- **Frontend**: React.js, Tailwind CSS, React Router, Emoji Picker, Toastify, Lucide React, React Icons
- **Backend/Services**: Firebase Authentication, Firestore (Database), Firebase Storage
- **Utilities**: Image compression, Infinite scroll, Context API for theme and guest session management
- **Build Tools**: Vite, ESLint, Prettier

---

## 🗺️ Main Pages & Flows

- **Home**: Central feed with tabs, post creation modal, and sidebars for navigation and suggestions.
- **Explore**: (Planned) Discover new users and trending content.
- **Bookmarks**: View and manage saved posts.
- **Chats**: Real-time messaging with file/image sharing and emoji support.
- **Profile**: Edit your profile, view your posts, and manage followers/followings.
- **User Profile**: View other users' profiles, follow/unfollow, and see their public/friends-only posts.
- **Post**: View a single post with all interactions and comments.
- **Login/Signup**: Secure authentication with email/password or Google. Guest session timer is paused on these pages.
- **Followers/Following Modal/Page**: See lists of followers and followings, with quick actions.

---

## 🧑‍💻 How It Works

1. **Guest Access**: New users can browse as a guest for 5 minutes. A timer is shown, and a modal prompts login/signup when time expires.
2. **Registration/Login**: Users can sign up or log in with email/password or Google. Authenticated users have full access.
3. **Creating & Interacting with Posts**: Authenticated users can create, edit, delete, like, comment, share, and bookmark posts. Media uploads are compressed for speed.
4. **Chat**: Start conversations from user profiles or the chat sidebar. Send text, emojis, images, and files. Messages are timestamped and support read receipts.
5. **Profile Management**: Edit your profile, upload a display picture, and manage your posts. View and manage followers/followings.
6. **Search**: Use the search bar to find users by name or username. Suggestions update in real time.
7. **Theme Switching**: Toggle between dark and light modes. The app remembers your preference.

---

## 🛠️ Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd DEV_CONNECT/social-sphere
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Firebase:**
   - Add your Firebase config to `src/configuration/firebaseConfig.js`.
   - Ensure Firestore, Authentication, and Storage are enabled in your Firebase project.
4. **Start the development server:**
   ```bash
   npm run dev
   ```
5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🤝 Contribution & Feedback

- This project is in active development. Feedback and contributions are welcome!
- Please use the [feedback form](https://forms.gle/pmYdvckr1QGJYGMo9) or open an issue on GitHub.

---

## 📸 Screenshots

> _Add screenshots or GIFs here to showcase the UI and features._

---

## 📄 License

_Include your license information here if applicable._
