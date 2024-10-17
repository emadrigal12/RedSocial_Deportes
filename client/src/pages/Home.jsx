import { useState } from 'react';
import {CrearPublicacion} from '../components/Publicacion/CrearPublicacion';
import {Publicacion}  from '../components/Publicacion/Publicacion';

const Home = () => {
  const [posts] = useState([
    {
      id: 1,
      user: 'María García',
      content: '¡Increíble la final del mundial de tennis!',
      likes: 24,
      comments: 5,
      time: '1h'
    },
    {
      id: 2,
      user: 'Carlos López',
      content: 'Quien se apunta a un partido de futbol cerca de San Jose?',
      likes: 15,
      comments: 3,
      time: '2h'
    }
  ]);

  return (
    <>
      <CrearPublicacion />
        {posts.map(post => (
          <Publicacion key={post.id} post={post} />
        ))}
    </>
  );
};

export default Home;