import { CpfValidator } from "@/store/domain/application/gateways/cpf-validator";
import { Injectable } from "@nestjs/common";
import axios  from 'axios'
import { EnvService } from "../env/env.service";

@Injectable()
export class HttpCpfValidator implements CpfValidator{
  
  constructor(
    private envService : EnvService 
  ) {}  

  async verifyCPF(cpf: string): Promise<boolean> {
    const apiURL = this.envService.get('API_CPF_URL');
    const apiToken = this.envService.get('API_TOKEN_CPF');

    const {data} = await axios.get(`${apiURL}/?token=${apiToken}&value=${cpf}&type=cpf`)
    return data.valid === true;
  }
  
}