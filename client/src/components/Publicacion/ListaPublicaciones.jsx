import { useState, useEffect } from 'react';
import { CrearPublicacion } from './CrearPublicacion';
import { Publicacion } from './Publicacion';
import { getPosts } from '../../lib/firebase/config';

export const ListaPublicaciones = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const postsData = await getPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Error al obtener las publicaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <CrearPublicacion onPostCreated={fetchPosts} />
      
      {loading ? (
        <div className="text-center py-4">Cargando publicaciones...</div>
      ) : (
        posts.map(post => (
          <Publicacion key={post.id} post={post} />
        ))
      )}
    </div>
  );
};