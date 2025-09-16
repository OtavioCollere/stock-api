import { OnStockDecreased } from "@/store/domain/application/subscribers/on-stock-decreased";
import { OnStockIncresead } from "@/store/domain/application/subscribers/on-stock-increased";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { OnOrderRegistered } from "@/store/domain/application/subscribers/on-order-registered";

@Module({
  imports : [DatabaseModule],
  providers : [
    OnOrderRegistered,
    OnStockDecreased,
    OnStockIncresead
  ]
})
export class EventsModule{}