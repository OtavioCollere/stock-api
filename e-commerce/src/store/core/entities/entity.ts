import { UniqueEntityID } from "./unique-entity-id";

export class Entity<EntityProps>{
  private _id : UniqueEntityID
  protected props : EntityProps

  constructor(props: EntityProps, id?: UniqueEntityID){
    this.props = props;
    this._id = id ?? new UniqueEntityID();
  }

  get id(){
    return this._id
  }

}