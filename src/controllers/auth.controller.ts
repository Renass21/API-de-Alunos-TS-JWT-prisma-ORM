import { Request, Response } from "express";
import { errorBadRequest, serverError } from "../util/response.helper";
import repository from "../database/prisma.repository";
import { randomUUID } from "crypto";

export class AuthController {
    
    public async login(req: Request, res: Response) {
        try {
            //Entrada
            const { email, senha} = req.body;

            if (!email || !senha) {
                return errorBadRequest(res);
            }
            //Processamento
            const aluno = await repository.aluno.findFirst({
                where: {
                    email,
                    senha
                },
                select: {
                    id: true,
                    nome: true,
                },
            })

            if (!aluno) {
                return res.status(401).send({
                    ok: false,
                    message: "User unauthorized!"
                })
            }
            //gerar a credencial de acesso ao usuario
            const token = randomUUID();

            //salvar token na tabela do aluno
            await repository.aluno.update({
                where: {
                    id: aluno.id,
                },
                data: {
                    token
                },
            });

            //Saida
            return res.status(200).send({
                ok: true,
                message: "Login sucess!",
                data: {
                    id: aluno.id,
                    nome: aluno.nome,
                    token
                    },
            });
        
        } catch (error) {
            return serverError(res, error)
        }
    }
}