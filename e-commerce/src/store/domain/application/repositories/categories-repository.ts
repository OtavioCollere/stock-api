import { Injectable } from "@nestjs/common";
import { Category } from "../../enterprise/entities/category";

@Injectable()
export abstract class CategoriesRepository{
  abstract findById(id : string) : Promise<Category | null>
}