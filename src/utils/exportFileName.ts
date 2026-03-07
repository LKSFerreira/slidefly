function formatarDataLocal(data: Date) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

export function gerarNomeArquivoExportacao(extensao: 'pdf' | 'pptx') {
  const dataFormatada = formatarDataLocal(new Date());
  return `Slidefly_${dataFormatada}.${extensao}`;
}
