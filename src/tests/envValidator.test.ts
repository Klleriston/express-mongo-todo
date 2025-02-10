import { EnvValidator } from "../utils/envValidator";
import { EnvValidationError } from "../errors/envValidationError";

describe("EnvValidator", () => {
  beforeEach(() => {
    process.env = {};
  });

  it("deve retornar as variáveis de ambiente quando todas estiverem presentes", () => {
    process.env.MONGODB_URI = "mongodb://localhost:27017/testdb";
    process.env.PORT = "3000";

    const result = EnvValidator.validate(["MONGODB_URI", "PORT"]);

    expect(result).toEqual({
      MONGODB_URI: "mongodb://localhost:27017/testdb",
      PORT: "3000",
    });
  });

  it("deve lançar um erro quando uma variável de ambiente estiver ausente", () => {
    process.env.PORT = "3000";

    expect(() => EnvValidator.validate(["MONGODB_URI", "PORT"])).toThrow(
      EnvValidationError
    );

    try {
      EnvValidator.validate(["MONGODB_URI", "PORT"]);
    } catch (error) {
      if (error instanceof EnvValidationError) {
        expect(error.missingVars).toEqual(["MONGODB_URI"]);
        expect(error.message).toBe(
          "Variáveis de ambiente faltando: MONGODB_URI"
        );
      }
    }
  });

  it("deve lançar um erro quando todas as variáveis de ambiente estiverem ausentes", () => {
    expect(() => EnvValidator.validate(["MONGODB_URI", "PORT"])).toThrow(
      EnvValidationError
    );

    try {
      EnvValidator.validate(["MONGODB_URI", "PORT"]);
    } catch (error) {
      if (error instanceof EnvValidationError) {
        expect(error.missingVars).toEqual(["MONGODB_URI", "PORT"]);
        expect(error.message).toBe(
          "Variáveis de ambiente faltando: MONGODB_URI, PORT"
        );
      }
    }
  });

  it("deve retornar um objeto vazio se nenhuma variável for requerida", () => {
    const result = EnvValidator.validate([]);
    expect(result).toEqual({});
  });
});
