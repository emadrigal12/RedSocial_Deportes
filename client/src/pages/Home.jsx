import { useState } from 'react';
import CreatePost from '../components/posts/CreatePost';
import PostCard from '../components/posts/PostCard';

const Home = () => {
  const [posts] = useState([
    {
      id: 1,
      user: 'María García',
      content: '¡Increíble día en la playa!',
      likes: 24,
      comments: 5,
      time: '1h'
    },
    {
      id: 2,
      user: 'Carlos López',
      content: 'Nuevo proyecto en camino.',
      likes: 15,
      comments: 3,
      time: '2h'
    }
  ]);

  return (
    <>
      <CreatePost />
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
};

export default Home;