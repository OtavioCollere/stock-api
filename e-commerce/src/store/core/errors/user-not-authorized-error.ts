
export class UserNotAuthorizedError extends Error{
  constructor(){
    super("For active the product, user must be a admin or the creator of the product.")
  }
}