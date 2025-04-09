import React from 'react'
import { useStateProvider } from '../utils/StateProvider';
import styled from 'styled-components';
import axios from 'axios';
export default function Volume() {
    const [{ token}] = useStateProvider();
 const setVolume = async(e)=>{
  const volume = parseInt(e.target.value);
   await axios.put(
      `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`,{},
      {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
    
 })};
    return (
    <Container >
        <input type = "range" min = {0} max = {100} onMouseUp={(e=>setVolume(e))}/>
    </Container>
  )
}
 const Container = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  input[type='range'] {
    width: 15rem;
    cursor: pointer;
    border-radius:2rem;
    height:0.5rem;
}
 `;