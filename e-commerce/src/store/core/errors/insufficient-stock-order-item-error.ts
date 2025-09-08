
export class InsufficientStockForOrderItemError extends Error{
  constructor(productId : string, quantity : number){
    super(`Product has insufficient stock for this operation. Product ID ${productId}, quantity : ${quantity} is not available`)
  }
}