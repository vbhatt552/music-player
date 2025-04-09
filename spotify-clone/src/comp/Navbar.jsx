import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { useStateProvider } from "../utils/StateProvider";
import axios from "axios";
import { reducerCases } from "../utils/constants";

export default function Navbar({ navBackground }) {
  const [{ userInfo, token }, dispatch] = useStateProvider();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.length > 1) {
        searchSpotify(search);
      } else {
        setResults([]);
      }
    }, 400); 

    return () => clearTimeout(timer);
  }, [search]);

  const searchSpotify = async (query) => {
    try {
      const { data } = await axios.get(
        `https://api.spotify.com/v1/search?q=${query}&type=track&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResults(data.tracks.items);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const playTrack = async (track) => {
    const { uri, album, track_number, name, artists } = track;
    await axios.put(
      `https://api.spotify.com/v1/me/player/play`,
      {
        context_uri: album.uri,
        offset: {
          position: track_number - 1,
        },
        position_ms: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const currentPlaying = {
      id: track.id,
      name: name,
      artists: artists.map((a) => a.name),
      image: album.images[2]?.url,
    };
    dispatch({ type: reducerCases.SET_PLAYING, currentlyPlaying: currentPlaying });
    dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
    setSearch(""); 
    setResults([]);
  };

  return (
    <Container navBackground={navBackground}>
      <div className="search__bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Search for songs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {results.length > 0 && (
          <div className="results">
            {results.map((track) => (
              <div key={track.id} className="result" onClick={() => playTrack(track)}>
                <img src={track.album.images[2]?.url} alt="album" />
                <div className="info">
                  <div className="name">{track.name}</div>
                  <div className="artists">{track.artists.map(a => a.name).join(", ")}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="avatar">
        <a href="#">
          {userInfo?.userImage ? (
            <img src={userInfo.userImage} alt="profile" />
          ) : (
            <CgProfile />
          )}
          <span>{userInfo?.userName}</span>
        </a>
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  height: 15vh;
  position: sticky;
  top: 0;
  transition: 0.3s ease-in-out;
  background-color: ${({ navBackground }) =>
    navBackground ? "rgba(0,0,0,0.8)" : "none"};

  .search__bar {
    position: relative;
    background-color: white;
    width: 30%;
    padding: 0.4rem 1rem;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    input {
      background-color: transparent;
      border: none;
      height: 2rem;
      width: 100%;
      color: black;
      font-size: 1rem;

      &::placeholder {
        color: gray;
      }

      &:focus {
        outline: none;
      }
    }

    .results {
      position: absolute;
      top: 3.2rem;
      left: 0;
      right: 0;
      background: white;
      border-radius: 0.5rem;
      max-height: 300px;
      overflow-y: auto;
      z-index: 999;
      .name{
      color:black;
      }
      .result {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        padding: 0.5rem 1rem;
        cursor: pointer;
        transition: 0.2s;

        &:hover {
          background-color: #f1f1f1;
        }

        img {
          height: 40px;
          width: 40px;
          border-radius: 4px;
        }

        .info {
          .name {
            font-weight: bold;
            font-size: 0.9rem;
          }

          .artists {
            font-size: 0.75rem;
            color: gray;
          }
        }
      }
    }
  }

  .avatar {
    display: flex;
    align-items: center;
    gap: 1rem;

    a {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: white;

      img {
        height: 2.5rem;
        width: 2.5rem;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    span {
      font-weight: 600;
    }
  }
`;
