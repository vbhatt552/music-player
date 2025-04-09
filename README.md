// A README.md for your Spotify Clone project

# 🎵 Spotify Clone - Web Music Player

This project is a **Spotify Web Player Clone** built with **React**, **Styled Components**, and **Spotify Web API**. It lets users:

- Authenticate via Spotify
- Browse and view their personal playlists
- Play, pause, and switch between tracks
- Control volume and playback
- View currently playing track info
- Search for songs in real-time directly from the navbar

## 🚀 Features

- ✅ Spotify Login Authentication
- 🎧 Playback controls (Play, Pause, Next, Previous)
- 🎼 Display user playlists and tracks
- 🎨 Responsive UI with Styled Components
- 🔊 Volume Control
- 🎵 Now Playing section (track image + info)
- 📦 Real-time API interaction with Spotify
- 🔍 Real-time track search integrated into the navbar (no page redirection)

---

## 📂 Folder Structure

```
src/
│
├── comp/
│   ├── Body.jsx
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── Footer.jsx
│   ├── CurrentTrack.jsx
│   ├── PlayerControls.jsx
│   ├── Volume.jsx
│   └── Playlists.jsx
│
├── utils/
│   ├── StateProvider.jsx
│   ├── constants.js
│   └── reducer.jsx
│
├── App.js
└── index.js
```

---

## 🧪 Tech Stack

- **React.js** for building the frontend
- **Styled Components** for styling
- **Spotify Web API** for music data and control
- **Axios** for API calls
- **React Context API** for global state

---

## 🔐 Prerequisites

- A [Spotify Developer Account](https://developer.spotify.com/dashboard)
- Create an app and get your **Client ID**
- Set Redirect URI to `http://localhost:5173/`

---

## 🛠️ Installation & Setup

```bash
git clone https://github.com/YOUR_USERNAME/spotify-clone.git
cd spotify-clone
npm install
npm run dev
```

> The app runs on Vite by default. You can switch to Create React App if needed.

---

## 🔑 Spotify Login Flow

```js
window.location.href =
  `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope.join("%20")}&response_type=token&show_dialog=true`;
```

---

## ✅ Working Functionalities

- [x] User can log in with Spotify
- [x] All playlists fetched using `GET /me/playlists`
- [x] Tracks displayed for selected playlist
- [x] Track plays on click using `PUT /me/player/play`
- [x] Next/Previous using `POST /me/player/next | previous`
- [x] Real-time current track updates via `GET /me/player/currently-playing`
- [x] Volume control using `PUT /me/player/volume`
- [x] Real-time song search via `GET /v1/search`

---

## ⚠️ Known Issues

- UI update delay when switching playlists
- Track info may lag slightly due to Spotify API caching
- Requires an active Spotify device/player session to initiate playback

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you would like to change.

---

## 📃 License

This project is **not for commercial use** and is built for **educational purposes** only.

---

Made with 💚 by **VIPUL BHATT**
