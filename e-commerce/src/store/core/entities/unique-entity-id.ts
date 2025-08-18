import { randomUUID } from "node:crypto"

export class UniqueEntityID{
  private id : string

  constructor(value? : string){
    this.id = value ?? randomUUID()
  }

  toString() {
    return this.id
  }

  toValue() {
    return this.id
  }
}