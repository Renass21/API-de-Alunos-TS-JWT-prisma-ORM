import { Request, Response } from "express";
import { Aluno } from "../models/aluno.model";
import repository from "../database/prisma.repository";
import { ok } from "assert";
import { errorBadRequest, errorNotFound, serverError } from "../util/response.helper";

export class AlunoController {
    //Criar um novo aluno
    public async criarAluno(req: Request, res: Response) {
        try {
                //entrada
            const { nome, email, senha, idade } = req.body;

            if(!nome || !email || !senha) {
                return errorBadRequest(res);
            }
            //Processamento
            const aluno = new Aluno(nome, email, senha, idade);

            const result = await repository.aluno.create({
                data: aluno,
            });

            //saida
            return res.status(201).send({
                ok: true,
                message: "Usuario criado com sucesso",
                data: result,
            });
       } catch(error: any){
            return serverError(res, error);
       }
    }  
    //Obter um aluno pelo ID    
    public async obterAluno(req: Request, res: Response) {
        try {
            //1- Entrada 
            const { id } = req.params;
            
            //2- Processamento
            const aluno = await repository.aluno.findUnique({
                where: {
                    id,
                },
            });

            if(!aluno) {
                return errorNotFound(res, "Aluno");
            }

            //3- Saida
            return res.status(200).send({
                ok: true,
                message: "Usuario obtido com successo",
                data: aluno,
            });
        } catch (error: any){
            return serverError(res, error);
        }
    }
    public async listarAlunos(req: Request, res: Response) {
        try {
            //entrada
            const { Aluno } = req.params;
            //processamento
            const listaDeAlunos = await repository.aluno.findMany()
            
            if(!listaDeAlunos) {
                return errorNotFound(res, "Alunos");
            }; 
            //Saida 
            return res.status(200).send({
                ok: true,
                message: "Alunos listados com sucesso",
                data: listaDeAlunos,
            })

        } catch (error: any) {
            return serverError(res, error);
        }
    }
    //Atualizar aluno
    public async atualizarAluno(req: Request, res: Response) {
        try {
            //Entrada 
            const { id } = req.params;
            const { nome, senha, idade } = req.body;
            
            if (!nome && !senha && !idade) {
                return errorBadRequest(res);    
            }
            // Processamento
            // Verificar se o aluno existe, se não 404
            const aluno = await repository.aluno.findUnique({
                where: {
                    id
                }
            });
            if(!aluno) {
                return errorNotFound(res, "Aluno");
            }
            //Atualizar os dados do aluno
            const result = await repository.aluno.update({
                where: {
                    id
                },
                 data: {
                    nome,
                    idade,
                    senha,
                },
            });
            
            // Saida
             return res.status(200).send({
                ok: true,
                message: "Aluno editado com sucesso",
                data: result,
             });   

        } catch (error: any) {
            return serverError(res, error);
        }
    }
    //Deletar Aluno
    public async deletarAluno(req: Request, res: Response) {
        try {
            //entrada
            const { id } = req.params;
            //processamento
            // verificar se o aluno existe, se não 404
            const aluno = await repository.aluno.findUnique({
                where: {
                    id,
                }
            });

            if(!aluno) {
               return errorNotFound(res, "Aluno");    
            };
            
            //deletar aluno
            await repository.aluno.delete({
                where: {
                    id,
                }    
            });
            //saida
            return res.status(200).send({
                ok: true,
                message: "Aluno deletado com sucesso"
            });
        } catch (error: any) {
            return serverError(res, error); 
        }
    }

}