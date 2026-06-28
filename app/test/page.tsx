"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, Loader2, CheckCircle } from "lucide-react";
import createWorker from "tesseract.js";

interface ScannedData {
  produto: string;
  numeroOP: string;
  quantidade: string;
}

export default function ScannerPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [scannedData, setScannedData] = useState<ScannedData>({
    produto: "",
    numeroOP: "",
    quantidade: "",
  });

  // Inicializa a câmera traseira (environment)
  const startCamera = async () => {
    setError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError("Não foi possível acessar a câmera. Verifique as permissões.");
      console.error(err);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Função atualizada com os padrões estritos de OP e Produto
  // Função atualizada para buscar o produto após a palavra-chave "Produto:"
  // Função atualizada com validação de no mínimo 8 dígitos para o Produto
  const parseOPText = (text: string) => {
    // Remove espaços extras e quebras de linha
    const cleanText = text.replace(/\s+/g, " ");

    // 1. Busca exata de 11 números isolados para a OP
    const opRegex = /\b\d{11}\b/;

    // 2. Busca o que vem após "Produto:" ou "Prod:"
    const produtoRegex = /(?:produto|prod):\s*([A-Za-z0-9\.\-_]+)/i;

    // 3. Busca por quantidade
    const qtdRegex = /(?:quantidade|qtd):\s*([0-9\.]+)/i;

    const opMatch = cleanText.match(opRegex);
    const produtoMatch = cleanText.match(produtoRegex);
    const qtdMatch = cleanText.match(qtdRegex);

    // Validação do Produto (Mínimo de 8 caracteres)
    let produtoDetectado = "Não encontrado";
    if (produtoMatch && produtoMatch[1]) {
      const possivelProduto = produtoMatch[1].trim().toUpperCase();

      // Valida se o código capturado tem pelo menos 8 dígitos/caracteres
      if (possivelProduto.length >= 8) {
        produtoDetectado = possivelProduto;
      } else {
        console.log(`Produto descartado por ter apenas ${possivelProduto.length} caracteres:`, possivelProduto);
      }
    }

    setScannedData({
      numeroOP: opMatch ? opMatch[0] : "Não encontrado",
      produto: produtoDetectado,
      quantidade: qtdMatch ? qtdMatch[1].trim() : "Não encontrado",
    });
  };

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (context) {
      try {
        // Pausa o vídeo para dar o feedback visual de "foto tirada"
        video.pause();

        // Configura o canvas com a resolução nativa do vídeo para máxima nitidez
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Converte o frame do canvas em uma string Base64 (JPEG para menor tamanho de banda)
        const base64Image = canvas.toDataURL("image/jpeg", 0.85);

        // Envia para a API Route do Next.js
        const response = await fetch("/api/ocr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Image }),
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        console.log("Texto retornado pelo Google Cloud Vision:", data.text);

        // Executa a sua função de Regex para filtrar Produto, OP e Qtd
        parseOPText(data.text);

      } catch (err: any) {
        setError(err.message || "Erro ao processar a imagem com a nuvem.");
        console.error(err);
      } finally {
        setIsProcessing(false);
        // Retoma a câmera
        video.play().catch((e) => console.log("Erro ao retomar vídeo:", e));
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-6">
      <header className="w-full max-w-md text-center my-4">
        <h1 className="text-xl font-bold tracking-tight">Scanner de Ordem de Produção</h1>
        <p className="text-xs text-slate-400 mt-1">Aponte a câmera para os dados da OP</p>
      </header>

      {/* Container do Vídeo / Câmera */}
      <div className="relative w-full max-w-md aspect-[4/3] bg-black rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Guia visual para o usuário centralizar o documento */}
        <div className="absolute inset-4 border-2 border-dashed border-sky-500/50 rounded-xl pointer-events-none flex items-center justify-center">
          <div className="w-full h-0.5 bg-sky-500/30 animate-pulse dynamic-scan-line" />
        </div>

        {/* Status de carregamento */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
            <p className="text-sm font-medium text-sky-400">Processando OCR...</p>
          </div>
        )}
      </div>

      {/* Canvas oculto usado apenas para capturar o frame */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Botões de Ação */}
      <div className="w-full max-w-md flex gap-3 my-4">
        <button
          onClick={captureAndScan}
          disabled={isProcessing}
          className="flex-1 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 text-white font-medium py-3 px-4 rounded-xl shadow transition flex items-center justify-center gap-2"
        >
          <Camera className="w-5 h-5" />
          {isProcessing ? "Eshaneando..." : "Escanear OP"}
        </button>

        <button
          onClick={startCamera}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-3 rounded-xl border border-slate-700 transition"
          title="Reiniciar Câmera"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="w-full max-w-md bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs mb-4">
          {error}
        </div>
      )}

      {/* Resultado do Scan */}
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-700 pb-3 mb-3">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <h2 className="font-semibold text-sm tracking-wide uppercase text-slate-300">Dados Detectados</h2>
        </div>

        <div className="space-y-3">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Ordem de Produção (OP)</span>
            <div className="bg-slate-900/60 border border-slate-700/50 px-3 py-2 rounded-lg text-sm font-mono mt-1 min-h-[36px] flex items-center">
              {scannedData.numeroOP || <span className="text-slate-600">Aguardando scan...</span>}
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-medium">Produto</span>
            <div className="bg-slate-900/60 border border-slate-700/50 px-3 py-2 rounded-lg text-sm mt-1 min-h-[36px] flex items-center">
              {scannedData.produto || <span className="text-slate-600">Aguardando scan...</span>}
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-medium">Quantidade</span>
            <div className="bg-slate-900/60 border border-slate-700/50 px-3 py-2 rounded-lg text-sm font-mono mt-1 min-h-[36px] flex items-center">
              {scannedData.quantidade || <span className="text-slate-600">Aguardando scan...</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}