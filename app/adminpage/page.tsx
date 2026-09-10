'use client'

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    BadgeCheckIcon,
    ChevronRightIcon,
    Plus,
    UserCheck,
    ShieldAlert,
    Trash2,
    Edit3,
    Loader2,
    ArrowLeft
} from "lucide-react";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { verifyAdmin } from "@/actions/verify-admin";
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    admin: string; // 'true' | 'false'
}

const AdminPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [authLoading, setAuthLoading] = useState<boolean>(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("all");

    // Modais e Formulários
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        admin: false,
    });

    // 1. Verificação unificada de Autenticação e Perfil de Admin
    useEffect(() => {
        const checkAuthAndAdmin = async () => {
            if (status === 'loading') return;

            if (status === 'unauthenticated' || !session?.user?.email) {
                router.push('/login');
                return;
            }

            try {
                const res = await verifyAdmin(session.user.email);
                if (res === 'true') {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error("Erro ao verificar permissões de admin:", error);
                setIsAdmin(false);
            } finally {
                setAuthLoading(false);
            }
        };

        checkAuthAndAdmin();
    }, [session, status, router]);

    // 2. Busca a lista de usuários apenas se for admin confirmado
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/users');
            setUsers(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar usuários.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
        }
    }, [isAdmin, fetchUsers]);

    // Modal Handlers
    const handleOpenCreate = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', password: '', admin: false });
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            admin: user.admin === 'true',
        });
        setIsDialogOpen(true);
    };

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await axios.put('/api/users', {
                    id: editingUser.id,
                    ...formData,
                });
                toast.success("Usuário atualizado com sucesso!");
            } else {
                if (!formData.password) {
                    toast.error("A senha é obrigatória para novos usuários.");
                    return;
                }
                await axios.post('/api/users', formData);
                toast.success("Usuário criado com sucesso!");
            }

            setIsDialogOpen(false);
            fetchUsers();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.error || "Erro ao salvar usuário.");
        }
    };

    const handleDeleteUser = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja remover o usuário ${name}?`)) return;

        try {
            await axios.delete(`/api/users?id=${id}`);
            toast.success("Usuário removido com sucesso!");
            fetchUsers();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao remover usuário.");
        }
    };

    const handleToggleAdmin = async (user: User) => {
        const isCurrentlyAdmin = user.admin === 'true';
        try {
            await axios.put('/api/users', {
                id: user.id,
                admin: !isCurrentlyAdmin,
            });
            toast.success(`Permissão de ${user.name} alterada com sucesso!`);
            fetchUsers();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao alterar privilégio.");
        }
    };

    const filteredUsers = users.filter((user) => {
        if (activeTab === "admins") return user.admin === 'true';
        if (activeTab === "users") return user.admin !== 'true';
        return true;
    });

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    // Tela de Carregamento Inicial
    if (status === 'loading' || authLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p className="text-muted-foreground">Verificando permissões de acesso...</p>
            </div>
        );
    }

    // Caso o usuário esteja logado mas não seja Admin
    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center p-4 gap-4">
                <h1 className="text-3xl font-bold">Acesso Negado</h1>
                <p className="text-lg text-muted-foreground">
                    Você não tem permissão para acessar esta página.
                </p>
                <Button variant="outline" onClick={() => router.push('/')} className="flex items-center gap-2">
                    <ArrowLeft size={16} /> Voltar ao Início
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full p-4 md:p-8">
            <Card className="w-full shadow-sm border">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.push('/')}
                            title="Voltar para a Tela Inicial"
                        >
                            <ArrowLeft size={18} />
                        </Button>
                        <div>
                            <CardTitle className="text-2xl font-bold tracking-tight">
                                Gerenciamento de Usuários
                            </CardTitle>
                            <CardDescription>
                                Crie, edite, exclua e promova administradores do sistema.
                            </CardDescription>
                        </div>
                    </div>

                    <Button onClick={handleOpenCreate} className="flex items-center gap-2 w-full sm:w-auto justify-center">
                        <Plus size={16} /> Novo Usuário
                    </Button>
                </CardHeader>

                <CardContent className="pt-6">
                    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="flex items-center justify-between pb-4">
                            <TabsList className="grid w-full sm:w-auto grid-cols-3">
                                <TabsTrigger value="all">
                                    Todos ({users.length})
                                </TabsTrigger>
                                <TabsTrigger value="admins">
                                    Admins ({users.filter(u => u.admin === 'true').length})
                                </TabsTrigger>
                                <TabsTrigger value="users">
                                    Comuns ({users.filter(u => u.admin !== 'true').length})
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <Separator className="my-2" />

                        <TabsContent value={activeTab} className="mt-4">
                            {loading ? (
                                <div className="flex justify-center items-center py-12 text-muted-foreground">
                                    <Loader2 className="animate-spin mr-2" size={20} />
                                    Carregando usuários...
                                </div>
                            ) : filteredUsers.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    Nenhum usuário encontrado nesta categoria.
                                </div>
                            ) : (
                                <ScrollArea className="h-[500px] pr-4">
                                    <div className="flex flex-col gap-3">
                                        {filteredUsers.map((user) => {
                                            const isUserAdmin = user.admin === 'true';

                                            return (
                                                <Item key={user.id} className="border rounded-lg p-3 hover:bg-muted/40 transition-colors">
                                                    <ItemMedia>
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                                                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                        </Avatar>
                                                    </ItemMedia>

                                                    <ItemContent className="ml-2">
                                                        <ItemTitle className="flex items-center gap-2 font-semibold">
                                                            {user.name}
                                                            {isUserAdmin && (
                                                                <span className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium border border-blue-200">
                                                                    <BadgeCheckIcon size={14} className="mr-1" /> Admin
                                                                </span>
                                                            )}
                                                        </ItemTitle>
                                                        <ItemDescription className="text-sm text-muted-foreground">
                                                            {user.email}
                                                        </ItemDescription>
                                                    </ItemContent>

                                                    <ItemActions className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title={isUserAdmin ? "Revogar Admin" : "Promover a Admin"}
                                                            onClick={() => handleToggleAdmin(user)}
                                                            className={isUserAdmin ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50" : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"}
                                                        >
                                                            {isUserAdmin ? <ShieldAlert size={18} /> : <UserCheck size={18} />}
                                                        </Button>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Editar Usuário"
                                                            onClick={() => handleOpenEdit(user)}
                                                        >
                                                            <Edit3 size={18} />
                                                        </Button>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Excluir Usuário"
                                                            className="text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDeleteUser(user.id, user.name)}
                                                        >
                                                            <Trash2 size={18} />
                                                        </Button>

                                                        <ChevronRightIcon size={16} className="text-muted-foreground ml-1" />
                                                    </ItemActions>
                                                </Item>
                                            );
                                        })}
                                    </div>
                                </ScrollArea>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Modal para Criação / Edição de Usuário */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
                        <DialogDescription>
                            {editingUser
                                ? 'Atualize as informações do usuário. Deixe a senha em branco se não quiser alterá-la.'
                                : 'Preencha os dados abaixo para cadastrar um novo usuário no sistema.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveUser} className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="João Silva"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="joao@empresa.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Senha {editingUser && '(Opcional)'}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                required={!editingUser}
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="admin"
                                checked={formData.admin}
                                onChange={(e) => setFormData({ ...formData, admin: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                            />
                            <Label htmlFor="admin" className="cursor-pointer font-medium">
                                Conceder privilégios de Administrador
                            </Label>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit">
                                {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminPage;