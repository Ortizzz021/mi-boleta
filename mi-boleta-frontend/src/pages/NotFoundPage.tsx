import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export function NotFoundPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div
      className="page-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
      }}
    >
      <div
        className="animate-fade-in-up"
        style={{
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-2xl)',
          boxShadow: 'var(--shadow-xl)',
          maxWidth: '500px',
        }}
      >
        <span style={{ fontSize: '72px', display: 'block', marginBottom: 'var(--space-md)' }}>
          🔍
        </span>
        <h1
          style={{
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 800,
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 'var(--space-sm)',
          }}
        >
          404 - Página no encontrada
        </h1>
        <p
          style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-xl)',
            lineHeight: 1.6,
          }}
        >
          Lo sentimos, la página que buscas no existe o fue movida. ¡Quizás esta boleta no tiene premio!
        </p>

        <Button
          variant="primary"
          onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
          style={{ margin: '0 auto' }}
        >
          {isAuthenticated ? 'Ir al Dashboard' : 'Iniciar Sesión'}
        </Button>
      </div>
    </div>
  );
}
