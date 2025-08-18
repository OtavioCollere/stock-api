import { UniqueEntityID } from "./unique-entity-id";

export class Entity<EntityProps>{
  private _id : UniqueEntityID
  protected props : EntityProps

  constructor(props: EntityProps, id?: string){
    this.props = props;
    this._id = new UniqueEntityID(id)
  }

}