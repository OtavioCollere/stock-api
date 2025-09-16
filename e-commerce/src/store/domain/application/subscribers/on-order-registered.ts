import { DomainEvents } from "@/store/core/events/domain-events";
import { EventHandler } from "@/store/core/events/event-handler";
import { ClientKafka } from "@nestjs/microservices";
import { OrderRegisteredEvent } from "../../enterprise/events/order-registered.event";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnOrderRegistered implements EventHandler{

  constructor(
    private kafkaClient : ClientKafka
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.handleOrderRegistered.bind(this),
      OrderRegisteredEvent.name
    )
  }

  async onModuleInit(){
    await this.kafkaClient.connect()
  }

  private async handleOrderRegistered(event : OrderRegisteredEvent){
    const payload = {
      orderId : event.orderId,
      amount : event.amount,
      currency : event.currency
    }

    await this.kafkaClient.emit("order.registered", payload)
    console.log("Evento order.registered enviado para Kafka:", payload);
  }

}