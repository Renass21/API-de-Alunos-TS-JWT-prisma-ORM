import { Request, Response } from "express";
import { errorBadRequest, errorNotFound, serverError } from "../util/response.helper";
import repository from "../database/prisma.repository";
import { Avaliacao } from "../models/avaliacao.models";
import { adaptAlunoPrisma } from "../util/aluno.adapter";

export class AvaliacaoController {
    
    
    public async criarAvaliacao(req: Request, res: Response) {
        try {
            //entrada
                const { id } = req.params;
                const { disciplina, nota } = req.body;
                const {authorization } = req.headers;

            if(!disciplina || !nota){
                return errorBadRequest(res);
            } 
           
            //verifica se o token foi autorizado
            if (!authorization) {
                return res.status(401).send({
                    ok: false,
                    message:"Token unauthorized"
                });
            }
            //processamento

            //Verificar se o aluno existe, se não 404
            const aluno = await repository.aluno.findUnique({
                where: {
                    id,
                }
            });
            
            if (!aluno){
                return errorNotFound(res, "Aluno");
            };
            
            //verifica se o token é valido
            if (aluno.token !== authorization) {
                return res.status(401).send({
                    ok: false,
                    message: "Token invalid!"
                })
            };
            
            // Adapt do aluno (Prisma) para o (backEnd)
            const alunoBackEnd = adaptAlunoPrisma(aluno);

            //Criar o model backend da avaliação
            const avaliação = new Avaliacao(disciplina, nota, alunoBackEnd);
            
            //Salvar no banco de dados
            const result  = await repository.avaliacao.create({
                data: {
                    id: avaliação.id,
                    disciplina: avaliação.disciplina,
                    nota: avaliação.nota,
                    idAluno: aluno.id,
                },
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
    
    //Listar as avaliações de um aluno especifico
    public async listarAvaliacoes(req: Request, res: Response) {
        try {
            //1-entrada
            const { id } = req.params;
            //2-processamento
            const aluno = await repository.aluno.findUnique({
                where: {
                    id,
                },
                include: {
                    avaliacoes: true,
                },
            })
            if(!aluno){
                return errorNotFound(res, "Aluno");
            }
            // 3- Saída
            return res.status(200).send({
                ok: true,
                message: "Avaliações listadas com sucesso",
                data: aluno.avaliacoes,
            });
        } catch (error: any) {
            return serverError(res, error);
        }
    }

    public async atualizarAvaliacao(req: Request, res: Response) {
        try {
            // 1- Entrada
            const { id, idAvaliacao } = req.params;
            const { nota } = req.body;

            if (!nota) {
                return errorBadRequest(res);
            }

            // 2- Processamento
            // verificar se o aluno existe, se não 404
            const aluno = await repository.aluno.findUnique({
                where: {
                    id,
                },
            });

            if (!aluno) {
                return errorNotFound(res, "Aluno");
            }

            // verificar se a avaliacao existe, se não 404
            const avaliacao = await repository.avaliacao.findUnique({
                where: {
                    id: idAvaliacao,
                },
            });

            if (!avaliacao) {
                return errorNotFound(res, "Avaliação");
            }

            // atualizar a avaliacao
            const result = await repository.avaliacao.update({
                where: {
                    id: idAvaliacao,
                },
                data: {
                    nota,
                },
            });

            // 3- Saída
            return res.status(200).send({
                ok: true,
                message: "Avaliação atualizada com sucesso",
                data: result,
            });
        }catch (error: any) {
            return serverError(res, error);
        }
    }
}    