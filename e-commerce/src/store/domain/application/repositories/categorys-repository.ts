
export abstract class CategorysRepository{
  abstract findById(id : string) : Promise<void | 'oi'>
}