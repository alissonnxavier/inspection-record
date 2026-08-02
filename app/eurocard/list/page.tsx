'use client'

import { useEffect, useState, useCallback, Suspense } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Printer,
  Loader2,
  ChevronLeft,
  ChevronRight,
  DoorOpen,
  Trash2,
  ArrowLeft,
  FileSpreadsheet,
  ListFilter
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

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

const ListaEurocard = () => {
  const searchParams = useSearchParams();
  const ofParam = searchParams.get('of') || '';

  const [modulos, setModulos] = useState<ModuloData[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Estados da Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const fetchModulos = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const url = ofParam
        ? `/api/register/eurocard/list?page=${page}&limit=40&of=${encodeURIComponent(ofParam)}`
        : `/api/register/eurocard/list?page=${page}&limit=40`;

      const response = await axios.get(url);
      setModulos(response.data.modulos || []);
      setTotalPaginas(response.data.meta?.totalPaginas || 1);
      setPaginaAtual(response.data.meta?.paginaAtual || 1);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar histórico de módulos.");
    } finally {
      setLoading(false);
    }
  }, [ofParam]);

  useEffect(() => {
    fetchModulos(paginaAtual);
  }, [paginaAtual, fetchModulos]);

  // Função para exportar os módulos específicos da OF para Excel
  const handleExportExcel = async () => {
    setExporting(true);
    try {
      // Repassa o parâmetro de OF na URL da API de exportação
      const url = ofParam
        ? `/api/register/eurocard/export?of=${encodeURIComponent(ofParam)}`
        : `/api/register/eurocard/export`;

      const response = await axios.get(url, {
        responseType: 'blob',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });

      const fileName = ofParam
        ? `Medicoes_Eurocard_OF_${ofParam}.xlsx`
        : `Medicoes_Eurocard_Todos.xlsx`;

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success("Planilha Excel exportada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Falha ao gerar a planilha Excel.");
    } finally {
      setExporting(false);
    }
  };

  const formatDBValue = (value: number) => {
    return value !== undefined && value !== null ? value.toFixed(2).replace('.', ',') : '0,00';
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async (id: string, moduloNum: number) => {
    const confirmado = window.confirm(`Tem certeza de que deseja excluir permanentemente o MÓDULO ${moduloNum}?`);

    if (!confirmado) return;

    try {
      await axios.delete(`/api/register/eurocard/list?id=${id}`);
      toast.success(`Módulo ${moduloNum} excluído com sucesso!`);
      fetchModulos(paginaAtual);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível excluir o módulo.");
    }
  };

  return (
    <Suspense fallback={
      <div className="flex py-20 w-full items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    }>
      <div className="w-full max-w-6xl mx-auto p-4 md:p-8 mb-12">
        <style jsx global>{`
                @media print {
                    @page { size: landscape; margin: 1cm; }
                    body { background: white !important; color: black !important; }
                }
            `}</style>

        {/* Header (Mesmo tamanho e estilo da página de Gestão) */}
        <header className="print:hidden flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <ListFilter className="text-primary" /> Módulos Salvos {ofParam && `(OF: ${ofParam})`}
            </h1>
          </div>

          {/* Botões de Ação na Headbar */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Botão de Exportar para Excel */}
            <Button
              onClick={handleExportExcel}
              disabled={exporting || modulos.length === 0}
              className="flex items-center gap-2"
            >
              {exporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="h-4 w-4" />
                  Exportar Excel
                </>
              )}
            </Button>

            <Link href="/eurocard/books">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft size={16} /> Ordens de Fabricação (OF)
              </Button>
            </Link>

            <Link href="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors ml-2">
              <DoorOpen size={24} /> Sair
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="flex py-20 w-full items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground font-medium">Carregando módulos...</span>
          </div>
        ) : modulos.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-lg bg-muted/40 max-w-lg mx-auto">
            <p className="text-muted-foreground print:hidden mb-4">
              {ofParam
                ? `Nenhum módulo encontrado para a OF ${ofParam}.`
                : "Nenhum módulo encontrado nesta página."}
            </p>
            {ofParam && (
              <Link href={`/eurocard?of=${encodeURIComponent(ofParam)}`}>
                <Button>
                  Cadastrar Módulo para esta OF
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Listagem dos Módulos */}
            <div className="space-y-4 print:space-y-0">
              {modulos.map((modulo) => (
                <details
                  key={modulo.id}
                  className="group border border-border rounded-lg shadow-sm overflow-hidden open:shadow-md transition-all duration-200 bg-card text-card-foreground break-inside-avoid print:border-none print:shadow-none print:hidden print:open:block"
                >
                  <summary className="print:hidden flex items-center justify-between p-4 font-semibold cursor-pointer list-none select-none hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-primary text-primary-foreground">
                        MÓDULO {modulo.moduloNum}
                      </span>
                      <span className="text-xs font-normal text-muted-foreground">
                        Salvo em: {new Date(modulo.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                  </summary>

                  <div className="p-4 border-t border-border group-open:block print:p-0 print:border-none">
                    {/* Container de Botões de Ação do Módulo */}
                    <div className="print:hidden flex justify-end gap-2 mb-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrint}
                        className="gap-2 text-xs"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        Imprimir Módulo {modulo.moduloNum}
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(modulo.id, modulo.moduloNum)}
                        className="gap-2 text-xs"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Excluir
                      </Button>
                    </div>

                    {/* Tabela de Medições */}
                    <div className="border-2 border-border print:border-black text-sm w-full max-w-4xl mx-auto print:max-w-full">
                      {/* Cabeçalho da Tabela */}
                      <div className="grid grid-cols-12 border-b-2 border-border print:border-black font-bold text-center divide-x-2 divide-border print:divide-black bg-muted/30 print:bg-transparent">
                        <div className="col-span-4 py-3 uppercase tracking-wider font-extrabold text-base print:text-xl print:py-1.5">Eurocard</div>
                        <div className="col-span-4 py-3 uppercase tracking-wider font-extrabold text-base print:text-xl print:py-1.5">MÓDULO {modulo.moduloNum}</div>
                        <div className="col-span-4 py-3 uppercase tracking-wider font-extrabold text-base print:text-xl print:py-1.5">dB</div>
                      </div>

                      {eurocardRows.map((row, index) => {
                        const valOut1 = modulo[`${row.id}_out1` as keyof ModuloData] as number;
                        const valOut2 = modulo[`${row.id}_out2` as keyof ModuloData] as number;

                        return (
                          <div
                            key={row.id}
                            className={`grid grid-cols-12 divide-x-2 divide-border print:divide-black ${index !== eurocardRows.length - 1 ? 'border-b-2 border-border print:border-black' : ''}`}
                          >
                            {/* Coluna Lateral (SPL XX) */}
                            <div className="col-span-4 flex items-center justify-center font-extrabold text-base print:text-2xl print:font-black">
                              {row.label}
                            </div>

                            {/* Sub-grade OUT 1 e OUT 2 */}
                            <div className="col-span-8 grid grid-rows-2 divide-y-2 divide-border print:divide-black">
                              {/* Linha OUT 1 */}
                              <div className="grid grid-cols-8 divide-x-2 divide-border print:divide-black">
                                <div className="col-span-4 flex items-center justify-center font-bold py-2.5 text-sm print:text-lg print:py-1">OUT 1</div>
                                <div className="col-span-4 flex items-center justify-center font-black bg-transparent text-base print:text-2xl print:font-black">{formatDBValue(valOut1)}</div>
                              </div>
                              {/* Linha OUT 2 */}
                              <div className="grid grid-cols-8 divide-x-2 divide-border print:divide-black">
                                <div className="col-span-4 flex items-center justify-center font-bold py-2.5 text-sm print:text-lg print:py-1">OUT 2</div>
                                <div className="col-span-4 flex items-center justify-center font-black bg-transparent text-base print:text-2xl print:font-black">{formatDBValue(valOut2)}</div>
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

            {/* Paginação */}
            <div className="print:hidden flex items-center justify-between border-t border-border px-4 py-4 sm:px-6 mt-6">
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
                  <p className="text-sm text-muted-foreground">
                    Página <span className="font-medium text-foreground">{paginaAtual}</span> de <span className="font-medium text-foreground">{totalPaginas}</span>
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
                        className="px-4 py-2 text-sm font-semibold"
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
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default ListaEurocard;