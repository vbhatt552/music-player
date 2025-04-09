import React, { useEffect } from "react";
import styled from "styled-components";
import { AiFillClockCircle } from "react-icons/ai";
import { useStateProvider } from "../utils/StateProvider";
import axios from "axios";
import { reducerCases } from "../utils/constants";

export default function Body({headerBackground}) {
  const [{ token, selectedPlaylistId, selectedPlaylist }, dispatch] = useStateProvider();

  useEffect(() => {
    const getInitialPlaylist = async () => {
      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${selectedPlaylistId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );

      const selectedPlaylist = {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description.startsWith("<a")
          ? ""
          : response.data.description,
        image: response.data.images[0].url,
        tracks: response.data.tracks.items.map(({ track }) => ({
          id: track.id,
          name: track.name,
          artists: track.artists.map((artist) => artist.name),
          image: track.album.images[2]?.url || track.album.images[0]?.url,
          duration: track.duration_ms,
          album: track.album.name,
          context_uri: track.album.uri,
          track_number: track.track_number,
        })),
      };

      dispatch({ type: reducerCases.SET_PLAYLIST, selectedPlaylist });
    };
    if (token && selectedPlaylistId) getInitialPlaylist();
  }, [token, selectedPlaylistId, dispatch]);

  const msToMinutes = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  const playTrack = async(id,name,artists,image,context_uri,track_number)=>{
  const response =   await axios.put(
      `https://api.spotify.com/v1/me/player/play`,
      {
        context_uri,
        offset:{
          position:track_number-1,
        },
        position_ms:0,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    if(response.status===204){
      const currentPlaying = {
        id,name,artists,image,
      }
      dispatch({type:reducerCases.SET_PLAYING,currentPlaying});
      dispatch({type:reducerCases.SET_PLAYER_STATE,playerState:true});
    }else{
      dispatch({type:reducerCases.SET_PLAYER_STATE,playerState:true});
    }
  }

  return (
    <Container headerBackground= {headerBackground}>
      {selectedPlaylist && (
        <>
          <div className="playlist">
            <div className="image">
              <img src={selectedPlaylist.image} alt="selectedplaylist" />
            </div>
            <div className="details">
              <span className="type">PLAYLIST</span>
              <h1 className="title">{selectedPlaylist.name}</h1>
              <p className="description">{selectedPlaylist.description}</p>
            </div>
          </div>
          <div className="list">
            <div className="header__row">
              <div className="col hash">#</div>
              <div className="col title">TITLE</div>
              <div className="col album">ALBUM</div>
              <div className="col time">
                <AiFillClockCircle />
              </div>
            </div>
            <div className="tracks">
              {selectedPlaylist.tracks.map(
                (
                  {
                    id,
                    name,
                    image,
                    duration,
                    album,
                    artists,
                    context_uri,
                    track_number,
                  },
                  index
                ) => {
                  return (
                    <div className="row" key={id} onClick={()=>playTrack(id,name,artists,image,context_uri,track_number)}>
                      <div className="col hash">{index + 1}</div>
                      <div className="col title">
                        <img src={image} alt="track" />
                        <div className="info">
                          <span className="name">{name}</span>
                          <span className="artists">{artists.join(", ")}</span>
                        </div>
                      </div>
                      <div className="col album">{album}</div>
                      <div className="col time">{msToMinutes(duration)}</div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  padding: 2rem;
  color: white;

  .playlist {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;

    .image img {
      height: 200px;
      width: 200px;
      border-radius: 10px;
    }

    .details {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: 1rem;

      .type {
        font-size: 0.75rem;
        color: #b3b3b3;
        letter-spacing: 2px;
      }

      .title {
        font-size: 2.5rem;
      }

      .description {
        font-size: 1rem;
        color: #b3b3b3;
      }
    }
  }

  .list {
    .header__row {
      position:sticky;
      display: grid;
      grid-template-columns: 0.3fr 3fr 2fr 0.1fr;
      padding: 1rem 3rem;
      margin:1rem 0 0 0 ;
      color:#dddcdc;
      top:15vh;
      transition:0.3s ease-in-out;
      background-color: ${({ headerBackground }) =>
    headerBackground ? "#000000dc" : "none"};
    }

    .tracks {
      .row {
        display: grid;
        grid-template-columns: 0.3fr 3fr 2fr 0.3fr;
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        transition: background 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
          cursor:pointer;
        }

        .title {
          display: flex;
          align-items: center;
          gap: 1rem;

          img {
            height: 40px;
            width: 40px;
            border-radius: 4px;
          }

          .info {
            display: flex;
            flex-direction: column;

            .name {
              font-size: 1rem;
              color: white;
            }

            .artists {
              font-size: 0.8rem;
              color: #b3b3b3;
            }
          }
        }

        .album,
        .time,
        .hash {
          font-size: 0.9rem;
        }
      }
    }
  }
`;
