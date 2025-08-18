
export class CpfIsNotValidError extends Error{
  constructor(){
    super("CPF is not valid")
  }
}