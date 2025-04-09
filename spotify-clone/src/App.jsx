import { useEffect } from 'react'
import Login from './comp/login'
import { useStateProvider } from './utils/StateProvider'
import { reducerCases } from './utils/constants';
import Spotify from './comp/spotify';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
`;

function App() {
  const [{ token }, dispatch] = useStateProvider();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = hash.substring(1).split("&")[0].split('=')[1];
      dispatch({ type: reducerCases.SET_TOKEN, token });
    }
  }, [token, dispatch]);

  return (
    <>
      <GlobalStyle /> {/* Inject global CSS */}
      <div>{token ? <Spotify /> : <Login />}</div>
    </>
  )
}

export default App;
