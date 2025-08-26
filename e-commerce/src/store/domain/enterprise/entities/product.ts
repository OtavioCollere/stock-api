import { Entity } from "@/store/core/entities/entity"
import type { UniqueEntityID } from "@/store/core/entities/unique-entity-id"
import type { Optional } from "@prisma/client/runtime/library"

export interface ProductProps{
  categoryId : UniqueEntityID
  createdByUserId : UniqueEntityID
  updatedByUserId? : UniqueEntityID
  name : string
  slug : string
  productCode? : string
  description? : string
  quantity : number
  currentPrice : number
  status : 'active' | 'archived'
  createdAt? : Date
  updatedAt? : Date
}


export class Product extends Entity<ProductProps> {

  static create(props : Optional<ProductProps, 'slug' | 'createdAt' | 'updatedAt' | 'description' | 'updatedByUserId' | 'status' | 'productCode'>, id? :UniqueEntityID) {
    const product = new Product({
      createdAt : new Date(),
      status : 'active',
      slug : Product.createSlug(props.name),
      ...props
      },id)

      return product
  }

  public static createSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize("NFD") // separa acentos
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
      .replace(/[^a-z0-9]+/g, "-") // troca não-alfanuméricos por "-"
      .replace(/^-+|-+$/g, "") // remove "-" do início/fim
  }
  

  // ===================
  // Getters
  // ===================
  get slug(){
    return this.props.slug
  }
  
  get categoryId() {
    return this.props.categoryId
  }
  
  set categoryId(value : UniqueEntityID) {
    this.props.categoryId = value
    this.touch()
  }

  get createdByUserId() {
    return this.props.createdByUserId
  }

  get updatedByUserId() {
    return this.props.updatedByUserId
  }

  get name() {
    return this.props.name
  }

  get productCode() {
    return this.props.productCode
  }

  get description() {
    return this.props.description ?? "Sem descrição";
  }

  get quantity() {
    return this.props.quantity
  }

  get currentPrice() {
    return this.props.currentPrice
  }

  get status() {
    return this.props.status
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  // ===================
  // Setters com regras
  // ===================
  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  set quantity(quantity: number) {
    this.props.quantity = quantity
    this.touch()
  }

  set currentPrice(price: number) {
    this.props.currentPrice = price
    this.touch()
  }

  set description(description: string) {
    this.props.description = description
    this.touch()
  }

  set productCode(value) {
    this.props.productCode = value;
    this.touch();
  }

  archive(userId: UniqueEntityID) {
    this.props.status = 'archived'
    this.touch()
  }

  public activate(userId: UniqueEntityID) {
    this.props.status = 'active'
    this.props.updatedByUserId = userId
    this.touch()
  }

  // ===================
  // Private helper
  // ===================
  private touch() {
    this.props.updatedAt = new Date()
  }
}