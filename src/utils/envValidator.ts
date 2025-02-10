import { EnvValidationError } from '../errors/envValidationError';

export class EnvValidator {
  static validate<T extends string>(requiredVars: T[]): Record<T, string> {
    const missing = requiredVars.filter((varName) => !process.env[varName]);

    if (missing.length) {
      throw new EnvValidationError(missing);
    }

    return requiredVars.reduce(
      (acc, varName) => {
        acc[varName] = process.env[varName]!;
        return acc;
      },
      {} as Record<T, string>,
    );
  }
}
