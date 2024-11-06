import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SPORTS = [
  { id: 1, name: 'Fútbol', icon: '⚽' },
  { id: 2, name: 'Baloncesto', icon: '🏀' },
  { id: 3, name: 'Tenis', icon: '🎾' },
  { id: 4, name: 'Baseball', icon: '⚾' },
  { id: 5, name: 'Volleyball', icon: '🏐' },
  { id: 6, name: 'Rugby', icon: '🏉' },
  { id: 7, name: 'Natación', icon: '🏊‍♂️' },
  { id: 8, name: 'Atletismo', icon: '🏃‍♂️' },
  { id: 9, name: 'Ciclismo', icon: '🚴‍♂️' },
  { id: 10, name: 'Golf', icon: '⛳' },
  { id: 11, name: 'Boxeo', icon: '🥊' },
  { id: 12, name: 'Hockey', icon: '🏑' },
];

const Intereses = () => {
  const [selectedSports, setSelectedSports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false)
  const { user, saveUserInterests } = useAuth();
  const navigate = useNavigate();

  const handleSportClick = (sportId, sportName) => {
    if (selectedSports.includes(sportName)) {
      setSelectedSports(selectedSports.filter(id => id !== sportName));
    } else {
      setSelectedSports([...selectedSports, sportName]);
    }
  };

 
  const handleSubmitFake = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      window.location.href = '/home';
      setLoading(false);
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    setLoading(true);

    try {
      await saveUserInterests(selectedSports);
      
      navigate('/home');
    } catch (error) {
      console.error('Error al completar el registro:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSports = SPORTS.filter(sport =>
    sport.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canContinue = selectedSports.length >= 3;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-center text-orange-500 mb-4">
          Sportify
        </h1>
  
        <Card className="bg-white shadow-lg mt-6">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">
              Personaliza tu experiencia
            </CardTitle>
            <p className="text-gray-500">
              Selecciona al menos 3 deportes que te interesen para personalizar tu feed
            </p>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar deportes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-white bg-transparent hover:bg-white hover:text-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
  
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              {filteredSports.map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => handleSportClick(sport.id, sport.name)}
                  className={`aspect-square rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${
                    selectedSports.includes(sport.name)
                      ? 'bg-orange-100 border-2 border-orange-500'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <span className="text-3xl">{sport.icon}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {sport.name}
                  </span>
                </button>
              ))}
            </div>
  
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                {selectedSports.length} de 3 deportes seleccionados
              </p>
              <Button
                className="w-full sm:w-auto px-8 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300"
                disabled={!canContinue || loading}
                onClick = { handleSubmit }
              >
                Continuar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  
};

export default Intereses;