'use client'

import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';

import { verifyAdmin } from "@/actions/verify-admin";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { BookOpen, Plus, Layers, DoorOpen, ExternalLink, Cpu, ListFilter, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Book {
    id: string;
    ordemFabricacao: string;
    modulosCount?: number;
}

const GestaoBooksPage = () => {

    const router = useRouter();
    const { data: session } = useSession();
    const [admin, setAdmin] = useState(false);

    // Lista de Books criados
    const [books, setBooks] = useState<Book[]>([]);

    // Formulário e controle de estado do Modal
    const [ordemFabricacao, setOrdemFabricacao] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    if (!session) {
        redirect("/login");
    }

    const AdminOrNot = async () => {
        const res = await verifyAdmin(session?.user?.email);
        if (res === 'true') {
            setAdmin(true);
        }
    }

    useEffect(() => {
        AdminOrNot();
        fetchBooks();
    }, [session]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const responseBooks = await axios.get('/api/books/eurocard');
            const dadosBooks = responseBooks.data;

            if (Array.isArray(dadosBooks)) {
                setBooks(dadosBooks);
            } else if (dadosBooks && Array.isArray(dadosBooks.books)) {
                setBooks(dadosBooks.books);
            } else {
                setBooks([]);
            }
        } catch (error) {
            console.error("Erro ao carregar a lista de books:", error);
            toast.error("Erro ao carregar a lista de books.");
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    // Cria o Book com a Ordem de Fabricação via Modal
    const handleCreateBook = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!ordemFabricacao.trim()) {
            toast.error("Informe a Ordem de Fabricação.");
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                ordemFabricacao: ordemFabricacao.trim().toUpperCase(),
            };

            await axios.post('/api/books/eurocard', payload);

            toast.success(`Book da OF ${ordemFabricacao} criado com sucesso!`);

            setOrdemFabricacao('');
            setIsDialogOpen(false);
            fetchBooks();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao criar o Book.");
        } finally {
            setSubmitting(false);
        }
    };

    // Exclui a OF cadastrada
    const handleDeleteBook = async (e: React.MouseEvent, bookId: string, ofName: string) => {
        e.stopPropagation(); // Evita abrir a página da OF ao clicar em deletar

        const confirmDelete = window.confirm(`Tem certeza que deseja excluir a OF: ${ofName}?`);
        if (!confirmDelete) return;

        try {
            setDeletingId(bookId);
            await axios.delete(`/api/books/eurocard?id=${bookId}`);

            toast.success(`OF ${ofName} excluída com sucesso!`);
            // Atualiza a lista local filtrando o item removido
            setBooks((prev) => prev.filter((b) => b.id !== bookId));
        } catch (error) {
            console.error("Erro ao excluir o Book:", error);
            toast.error("Erro ao excluir a Ordem de Fabricação.");
        } finally {
            setDeletingId(null);
        }
    };

    // Redireciona para o formulário de cadastro com a OF preenchida na URL
    const handleOpenBookForm = (of: string) => {
        router.push(`/eurocard?of=${encodeURIComponent(of)}`);
    };

    // Redireciona para a tela de listagem de módulos filtrada por OF
    const handleViewModulos = (e: React.MouseEvent, of: string) => {
        e.stopPropagation(); // Evita acionar o click do card inteiro
        router.push(`/eurocard/list?of=${encodeURIComponent(of)}`);
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8 mb-12">
            {/* HeadBar / Cabeçalho */}
            <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <BookOpen className="text-primary" /> Ordens de fabricação (OF)
                    </h1>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    {/* Botão para Abrir o Modal de Criar Book */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus size={18} /> Nova Ordem de Fabricação
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-foreground">
                                    <Plus size={20} className="text-primary" /> Nova Ordem de Fabricação
                                </DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleCreateBook} className="space-y-4 pt-2">
                                <div>
                                    <Label htmlFor="of" className="font-semibold text-foreground">
                                        Número da Ordem de Fabricação (OF)
                                    </Label>
                                    <Input
                                        id="of"
                                        value={ordemFabricacao}
                                        onChange={(e) => setOrdemFabricacao(e.target.value)}
                                        placeholder="Ex: 06307601001"
                                        className="mt-2 uppercase tracking-wider font-semibold text-lg"
                                        disabled={submitting}
                                        autoFocus
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-4 border-t border-border">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                        disabled={submitting}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Criando...' : 'Criar Book por OF'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Link href="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors ml-2">
                        <DoorOpen size={24} /> Sair
                    </Link>
                </div>
            </header>

            {/* BODY DA PÁGINA */}
            <main className="w-full max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-2">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Layers size={20} className="text-muted-foreground" /> Ordens de Fabricação (OF) Cadastradas
                    </h2>
                    <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
                        Total: {books.length}
                    </span>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-sm text-muted-foreground">Carregando ordens de fabricação...</p>
                    </div>
                ) : !Array.isArray(books) || books.length === 0 ? (
                    <Card className="border-dashed p-12 text-center text-muted-foreground max-w-lg mx-auto">
                        <p className="mb-4">Nenhuma ordem de fabricação cadastrada.</p>
                        <Button
                            onClick={() => setIsDialogOpen(true)}
                            variant="outline"
                        >
                            <Plus size={16} className="mr-2" /> Criar Ordem de Fabricação
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {books.map((book) => {
                            const qtdModulos = book.modulosCount ?? 0;
                            const isDeleting = deletingId === book.id;

                            return (
                                <Card
                                    key={book.id}
                                    onClick={() => handleOpenBookForm(book.ordemFabricacao)}
                                    className="cursor-pointer hover:border-primary hover:shadow-md transition-all group relative overflow-hidden flex flex-col justify-between"
                                >
                                    <CardHeader className="bg-muted/50 border-b border-border py-3">
                                        <CardTitle className="text-base font-bold text-foreground group-hover:text-primary flex justify-between items-center transition-colors">
                                            <span className="flex items-center gap-2">
                                                <BookOpen size={18} className="text-primary" />
                                                OF: {book.ordemFabricacao}
                                            </span>

                                            {/* Botão Excluir */}
                                            {admin.valueOf() == true ?
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                    title="Excluir OF"
                                                    disabled={isDeleting}
                                                    onClick={(e) => handleDeleteBook(e, book.id, book.ordemFabricacao)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                                : <div className=""></div>
                                            }
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="p-4 space-y-4">
                                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground bg-muted p-2.5 rounded-md border border-border">
                                            <span className="flex items-center gap-1.5 text-foreground">
                                                <Cpu size={15} className="text-primary" />
                                                Módulos Cadastrados:
                                            </span>
                                            <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-0.5 rounded-full">
                                                {qtdModulos} {qtdModulos === 1 ? 'módulo' : 'módulos'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="secondary"
                                                onClick={(e) => handleViewModulos(e, book.ordemFabricacao)}
                                                className="text-xs flex items-center gap-1"
                                            >
                                                <ListFilter size={14} /> Ver Módulos
                                            </Button>

                                            <span className="text-xs text-primary font-semibold group-hover:underline flex items-center gap-1">
                                                Novo Módulo <ExternalLink size={14} />
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default GestaoBooksPage;