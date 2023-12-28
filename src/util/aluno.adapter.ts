import { Aluno } from "@prisma/client";
import { Aluno as AlunoBackEnd } from '../models/aluno.model' 
export function adaptAlunoPrisma(aluno: Aluno): AlunoBackEnd {
    const novoAluno = new AlunoBackEnd( 
        aluno.nome, 
         aluno.email, 
         aluno.senha, 
         aluno.idade ?? undefined
        );
        novoAluno.id = aluno.id;
        
        return novoAluno;
}