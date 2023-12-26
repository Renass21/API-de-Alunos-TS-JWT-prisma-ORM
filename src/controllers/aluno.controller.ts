import { Request, Response } from "express";
import { Aluno } from "../models/aluno.model";
import repository from "../database/prisma.repository";
import { ok } from "assert";

export class AlunoController {
    //Criar um novo aluno
    public async criarAluno(req: Request, res: Response) {
        try {
                //entrada
            const { nome, email, senha, idade } = req.body;

            if(!nome || !email || !senha) {
                return res.status(400).send({
                    ok: false,
                    message: "Os campos obrigatórios não foram informados"
                });
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
            return res.status(500).send({ 
                ok: false,
                message: error.toString()
            });
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
                    id //Where id = id
                },
                select: {
                   id: true,
                   nome: true,
                   email: true,
                },
            })

            if(!aluno) {
                return res.status(404).send({
                    ok: false,
                    message: "Usuario não encontrado",
                    
                })
            }
            //3- Saida
            return res.status(200).send({
                ok: true,
                message: "Usuario obtido com successo",
                data: aluno,
            });

        } catch (error: any){
            return res.status(500).send({
                ok: false,
                message: error.toString()
            });
        }
    }


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
               return res.status(404).send({
                    ok: false,
                    message: "Aluno não encontrado"
                });    
            }
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
            return res.status(500).send({
                ok: false,
                message: error.toString()
            }); 
        }
    }

}