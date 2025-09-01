
export class InsufficientStockError extends Error{
  constructor(){
    super("Product has insufficient stock for this operation.")
  }
}