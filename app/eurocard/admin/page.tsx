'use client'

import { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Loader2, Database, Trash2, ArrowLeft, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminEurocard() {
    const [quantidade, setQuantidade] = useState<number>(10);
    const [loadingGerar, setLoadingGerar] = useState(false);
    const [loadingLimpar, setLoadingLimpar] = useState(false);

    // Função para chamar o POST (Gerar em massa)
    const handleGerarModulos = async () => {
        if (quantidade <= 0 || quantidade > 500) {
            toast.error("Por favor, informe uma quantidade entre 1 e 500.");
            return;
        }

        setLoadingGerar(true);
        try {
            const response = await axios.post('/api/register/eurocard/bulk', { quantidade });
            toast.success(response.data.message || `${quantidade} módulos criados com sucesso!`);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao gerar módulos em massa.");
        } finally {
            setLoadingGerar(false);
        }
    };

    // Função para chamar o DELETE (Limpar tudo)
    const handleLimparBanco = async () => {
        const confirmadoPrimeiravez = window.confirm(
            "ATENÇÃO: Você tem certeza de que deseja apagar TODOS os módulos do banco de dados? Esta ação é irreversível!"
        );

        if (!confirmadoPrimeiravez) return;

        const confirmadoSegundavez = window.confirm(
            "CONFIRMAÇÃO FINAL: Tem certeza absoluta? Todos os dados salvos serão perdidos para sempre."
        );

        if (!confirmadoSegundavez) return;

        setLoadingLimpar(true);
        try {
            const response = await axios.delete('/api/register/eurocard/bulk');
            toast.success(response.data.message || "Banco de dados limpo com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao limpar o banco de dados.");
        } finally {
            setLoadingLimpar(false);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto p-4 md:p-8 mt-10">

            {/* Botão Voltar */}
            <div className="mb-6">
                <Link href="/eurocard" className="inline-flex items-center gap-2 text-sm  hover:text-zinc-300 transition-colors">
                    <ArrowLeft size={16} /> Voltar para a listagem
                </Link>
            </div>

            <div className=" border border-zinc-200 rounded-xl p-6 shadow-sm space-y-8">
                <div>
                    <h1 className="text-xl font-bold  flex items-center gap-2">
                        <Database className="h-5 w-5 " />
                        Gerenciamento de Dados (Eurocard)
                    </h1>
                </div>

                <hr className="border-zinc-100" />

                {/* Seção 1: Criar em massa */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold">
                        Gerar módulos automaticamente
                    </label>
                    <p className="text-xs ">
                        Insira a quantidade de cartões Eurocard fictícios que deseja injetar na sequência numérica atual.
                    </p>
                    <div className="flex gap-3 mt-2">
                        <input
                            type="number"
                            min={1}
                            max={600}
                            value={quantidade}
                            onChange={(e) => setQuantidade(parseInt(e.target.value) || 0)}
                            className="w-32 px-3 py-2 border border-zinc-300 rounded-md text-sm  focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                            disabled={loadingGerar || loadingLimpar}
                        />
                        <Button
                            onClick={handleGerarModulos}
                            disabled={loadingGerar || loadingLimpar}
                            className="flex-1  hover:bg-red-800  gap-2"
                        >
                            {loadingGerar ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Gerando...
                                </>
                            ) : (
                                <>
                                    <PlusCircle className="h-4 w-4" />
                                    Gerar Módulos
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <hr className="border-zinc-100" />

                {/* Seção 2: Limpar Tudo */}
                <div className=" border border-red-200 rounded-lg p-4 space-y-3">
                    <div>
                        <h3 className="text-sm font-bold text-red-800 flex items-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            Zona de Perigo
                        </h3>
                        <p className="text-xs text-red-600 mt-1">
                            Esta ação removerá permanentemente todos os registros salvos da tabela de medições.
                        </p>
                    </div>

                    <Button
                        onClick={handleLimparBanco}
                        disabled={loadingGerar || loadingLimpar}
                        variant="destructive"
                        className="w-full bg-red-600 hover:bg-red-700 text-white mt-1 gap-2"
                    >
                        {loadingLimpar ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Limpando Banco...
                            </>
                        ) : (
                            "Limpar Todos os Módulos"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}