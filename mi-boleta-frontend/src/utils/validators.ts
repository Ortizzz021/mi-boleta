export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'El email es obligatorio';
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return 'El formato del email no es válido';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'La contraseña es obligatoria';
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
  return null;
}

export function validateName(name: string): string | null {
  if (!name.trim()) return 'El nombre es obligatorio';
  if (name.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
  if (name.trim().length > 80) return 'El nombre no puede exceder 80 caracteres';
  return null;
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value.trim()) return `${fieldName} es obligatorio`;
  return null;
}

export function validateDate(dateStr: string, fieldName: string): string | null {
  if (!dateStr) return `${fieldName} es obligatorio`;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return `${fieldName} no es una fecha válida`;
  return null;
}

export function validatePositiveNumber(value: string, fieldName: string): string | null {
  if (!value) return null; // Optional field
  const num = parseFloat(value);
  if (isNaN(num)) return `${fieldName} debe ser un número válido`;
  if (num < 0) return `${fieldName} no puede ser negativo`;
  return null;
}

export function parseApiErrors(errorMessage: string): Record<string, string> {
  const errors: Record<string, string> = {};

  const cleaned = errorMessage.replace(/^Datos inválidos:\s*/, '');
  const parts = cleaned.split(';').map(p => p.trim()).filter(Boolean);

  for (const part of parts) {
    const colonIndex = part.indexOf(':');
    if (colonIndex > -1) {
      const field = part.substring(0, colonIndex).trim();
      const message = part.substring(colonIndex + 1).trim();
      errors[field] = message;
    } else {
      errors['_general'] = part;
    }
  }

  return errors;
}
