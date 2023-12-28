import { Request, Response } from "express";
import { errorBadRequest, serverError } from "../util/response.helper";
import repository from "../database/prisma.repository";
import { Avaliacao } from "../models/avaliacao.models";
import { adaptAlunoPrisma } from "../util/aluno.adapter";

export class AvaliacaoController {
    
    
    public async criarAvaliacao(req: Request, res: Response) {
        try {
            //entrada
                const { id } = req.params;
                const { disciplina, nota } = req.body;
            
            if(!disciplina || !nota){
                return errorBadRequest(res);
            }    
            //processamento
            //Verificar se o aluno existe, se não 404
            const aluno = await repository.aluno.findUnique({
                where: {
                    id
                }
            });
            
            if(!aluno){
                return errorBadRequest(res);
            };
            // Adapt do aluno (Prisma) para o (backEnd)
            const AlunoBackEnd = adaptAlunoPrisma(aluno);

            //Criar o model backend da avaliação
            const avaliação = new Avaliacao(disciplina, nota, AlunoBackEnd);
            //Salvar no banco de dados
            const result  = await repository.avaliacao.create({
                data: {
                    id: avaliação.id,
                    disciplina: avaliação.disciplina,
                    nota: avaliação.nota,
                    idAluno: aluno.id

                }
            });
            //saida
            return res.status(201).send({
                ok: true,
                message: "Avaliação criada com sucesso!",
                data: result
            });

        } catch (error: any) {
            return serverError(res, error);
        }
    }
}