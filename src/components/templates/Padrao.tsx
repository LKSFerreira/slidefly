import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { DemandRecord, PaletteColors } from '../../types';

const LIMITE_TITULO_PADRAO = 40;
const LIMITE_TEXTO_PADRAO = 40;
const MULTIPLICADOR_TITULO = 1.1;
const ESCALA_MINIMA_AUTOFIT = 0.72;
const PASSO_AUTOFIT = 0.03;
const MARGEM_OVERFLOW = 2;

interface PadraoProps {
  record: DemandRecord;
  palette: PaletteColors;
  titleFontSize: number;
  contentFontSize: number;
}

interface BlocoPadraoProps {
  titulo: string;
  valor?: string;
  headerBg: string;
  borderColor: string;
  backgroundColor: string;
  textColor: string;
  tituloTamanho: number;
  corpoTamanho: number;
  alturaCabecalho: number;
  corpoRef?: (node: HTMLDivElement | null) => void;
  corpoCentralizado?: boolean;
}

type ChaveCorpo = 'fase' | 'responsavel' | 'status' | 'prioridade' | 'descricao' | 'acoes' | 'proximas' | 'problemas';

interface MetaCard {
  chave: ChaveCorpo;
  titulo: string;
  valor?: string;
  peso: number;
}

export default function Padrao({
  record,
  palette,
  titleFontSize,
  contentFontSize,
}: PadraoProps) {
  const corTitulo = palette.title || palette.accent;
  const corBorda = `${palette.text}22`;
  const corBloco = palette.surface;
  const [escalaFonte, setEscalaFonte] = useState(1);
  const refsCorpo = useRef<Record<ChaveCorpo, HTMLDivElement | null>>({
    fase: null,
    responsavel: null,
    status: null,
    prioridade: null,
    descricao: null,
    acoes: null,
    proximas: null,
    problemas: null,
  });

  const assinaturaConteudo = useMemo(
    () =>
      [
        record.id,
        record.title,
        record.boardColumn,
        record.assignedTo,
        record.status,
        record.priority,
        record.description,
        record.actions,
        record.nextActivities,
        record.problems,
        titleFontSize,
        contentFontSize,
      ].join('|'),
    [
      contentFontSize,
      record.actions,
      record.assignedTo,
      record.boardColumn,
      record.description,
      record.id,
      record.nextActivities,
      record.priority,
      record.problems,
      record.status,
      record.title,
      titleFontSize,
    ],
  );

  const tituloConfigurado = limitar(titleFontSize, 8, LIMITE_TITULO_PADRAO);
  const textoConfigurado = limitar(contentFontSize, 8, LIMITE_TEXTO_PADRAO);

  const tamanhoTituloPrincipal = aplicarEscala(Math.max(24, tituloConfigurado * 1.6 * MULTIPLICADOR_TITULO), escalaFonte);
  const tamanhoTituloBloco = aplicarEscala(tituloConfigurado * MULTIPLICADOR_TITULO, escalaFonte);
  const tamanhoCorpo = aplicarEscala(textoConfigurado, escalaFonte);
  const espacamentoTitulo = Math.max(32, Math.round(tamanhoTituloPrincipal * 0.55));
  const alturaCabecalhoMeta = Math.max(72, Math.round(tamanhoTituloBloco * 2.6));
  const alturaCabecalhoConteudo = Math.max(60, Math.round(tamanhoTituloBloco * 1.95));

  const cardsMeta = useMemo<MetaCard[]>(
    () => [
      {
        chave: 'fase',
        titulo: 'FASE',
        valor: record.boardColumn,
        peso: calcularPesoHorizontal(record.boardColumn, 1.05, 1.45),
      },
      {
        chave: 'responsavel',
        titulo: 'DESIGNADO ESPECIALISTA',
        valor: record.assignedTo,
        peso: calcularPesoHorizontal(record.assignedTo, 1.2, 1.9),
      },
      {
        chave: 'status',
        titulo: 'STATUS',
        valor: record.status,
        peso: calcularPesoHorizontal(record.status, 1.05, 1.55),
      },
      {
        chave: 'prioridade',
        titulo: 'PRIORIDADE',
        valor: record.priority,
        peso: calcularPesoHorizontal(record.priority, 0.95, 1.6),
      },
    ],
    [record.assignedTo, record.boardColumn, record.priority, record.status],
  );

  const templateColunasMeta = cardsMeta.map((card) => `${card.peso.toFixed(2)}fr`).join(' ');
  const pesoDescricao = calcularPesoVertical(record.description, 1.05, 2.2);
  const pesoAcoes = calcularPesoVertical(record.actions, 0.95, 1.8);
  const pesoProximas = calcularPesoVertical(record.nextActivities, 0.95, 1.8);
  const pesoProblemas = calcularPesoVertical(record.problems, 0.9, 1.7);
  const pesoLinhaPareada = Math.max(pesoAcoes, pesoProximas);
  const larguraAcoes = calcularPesoHorizontal(record.actions, 1, 1.35);
  const larguraProximas = calcularPesoHorizontal(record.nextActivities, 1, 1.35);

  const pesoTotalMeta = cardsMeta.reduce((acc, c) => acc + c.peso, 0);
  const larguraTotalDupla = larguraAcoes + larguraProximas;
  const totalVerticalPeso = pesoDescricao + pesoLinhaPareada + pesoProblemas;

  useLayoutEffect(() => {
    setEscalaFonte(1);
  }, [assinaturaConteudo]);

  useLayoutEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      if (escalaFonte <= ESCALA_MINIMA_AUTOFIT) {
        return;
      }

      const existeOverflow = Object.values(refsCorpo.current)
        .filter((elemento): elemento is HTMLDivElement => elemento !== null)
        .some((elemento) => {
          const overflowVertical = elemento.scrollHeight - elemento.clientHeight > MARGEM_OVERFLOW;
          const overflowHorizontal = elemento.scrollWidth - elemento.clientWidth > MARGEM_OVERFLOW;

          return overflowVertical || overflowHorizontal;
        });

      if (existeOverflow) {
        setEscalaFonte((anterior) =>
          limitar(Number((anterior - PASSO_AUTOFIT).toFixed(2)), ESCALA_MINIMA_AUTOFIT, 1),
        );
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [
    assinaturaConteudo,
    escalaFonte,
    tamanhoCorpo,
    tamanhoTituloBloco,
    tamanhoTituloPrincipal,
  ]);

  const registrarCorpo = (chave: ChaveCorpo) => (elemento: HTMLDivElement | null) => {
    refsCorpo.current[chave] = elemento;
  };

  return (
    <div
      className="grid h-full w-full min-h-0 grid-rows-[auto_minmax(0,1fr)] font-sans"
      style={{ backgroundColor: palette.bg, color: palette.text }}
    >
      <div style={{ marginBottom: `${espacamentoTitulo}px` }}>
        <h1
          className="font-bold leading-[1.08] tracking-normal"
          style={{ color: corTitulo, fontSize: `${tamanhoTituloPrincipal}px` }}
        >
          {record.id} - {record.title}
        </h1>
      </div>

      <div className="flex min-h-0 flex-1 flex-col w-full">
        <div className="flex w-full shrink-0 flex-row pb-2.5 min-h-0">
          {cardsMeta.map((card, idx) => (
            <div
              key={card.chave}
              className="h-full min-w-0"
              style={{
                width: `${(card.peso / pesoTotalMeta) * 100}%`,
                paddingRight: idx < cardsMeta.length - 1 ? '10px' : '0',
              }}
            >
              <BlocoPadrao
                titulo={card.titulo}
                valor={card.valor}
                headerBg={palette.accent}
                borderColor={corBorda}
                backgroundColor={corBloco}
                textColor={palette.text}
                tituloTamanho={tamanhoTituloBloco}
                corpoTamanho={tamanhoCorpo}
                alturaCabecalho={alturaCabecalhoMeta}
                corpoRef={registrarCorpo(card.chave)}
                corpoCentralizado
              />
            </div>
          ))}
        </div>

        <div className="flex min-h-0 flex-1 flex-col w-full">
          <div
            className="w-full pb-2.5 min-h-0"
            style={{ height: `${(pesoDescricao / totalVerticalPeso) * 100}%` }}
          >
            <BlocoPadrao
              titulo="DESCRIÇÃO DO PEDIDO"
              valor={record.description}
              headerBg={palette.accent}
              borderColor={corBorda}
              backgroundColor={corBloco}
              textColor={palette.text}
              tituloTamanho={tamanhoTituloBloco}
              corpoTamanho={tamanhoCorpo}
              alturaCabecalho={alturaCabecalhoConteudo}
              corpoRef={registrarCorpo('descricao')}
            />
          </div>

          <div
            className="flex w-full flex-row pb-2.5 min-h-0"
            style={{ height: `${(pesoLinhaPareada / totalVerticalPeso) * 100}%` }}
          >
            <div
              className="h-full min-w-0"
              style={{
                width: `${(larguraAcoes / larguraTotalDupla) * 100}%`,
                paddingRight: '10px',
              }}
            >
              <BlocoPadrao
                titulo="AÇÕES REALIZADAS"
                valor={record.actions}
                headerBg={palette.accent}
                borderColor={corBorda}
                backgroundColor={corBloco}
                textColor={palette.text}
                tituloTamanho={tamanhoTituloBloco}
                corpoTamanho={tamanhoCorpo}
                alturaCabecalho={alturaCabecalhoConteudo}
                corpoRef={registrarCorpo('acoes')}
                corpoCentralizado
              />
            </div>
            <div
              className="h-full min-w-0"
              style={{ width: `${(larguraProximas / larguraTotalDupla) * 100}%` }}
            >
              <BlocoPadrao
                titulo="PRÓXIMAS ATIVIDADES"
                valor={record.nextActivities}
                headerBg={palette.accent}
                borderColor={corBorda}
                backgroundColor={corBloco}
                textColor={palette.text}
                tituloTamanho={tamanhoTituloBloco}
                corpoTamanho={tamanhoCorpo}
                alturaCabecalho={alturaCabecalhoConteudo}
                corpoRef={registrarCorpo('proximas')}
                corpoCentralizado
              />
            </div>
          </div>

          <div
            className="w-full min-h-0"
            style={{ height: `${(pesoProblemas / totalVerticalPeso) * 100}%` }}
          >
            <BlocoPadrao
              titulo="PROBLEMAS E PENDÊNCIAS"
              valor={record.problems}
              headerBg={palette.accent}
              borderColor={corBorda}
              backgroundColor={corBloco}
              textColor={palette.text}
              tituloTamanho={tamanhoTituloBloco}
              corpoTamanho={tamanhoCorpo}
              alturaCabecalho={alturaCabecalhoConteudo}
              corpoRef={registrarCorpo('problemas')}
              corpoCentralizado
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BlocoPadrao({
  titulo,
  valor,
  headerBg,
  borderColor,
  backgroundColor,
  textColor,
  tituloTamanho,
  corpoTamanho,
  alturaCabecalho,
  corpoRef,
  corpoCentralizado = false,
}: BlocoPadraoProps) {
  const classesCorpo = corpoCentralizado
    ? 'min-h-0 flex-1 grid place-items-center whitespace-pre-wrap px-4 py-2 text-center font-semibold'
    : 'min-h-0 flex-1 whitespace-pre-wrap px-4 pt-2.5 pb-3 font-semibold';

  return (
    <section className="flex h-full w-full min-h-0 flex-col overflow-hidden border" style={{ borderColor }}>
      <header
        className="flex items-center justify-center px-4 text-center font-semibold uppercase tracking-[0.08em] text-white"
        style={{
          backgroundColor: headerBg,
          minHeight: `${alturaCabecalho}px`,
          fontSize: `${tituloTamanho}px`,
          lineHeight: 1.1,
        }}
      >
        {titulo}
      </header>
      <div
        ref={corpoRef}
        className={classesCorpo}
        style={{
          backgroundColor,
          color: textColor,
          fontSize: `${corpoTamanho}px`,
          lineHeight: corpoCentralizado ? 1.12 : 1.28,
          overflow: 'hidden',
          wordBreak: 'break-word',
        }}
      >
        {corpoCentralizado ? <span className="block">{valor || ''}</span> : valor || ''}
      </div>
    </section>
  );
}

function limitar(valor: number, minimo: number, maximo: number) {
  return Math.min(Math.max(valor, minimo), maximo);
}

function aplicarEscala(valor: number, escala: number) {
  return Math.max(12, Math.round(valor * escala));
}

function calcularPesoHorizontal(valor: string | undefined, minimo: number, maximo: number) {
  const texto = normalizarTexto(valor);
  const densidade = texto.length + contarLinhas(texto) * 12 + contarPalavrasLongas(texto) * 4;

  return limitar(0.82 + densidade / 34, minimo, maximo);
}

function calcularPesoVertical(valor: string | undefined, minimo: number, maximo: number) {
  const texto = normalizarTexto(valor);
  const densidade = texto.length + contarLinhas(texto) * 28 + contarPalavrasLongas(texto) * 6;

  return limitar(0.78 + densidade / 140, minimo, maximo);
}

function contarLinhas(texto: string) {
  return texto ? texto.split('\n').length : 0;
}

function contarPalavrasLongas(texto: string) {
  if (!texto) {
    return 0;
  }

  return texto.split(/\s+/).filter((palavra) => palavra.length >= 10).length;
}

function normalizarTexto(valor?: string) {
  return (valor || '').trim();
}
