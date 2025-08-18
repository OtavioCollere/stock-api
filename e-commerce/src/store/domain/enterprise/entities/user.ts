import { Entity } from "@/store/core/entities/entity"
import type { UniqueEntityID } from "@/store/core/entities/unique-entity-id"
import type { Optional } from "@/store/core/types/optional"


export interface UserProps {
  name: string
  cpf: string
  email: string
  password: string
  role: 'admin' | 'customer' | 'seller'
  phone: string
  birthDate: Date
  emailVerified: boolean
  createdAt: Date
  updatedAt?: Date
}

export class User extends Entity<UserProps> {

  static create(props : Optional<UserProps, 'createdAt' | 'updatedAt' | 'emailVerified'>, id? : UniqueEntityID) {
    
    const user = new User({
      ...props,
      emailVerified : false,
      createdAt : new Date(),
    }, 
    id)

    return user;
  }

  // ---------- GETTERS ----------
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get role() {
    return this.props.role
  }

  get phone() {
    return this.props.phone
  }

  get birthDate() {
    return this.props.birthDate
  }

  get emailVerified() {
    return this.props.emailVerified
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  // ---------- SETTERS COM TOUCH ----------
  set name(value: string) {
    this.props.name = value
    this.touch()
  }

  set email(value: string) {
    this.props.email = value
    this.touch()
  }

  set password(value: string) {
    this.props.password = value
    this.touch()
  }

  set role(value: 'admin' | 'customer' | 'seller') {
    this.props.role = value
    this.touch()
  }

  set phone(value: string) {
    this.props.phone = value
    this.touch()
  }

  set birthDate(value: Date) {
    this.props.birthDate = value
    this.touch()
  }

  set emailVerified(value: boolean) {
    this.props.emailVerified = value
    this.touch()
  }

  // ---------- TOUCH ----------
  private touch() {
    this.props.updatedAt = new Date()
  }
}
