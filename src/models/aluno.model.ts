import { randomUUID } from "crypto";

export class Aluno {
    public id: string;
    

    constructor( 
            public nome: string,
            public email: string,
            public senha: string,
            public idade?: number,
        ) {
            this.id = randomUUID();
        }
}

const Renato = new Aluno(
    "Renato","renato@gmail.com", "1236654", 32
    );

const Joao = new Aluno(
    "João","jao@gmail.com", "123456", 36
    );
    
const Rodrigo = new Aluno(
    "Rodrigo", "rodrigo@gmail.com", "333345", 35
    );