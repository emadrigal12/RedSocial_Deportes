import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

const RecuperarContrasena = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmailSent(true);
    }, 1500);
  };

  const handleTryAnotherEmail = () => {
    setEmailSent(false);
    setEmail('');
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-gradient-x">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="space-y-6 select-none">
            <h1 className="text-center text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 tracking-tight hover:scale-105 transition-transform duration-300">
              Sportify
            </h1>
          </div>

          <Card className="bg-white shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  ¡Correo enviado!
                </h2>
                <p className="text-sm text-gray-600">
                  Hemos enviado un enlace de recuperación a:
                </p>
                <p className="font-medium text-gray-900">{email}</p>
                <div className="text-sm text-gray-600">
                  <p>Por favor, revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.</p>
                  <p className="mt-2">No olvides revisar tu carpeta de spam.</p>
                </div>
                <div className="pt-4 space-y-3">
                  <Button 
                    onClick={handleTryAnotherEmail}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Intentar con otro correo
                  </Button>
                  <a href="/" className="block">
                    <Button 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Volver al inicio de sesión
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-gradient-x">
      <div className="w-full max-w-md mx-auto space-y-8">
        <div className="space-y-6 select-none">
          <h1 className="text-center text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 tracking-tight hover:scale-105 transition-transform duration-300">
            Sportify
          </h1>
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-2xl font-bold">
                Recuperar contraseña
              </CardTitle>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="email">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@ejemplo.com"
                    required
                    className="w-full pl-10"
                  />
                </div>
              </div>

              <Alert className="bg-blue-50 border border-blue-200 text-blue-800">
                <AlertDescription>
                  Te enviaremos un correo con un enlace para restablecer tu contraseña. El enlace expirará en 24 horas.
                </AlertDescription>
              </Alert>

              <Button 
                type="submit" 
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? "Enviando instrucciones..." : "Enviar instrucciones"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Recordaste tu contraseña?{' '}
                <a href="/" className="text-orange-500 hover:text-orange-600 font-medium">
                  Volver al inicio de sesión
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecuperarContrasena;