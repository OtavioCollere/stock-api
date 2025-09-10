import { OnStockDecreased } from "@/store/domain/application/subscribers/on-stock-decreased";
import { OnStockIncresead } from "@/store/domain/application/subscribers/on-stock-increased";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports : [DatabaseModule],
  providers : [
    OnStockDecreased,
    OnStockIncresead
  ]
})
export class EventsModule{}