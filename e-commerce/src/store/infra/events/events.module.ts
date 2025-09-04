import { OnStockDecresead } from "@/store/domain/application/subscribers/on-stock-decreased";
import { OnStockIncresead } from "@/store/domain/application/subscribers/on-stock-increased";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports : [DatabaseModule],
  providers : [
    OnStockDecresead,
    OnStockIncresead
  ]
})
export class EventsModule{}