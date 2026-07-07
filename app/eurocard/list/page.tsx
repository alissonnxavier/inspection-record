'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { ChevronDown, Printer, Loader2, ChevronLeft, ChevronRight, DoorOpen, Component, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Tip } from '@/components/ui/tip';

interface ModuloData {
  id: string;
  moduloNum: number;
  createdAt: string;
  spl01_out1: number; spl01_out2: number;
  spl02_out1: number; spl02_out2: number;
  spl03_out1: number; spl03_out2: number;
  spl04_out1: number; spl04_out2: number;
  spl05_out1: number; spl05_out2: number;
  spl06_out1: number; spl06_out2: number;
}

const eurocardRows = [
  { id: 'spl01', label: 'SPL 01' },
  { id: 'spl02', label: 'SPL 02' },
  { id: 'spl03', label: 'SPL 03' },
  { id: 'spl04', label: 'SPL 04' },
  { id: 'spl05', label: 'SPL 05' },
  { id: 'spl06', label: 'SPL 06' },
];

export default function ListaEurocard() {
  const [modulos, setModulos] = useState<ModuloData[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados da Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const fetchModulos = async (page: number) => {
    setLoading(true);
    try {
      // Alterado o parâmetro limit de 20 para 40
      const response = await axios.get(`/api/register/eurocard/list?page=${page}&limit=40`);
      setModulos(response.data.modulos);
      setTotalPaginas(response.data.meta.totalPaginas);
      setPaginaAtual(response.data.meta.paginaAtual);
    } catch (error) {
      toast.error("Erro ao carregar histórico de módulos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModulos(paginaAtual);
  }, [paginaAtual]);

  const formatDBValue = (value: number) => {
    return value.toFixed(2).replace('.', ',');
  };

  const handlePrint = () => {
    window.print();
  };

  // Função para deletar o módulo com mensagem de confirmação
  const handleDelete = async (id: string, moduloNum: number) => {
    const confirmado = window.confirm(`Tem certeza de que deseja excluir permanentemente o MÓDULO ${moduloNum}?`);

    if (!confirmado) return;

    try {
      // Faz a chamada DELETE passando o ID (ObjectId do MongoDB)
      await axios.delete(`/api/register/eurocard/list?id=${id}`);
      toast.success(`Módulo ${moduloNum} excluído com sucesso!`);

      // Recarrega a página atual para atualizar a lista
      fetchModulos(paginaAtual);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível excluir o módulo.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 mb-12">
      <style jsx global>{`
        @media print {
          @page { size: landscape; margin: 1cm; }
          body { background: white; color: black; }
        }
      `}</style>

      {/* Header - Adicionado 'print:hidden' para sumir completamente na impressão */}
      <header className="print:hidden flex items-center justify-between border-b border-slate-800 pb-4 z-10 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Módulos Salvos</h1>
        </div>
        <div className="flex items-center gap-1">
          <Tip
            message="Eurocard"
            content={
              <Link href='/eurocard'>
                <Button
                  variant='newuser'
                  size='icon'
                  className="bg-gray-500 text-white hover:animate-pulse"
                >
                  <Component size={20} />
                </Button>
              </Link>
            }>
          </Tip>
        </div>
        <Link href='/' className="sm:ml-4 lg:ml-10 flex items-center gap-2 text-slate-400 hover:text-slate-500 transition-colors duration-200">
          <DoorOpen size={50} /> Sair
        </Link>
      </header>

      {loading ? (
        <div className="flex py-20 w-full items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-600" />
          <span className="text-zinc-600 font-medium">Carregando módulos...</span>
        </div>
      ) : modulos.length === 0 ? (
        <p className="text-center py-8 text-zinc-500 print:hidden">Nenhum módulo encontrado nesta página.</p>
      ) : (
        <>
          {/* Listagem dos Módulos */}
          <div className="space-y-4 print:space-y-0">
            {modulos.map((modulo) => (
              <details
                key={modulo.id}
                className="group border border-zinc-200 rounded-lg bg-white shadow-sm overflow-hidden open:shadow-md transition-all duration-200 break-inside-avoid print:border-none print:shadow-none print:hidden print:open:block"
              >
                <summary className="print:hidden flex items-center justify-between p-4 font-semibold text-zinc-800 cursor-pointer hover:bg-zinc-50 list-none select-none">
                  <div className="flex items-center gap-4">
                    <span className="bg-zinc-900 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                      MÓDULO {modulo.moduloNum}
                    </span>
                    <span className="text-xs text-zinc-400 font-normal">
                      Salvo em: {new Date(modulo.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <ChevronDown className="h-5 w-5 text-zinc-400 transition-transform duration-200 group-open:rotate-180" />
                </summary>

                <div className="p-4 border-t border-zinc-100 bg-white group-open:block print:p-0 print:border-none">
                  {/* Container de Botões de Ação */}
                  <div className="print:hidden flex justify-end gap-2 mb-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrint}
                      className="gap-2 text-xs border-zinc-300 hover:bg-zinc-50 text-zinc-700"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Imprimir Módulo {modulo.moduloNum}
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(modulo.id, modulo.moduloNum)}
                      className="gap-2 text-xs bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Excluir
                    </Button>
                  </div>

                  {/* Tabela */}
                  <div className="border-2 border-zinc-900 text-sm w-full max-w-4xl mx-auto print:max-w-full">
                    <div className="grid grid-cols-12 bg-zinc-100 border-b-2 border-zinc-900 font-bold text-center divide-x-2 divide-zinc-900">
                      <div className="col-span-4 py-3 uppercase tracking-wider text-zinc-900 font-extrabold text-base">Eurocard</div>
                      <div className="col-span-4 py-3 uppercase tracking-wider text-zinc-900 font-extrabold text-base">MÓDULO {modulo.moduloNum}</div>
                      <div className="col-span-4 py-3 uppercase tracking-wider text-zinc-900 font-extrabold text-base">dB</div>
                    </div>

                    {eurocardRows.map((row, index) => {
                      const valOut1 = modulo[`${row.id}_out1` as keyof ModuloData] as number;
                      const valOut2 = modulo[`${row.id}_out2` as keyof ModuloData] as number;

                      return (
                        <div
                          key={row.id}
                          className={`grid grid-cols-12 divide-x-2 divide-zinc-900 ${index !== eurocardRows.length - 1 ? 'border-b-2 border-zinc-900' : ''}`}
                        >
                          <div className="col-span-4 flex items-center justify-center font-extrabold text-base bg-zinc-50 text-zinc-900">
                            {row.label}
                          </div>

                          <div className="col-span-8 grid grid-rows-2 divide-y-2 divide-zinc-900">
                            <div className="grid grid-cols-8 divide-x-2 divide-zinc-900">
                              <div className="col-span-4 flex items-center justify-center font-bold py-2.5 bg-white text-zinc-800 text-sm">OUT 1</div>
                              <div className="col-span-4 flex items-center justify-center font-black bg-transparent text-zinc-900 text-base">{formatDBValue(valOut1)}</div>
                            </div>
                            <div className="grid grid-cols-8 divide-x-2 divide-zinc-900">
                              <div className="col-span-4 flex items-center justify-center font-bold py-2.5 bg-white text-zinc-800 text-sm">OUT 2</div>
                              <div className="col-span-4 flex items-center justify-center font-black bg-transparent text-zinc-900 text-base">{formatDBValue(valOut2)}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </details>
            ))}
          </div>

          {/* Barra de Paginação */}
          <div className="print:hidden flex items-center justify-between border-t border-zinc-200 px-4 py-4 sm:px-6 mt-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <Button
                onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
                variant="outline"
              >
                Anterior
              </Button>
              <Button
                onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaAtual === totalPaginas}
                variant="outline"
              >
                Próximo
              </Button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-zinc-700">
                  Página <span className="font-medium">{paginaAtual}</span> de <span className="font-medium">{totalPaginas}</span>
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <Button
                    variant="outline"
                    className="rounded-l-md px-2 py-2"
                    onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                    disabled={paginaAtual === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === paginaAtual ? "default" : "outline"}
                      className={`px-4 py-2 text-sm font-semibold ${page === paginaAtual ? "bg-zinc-900 text-white" : ""}`}
                      onClick={() => setPaginaAtual(page)}
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    className="rounded-r-md px-2 py-2"
                    onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                    disabled={paginaAtual === totalPaginas}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}