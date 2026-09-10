import { NextResponse } from 'next/server';
import { db } from "@/lib/prismadb";
const bcrypt = require('bcrypt');

// GET: Listar usuários (com opção de filtrar por tipo/admin)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const filter = searchParams.get('filter'); // ex: 'admin' ou 'user'

        let whereClause = {};
        if (filter === 'admin') {
            whereClause = { admin: 'true' }; // Ou 'ADMIN' dependendo de como você salva essa string
        } else if (filter === 'user') {
            whereClause = { admin: 'false' };
        }

        const users = await db.users.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                email: true,
                admin: true,
                // password é omitido por segurança
            },
            orderBy: { name: 'asc' },
        });

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
    }
}

// POST: Criar novo usuário
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, admin } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 });
        }

        const existingUser = await db.users.findFirst({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
                admin: admin ? 'true' : 'false',
            },
            select: {
                id: true,
                name: true,
                email: true,
                admin: true,
            },
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 });
    }
}

// PUT: Atualizar usuário existente
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, name, email, password, admin } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID do usuário é obrigatório' }, { status: 400 });
        }

        const updateData: { name?: string; email?: string; admin?: string; password?: string } = {};

        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (admin !== undefined) updateData.admin = admin ? 'true' : 'false';
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await db.users.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                admin: true,
            },
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
    }
}

// DELETE: Excluir usuário por ID
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID é obrigatório para exclusão' }, { status: 400 });
        }

        await db.users.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Usuário deletado com sucesso' }, { status: 200 });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        return NextResponse.json({ error: 'Erro ao deletar usuário' }, { status: 500 });
    }
}