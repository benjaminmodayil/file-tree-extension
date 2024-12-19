export class FileTreeError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'FileTreeError';
  }
}

export const ErrorCodes = {
  ACCESS_DENIED: 'ACCESS_DENIED',
  INVALID_PATH: 'INVALID_PATH',
  MAX_DEPTH_EXCEEDED: 'MAX_DEPTH_EXCEEDED',
} as const;
