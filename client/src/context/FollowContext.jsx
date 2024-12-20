import { createContext, useContext, useState } from 'react';

const FollowContext = createContext();

export const FollowProvider = ({ children }) => {
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);

  // Función para seguir a un usuario
  const followUser = (userToFollow) => {
    setFollowing((prev) => [...prev, userToFollow]);
  };

  // Función para dejar de seguir a un usuario
  const unfollowUser = (userToUnfollow) => {
    setFollowing((prev) => prev.filter((user) => user.id !== userToUnfollow.id));
  };

  return (
    <FollowContext.Provider value={{ following, followers, followUser, unfollowUser }}>
      {children}
    </FollowContext.Provider>
  );
};

export const useFollow = () => useContext(FollowContext);
