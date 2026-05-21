import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/client';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { validateEmail, validatePassword, validateName } from '../utils/validators';
import './Auth.css';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (nameErr) newErrors.name = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');
    setSuccess(false);

    if (!validate()) return;

    setLoading(true);
    try {
      await register({ name, email, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setApiError('Ya existe una cuenta con este correo electrónico.');
        } else {
          setApiError(err.message);
        }
      } else {
        setApiError('Error de conexión. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <span className="auth-logo">🎰</span>
          <h1 className="auth-title">Crear Cuenta</h1>
          <p className="auth-subtitle">Registra tus boletas y nunca pierdas un premio</p>
        </div>

        <div className="auth-card">
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {apiError && (
              <div className="auth-error">
                <span className="auth-error-icon">⚠️</span>
                <span>{apiError}</span>
              </div>
            )}

            {success && (
              <div className="auth-success">
                <span>✅</span>
                <span>¡Cuenta creada! Redirigiendo al login...</span>
              </div>
            )}

            <Input
              label="Nombre completo"
              type="text"
              name="name"
              placeholder="Juan Pérez"
              icon="👤"
              value={name}
              onChange={e => setName(e.target.value)}
              error={errors.name}
              autoComplete="name"
              autoFocus
            />

            <Input
              label="Correo electrónico"
              type="email"
              name="email"
              placeholder="tu@email.com"
              icon="📧"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              label="Contraseña"
              type="password"
              name="password"
              placeholder="Mínimo 8 caracteres"
              icon="🔒"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="new-password"
            />

            <Input
              label="Confirmar contraseña"
              type="password"
              name="confirmPassword"
              placeholder="Repite tu contraseña"
              icon="🔒"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <Button type="submit" fullWidth loading={loading} size="lg" disabled={success}>
              Crear Cuenta
            </Button>
          </form>
        </div>

        <div className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}
