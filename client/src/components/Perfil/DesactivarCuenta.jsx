import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PropTypes from 'prop-types';
import { UserMinus } from 'lucide-react';

export const DesactivarCuenta = ({ onDeactivate }) => {
  const { user, deactivateAccount } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleDeactivateAccount = async () => {
    try {
      await deactivateAccount();
      toast({
        variant: 'success',
        title: 'Cuenta desactivada',
        description: 'Tu cuenta ha sido desactivada exitosamente.',
      });
      onDeactivate();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error al desactivar la cuenta:', error);
      toast({
        variant: 'destructive',
        title: 'Error al desactivar la cuenta',
        description: 'Hubo un problema al desactivar tu cuenta. Por favor, intenta de nuevo.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 bg-white"
          onClick={() => setIsOpen(true)}
        >
          <UserMinus className="mr-2 h-4 w-4" />
          <span>Desactivar Cuenta</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Desactivar Cuenta</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          ¿Estás seguro de que deseas desactivar tu cuenta? Esta acción es permanente y no podrás volver a acceder a tu cuenta.
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDeactivateAccount}>
            Desactivar Cuenta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

DesactivarCuenta.propTypes = {
  onDeactivate: PropTypes.func.isRequired,
};