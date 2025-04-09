import React from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { useStateProvider } from "../utils/StateProvider";

export default function Navbar({ navBackground }) {
  const [{ userInfo }] = useStateProvider();

  return (
    <Container navBackground={navBackground}>
      <div className="search__bar">
        <FaSearch />
        <input type="text" placeholder="Artists, songs or podcasts" />
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
      color: black; /* Make text visible */
      font-size: 1rem;

      &::placeholder {
        color: gray;
      }

      &:focus {
        outline: none;
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
