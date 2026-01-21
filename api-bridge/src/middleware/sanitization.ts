import { Request, Response, NextFunction } from 'express';
import { escape } from 'validator';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitiza string para prevenir XSS attacks
 * Usa validator.escape para escapar caracteres HTML especiales
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return input;
  return escape(input.trim());
}

/**
 * Sanitiza contenido HTML permitiendo solo tags seguros
 * Usa DOMPurify para limpiar HTML mientras preserva tags permitidos
 */
export function sanitizeHtml(input: string, options = {}): string {
  if (typeof input !== 'string') return input;

  const defaultOptions = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id'],
    ALLOW_DATA_ATTR: false,
    SAFE_FOR_JQUERY: true,
    ...options
  };

  return DOMPurify.sanitize(input, defaultOptions);
}

/**
 * Sanitiza objeto recursivamente
 * Escapa todos los valores string del objeto
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject) as T;
  }

  const sanitized: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = (obj as Record<string, unknown>)[key];
      sanitized[key] = typeof value === 'string'
        ? sanitizeString(value)
        : typeof value === 'object'
        ? sanitizeObject(value)
        : value;
    }
  }

  return sanitized as T;
}

/**
 * Middleware para sanitizar body de request
 */
export function sanitizeBody(req: Request, res: Response, next: NextFunction): void {
  try {
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body);
    }
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid request body' });
  }
}

/**
 * Sanitiza parámetros de query string
 */
export function sanitizeQuery(req: Request, res: Response, next: NextFunction): void {
  try {
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid query parameters' });
  }
}

/**
 * Sanitiza parámetros de ruta
 */
export function sanitizeParams(req: Request, res: Response, next: NextFunction): void {
  try {
    if (req.params) {
      req.params = sanitizeObject(req.params);
    }
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid route parameters' });
  }
}

/**
 * Valida y sanitiza email
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') return email;
  const trimmed = email.trim().toLowerCase();
  // Remover caracteres peligrosos
  return trimmed.replace(/[<>]/g, '');
}

/**
 * Valida y sanitiza URLs
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') return url;

  try {
    // Validar que es una URL válida
    const urlObj = new URL(url);
    // Solo permitir http y https
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      throw new Error('Invalid URL protocol');
    }
    return urlObj.toString();
  } catch {
    // Si no es una URL válida, sanitizar como string normal
    return sanitizeString(url);
  }
}

/**
 * Valida IDs de tipo UUID
 */
export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
