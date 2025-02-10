export class EnvValidationError extends Error {
  readonly missingVars: string[];

  constructor(missingVars: string[]) {
    super(`Variáveis de ambiente faltando: ${missingVars.join(', ')}`);
    this.name = 'EnvValidationError';
    this.missingVars = missingVars;
    Error.captureStackTrace(this, this.constructor);
  }
}
