import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
  BsShuffle,
} from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { FiRepeat } from "react-icons/fi";
import { useStateProvider } from "../utils/StateProvider";
import axios from "axios";
import { reducerCases } from "../utils/constants.js";

export default function PlayerControls() {
  const [{ token, playerState }, dispatch] = useStateProvider();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  
  useEffect(() => {
    const fetchProgress = async () => {
      const response = await axios.get("https://api.spotify.com/v1/me/player", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (response.data?.item) {
        setProgress(response.data.progress_ms);
        setDuration(response.data.item.duration_ms);
      }
    };

    const interval = setInterval(fetchProgress, 1000);
    return () => clearInterval(interval);
  }, [token]);

  const changeTrack = async (type) => {
    await axios.post(
      `https://api.spotify.com/v1/me/player/${type}`,
      {},
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    const response = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data !== "") {
      const { item } = response.data;
      const currentPlaying = {
        id: item.id,
        name: item.name,
        artists: item.artists.map((singer) => singer.name),
        image: item.album.images[2]?.url || item.album.images[0]?.url || "",
      };

      dispatch({
        type: reducerCases.SET_PLAYING,
        currentlyPlaying: currentPlaying,
      });
    } else {
      dispatch({ type: reducerCases.SET_PLAYING, currentPlaying: null });
    }
  };

  const changeState = async () => {
    const state = !playerState;
    const url = state
      ? `https://api.spotify.com/v1/me/player/play`
      : `https://api.spotify.com/v1/me/player/pause`;
    await axios.put(
      url,
      {},
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    dispatch({
      type: reducerCases.SET_PLAYER_STATE,
      playerState: state,
    });
  };

  const handleSeek = async (e) => {
    const newPosition = parseInt(e.target.value);
    setProgress(newPosition);
    await axios.put(
      `https://api.spotify.com/v1/me/player/seek?position_ms=${newPosition}`,
      {},
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
  };

  const formatTime = (ms) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  return (
    <Container>
      <div className="controls">
        <div className="shuffle">
          <BsShuffle />
        </div>
        <div className="previous">
          <CgPlayTrackPrev onClick={() => changeTrack("previous")} />
        </div>
        <div className="state">
          {playerState ? (
            <BsFillPauseCircleFill onClick={changeState} />
          ) : (
            <BsFillPlayCircleFill onClick={changeState} />
          )}
        </div>
        <div className="next">
          <CgPlayTrackNext onClick={() => changeTrack("next")} />
        </div>
        <div className="repeat">
          <FiRepeat />
        </div>
      </div>
      <div className="seek">
        <span>{formatTime(progress)}</span>
        <input
          type="range"
          min={0}
          max={duration}
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
          onMouseUp={handleSeek}
        />
        <span>{formatTime(duration)}</span>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: white;

  .controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;

    svg {
      cursor: pointer;
      transition: 0.2s ease-in-out;
      font-size: 1.5rem;

      &:hover {
        transform: scale(1.2);
        color: #1db954;
      }
    }

    .state svg {
      font-size: 2.5rem;
    }
  }

  .seek {
    width: 80%;
    display: flex;
    align-items: center;
    gap: 1rem;

    span {
      font-size: 0.75rem;
      width: 3rem;
      text-align: center;
    }

    input[type="range"] {
      flex: 1;
      appearance: none;
      height: 4px;
      border-radius: 2px;
      background: #1db954;
      cursor: pointer;
    }

    input[type="range"]::-webkit-slider-thumb {
      appearance: none;
      width: 12px;
      height: 12px;
      background: white;
      border-radius: 50%;
    }
  }
`;
