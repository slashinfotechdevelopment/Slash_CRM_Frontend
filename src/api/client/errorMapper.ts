export interface NormalizedError {
  status: number;
  message: string;
  fieldErrors?: Record<string, string>;
  isNetworkError?: boolean;
}

/**
 * Strips raw internal database CUIDs, UUIDs, or stack traces from error strings
 */
function cleanMessage(rawText: string): string {
  if (!rawText) return 'An unexpected error occurred. Please try again.';

  let text = String(rawText);

  // Mask CUIDs (e.g. c[a-z0-9]{24})
  text = text.replace(/\bc[a-z0-9]{20,30}\b/gi, 'item');

  // Mask UUIDs
  text = text.replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, 'record');

  // Mask internal Prisma / NestJS phrases
  text = text.replace(/Foreign key constraint failed on the field: `.*?`/gi, 'Related record was not found or is in use');
  text = text.replace(/Unique constraint failed on the constraint: `.*?`/gi, 'A record with these details already exists');
  text = text.replace(/PrismaClientKnownRequestError:?/gi, '');

  return text.trim();
}

/**
 * Normalizes Axios / HTTP errors into clear, friendly error structures
 */
export function normalizeError(error: unknown): NormalizedError {
  if (!error) {
    return {
      status: 500,
      message: 'An unexpected error occurred. Please try again.',
    };
  }

  const err = error as {
    response?: {
      status?: number;
      data?: {
        message?: string | string[];
        statusCode?: number;
        error?: string;
        errors?: Record<string, string[]>;
      } | string;
    };
    code?: string;
    message?: string;
  };

  // Network error (no response)
  if (!err.response) {
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      return {
        status: 408,
        message: 'The request timed out. Please check your connection and try again.',
        isNetworkError: true,
      };
    }
    return {
      status: 0,
      message: 'Unable to reach the server. Please verify your internet connection.',
      isNetworkError: true,
    };
  }

  const status = err.response.status || 500;
  const data = err.response.data;
  const fieldErrors: Record<string, string> = {};

  let message = 'An error occurred while processing your request.';

  // Check if server returned structured message
  if (typeof data === 'string') {
    message = data;
  } else if (data && typeof data === 'object') {
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      // Backend structured validation errors array from HttpExceptionFilter
      message = data.errors.map(cleanMessage).join(' • ');
      data.errors.forEach((msg: unknown) => {
        const str = String(msg);
        const parts = str.split(' ');
        if (parts.length > 0) {
          const field = parts[0].replace(/[^a-zA-Z0-9_.]/g, '');
          fieldErrors[field] = cleanMessage(str);
        }
      });
    } else if (Array.isArray(data.message)) {
      // NestJS default validation error array e.g. ["email must be an email", "phone is required"]
      message = data.message.map(cleanMessage).join(' • ');
      data.message.forEach((msg: string) => {
        const parts = msg.split(' ');
        if (parts.length > 0) {
          const field = parts[0].replace(/[^a-zA-Z0-9_.]/g, '');
          fieldErrors[field] = cleanMessage(msg);
        }
      });
    } else if (data.message) {
      message = cleanMessage(data.message);
    } else if (data.error) {
      message = cleanMessage(data.error);
    }

    if (data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
      Object.entries(data.errors).forEach(([key, val]) => {
        fieldErrors[key] = cleanMessage(String(val));
      });
    }
  }

  // Standard HTTP status code friendly overrides
  switch (status) {
    case 400:
      if (!message || message === 'Bad Request') {
        message = 'Please check the information provided and correct any invalid fields.';
      }
      break;
    case 401:
      message = 'Your session has expired. Please sign in again to continue.';
      break;
    case 403:
      message = 'You do not have permission to perform this action.';
      break;
    case 404:
      message = 'The requested item or resource could not be found.';
      break;
    case 409:
      if (!message || message === 'Conflict') {
        message = 'This record already exists or conflicts with an existing entry.';
      }
      break;
    case 422:
      if (!message || message === 'Unprocessable Entity') {
        message = 'The submitted information could not be processed. Please verify your input.';
      }
      break;
    case 429:
      message = 'Too many requests. Please wait a moment before trying again.';
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      message = 'The server encountered an issue. Our team has been notified. Please try again shortly.';
      break;
  }

  return {
    status,
    message,
    fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
  };
}

/**
 * Safely extracts a human-readable error message from an unknown catch error
 */
export function getErrorMessage(err: unknown, fallback = 'An unexpected error occurred. Please try again.'): string {
  if (!err) return fallback;
  if (typeof err === 'string') return cleanMessage(err);
  if (err instanceof Error) return cleanMessage(err.message);
  if (typeof err === 'object') {
    const obj = err as Record<string, unknown>;
    if (typeof obj.message === 'string' && obj.message) {
      return cleanMessage(obj.message);
    }
    if (Array.isArray(obj.message) && obj.message.length > 0) {
      return obj.message.map((m) => cleanMessage(String(m))).join(' • ');
    }
    if (Array.isArray(obj.errors) && obj.errors.length > 0) {
      return obj.errors.map((m) => cleanMessage(String(m))).join(' • ');
    }
    if (typeof obj.error === 'string' && obj.error) {
      return cleanMessage(obj.error);
    }
  }
  return fallback;
}

