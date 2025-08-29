
export class ProductMustBeActiveError extends Error{
  constructor(){
    super("Product must be active to perform this action.")
  }
}