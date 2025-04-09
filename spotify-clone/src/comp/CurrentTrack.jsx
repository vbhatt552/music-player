import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useStateProvider } from '../utils/StateProvider';
import axios from 'axios';
import { reducerCases } from '../utils/constants.js'; // Make sure this exists!

export default function CurrentTrack() {
  const [{ token, currentlyPlaying }, dispatch] = useStateProvider();

  useEffect(() => {
    const getCurrentTrack = async () => {
      const response = await axios.get(
        'https://api.spotify.com/v1/me/player/currently-playing',
        {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data !== '') {
        const { item } = response.data;
        const currentPlaying = {
          id: item.id,
          name: item.name,
          artists: item.artists.map((singer) => singer.name),
          image: item.album.images[2]?.url || item.album.images[0]?.url || "", // fallback
        };

        dispatch({ type: reducerCases.SET_PLAYING, currentlyPlaying: currentlyPlaying });
      }
    };

    getCurrentTrack();
  }, [token, dispatch]);

  return (
    <Container>
      {currentlyPlaying && (
        <div className="track">
          <div className="track__image">
            <img src={currentlyPlaying.image} alt="currently playing" />
          </div>
          <div className="track__info">
            <h4>{currentlyPlaying.name}</h4>
            <h6>{currentlyPlaying.artists.join(', ')}</h6>
          </div>
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  .track {
    display: flex;
    align-items: center;
    gap: 1rem;
    .track__image img {
      height: 50px;
      width: 50px;
      border-radius: 5px;
    }
    .track__info {
      display: flex;
      flex-direction: column;
      gap:0.3rem,
      h4 {
        margin: 0;
        color: white;
      }
      h6 {
        margin: 0;
        color: #B3B3B3;
      }
    }
  }
`;
