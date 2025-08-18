
export abstract class Encrypter{
  abstract sign(payload : Record<string, unknown>) : Promise<string>
}