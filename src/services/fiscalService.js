/**
 * Emissor e Formatador de NFS-e (Padrão ABRASF)
 * Lei Complementar 116/2003 - Item 1.05
 */

export const COMPANY_FISCAL_DATA = {
  razaoSocial: 'THE WAVEM COLLECTIVE DESENVOLVIMENTO DE SOFTWARE LTDA',
  nomeFantasia: 'Eclipse Studios & Consultoria TI',
  cnpj: '48.120.934/0001-82',
  inscricaoMunicipal: '104.928-1',
  municipio: 'Joinville',
  uf: 'SC',
  codigoMunicipio: '4209102',
  regimeTributario: 'Simples Nacional - Alíquota Efetiva 6%',
  cnae: '6203-1/00 - Desenvolvimento e licenciamento de programas não customizáveis',
  itemLc116: '1.05 - Licenciamento ou cessão de direito de uso de programas de computação'
};

export const generateNfseXml = (invoice) => {
  const cleanNumber = (invoice.number || invoice.nfeNumber || 'NFS-1001').replace(/\D/g, '');
  const gross = typeof invoice.grossAmount === 'number' ? invoice.grossAmount : 10.00;
  const iss = (gross * 0.03).toFixed(2);
  const vCode = invoice.verificationCode || 'A9F3-481B-902C-71ED';
  const cName = invoice.customerName || invoice.customer || 'Consumidor Final';
  const cEmail = invoice.customerEmail || 'cliente@adquirente.com';
  const sDesc = invoice.serviceDescription || 'Licenciamento de Software de Jogo Eletrônico 2D (Eclipse: Ecos do Abismo)';
  const dateStr = invoice.issueDate || new Date().toLocaleDateString('pt-BR');

  return `<?xml version="1.0" encoding="UTF-8"?>
<CompNfse xmlns="http://www.abrasf.org.br/nfse.xsd">
  <Nfse versao="2.02">
    <InfNfse Id="NFS${cleanNumber}">
      <Numero>${cleanNumber}</Numero>
      <CodigoVerificacao>${vCode}</CodigoVerificacao>
      <DataEmissao>${dateStr}T${invoice.issueTime || '14:30:00'}</DataEmissao>
      <ValoresNfse>
        <ValorServicos>${gross.toFixed(2)}</ValorServicos>
        <ValorDeducoes>0.00</ValorDeducoes>
        <ValorPis>0.00</ValorPis>
        <ValorCofins>0.00</ValorCofins>
        <ValorInss>0.00</ValorInss>
        <ValorIr>0.00</ValorIr>
        <ValorCsll>0.00</ValorCsll>
        <IssRetido>2</IssRetido>
        <ValorIss>${iss}</ValorIss>
        <Aliquota>3.00</Aliquota>
        <ValorLiquidoNfse>${gross.toFixed(2)}</ValorLiquidoNfse>
      </ValoresNfse>
      <PrestadorServico>
        <IdentificacaoPrestador>
          <CpfCnpj><Cnpj>${COMPANY_FISCAL_DATA.cnpj.replace(/\D/g, '')}</Cnpj></CpfCnpj>
          <InscricaoMunicipal>${COMPANY_FISCAL_DATA.inscricaoMunicipal.replace(/\D/g, '')}</InscricaoMunicipal>
        </IdentificacaoPrestador>
        <RazaoSocial>${COMPANY_FISCAL_DATA.razaoSocial}</RazaoSocial>
        <Endereco>
          <Municipio>${COMPANY_FISCAL_DATA.municipio}</Municipio>
          <Uf>${COMPANY_FISCAL_DATA.uf}</Uf>
        </Endereco>
      </PrestadorServico>
      <TomadorServico>
        <IdentificacaoTomador>
          <CpfCnpj><Cpf>00000000000</Cpf></CpfCnpj>
        </IdentificacaoTomador>
        <RazaoSocial>${cName}</RazaoSocial>
        <Contato><Email>${cEmail}</Email></Contato>
      </TomadorServico>
      <DeclaracaoPrestacaoServico>
        <Competencia>${dateStr}</Competencia>
        <Servico>
          <ItemListaServico>0105</ItemListaServico>
          <CodigoCnae>${COMPANY_FISCAL_DATA.cnae.split(' ')[0].replace(/\D/g, '')}</CodigoCnae>
          <Discriminacao>${sDesc} | Chave Autenticação Godot Engine Build v1.0.4 | Gateway: PagBank</Discriminacao>
        </Servico>
      </DeclaracaoPrestacaoServico>
    </InfNfse>
  </Nfse>
</CompNfse>`;
};

export const downloadXmlFile = (invoice) => {
  const cleanNumber = (invoice.number || invoice.nfeNumber || '1001').replace(/\D/g, '');
  const xmlContent = generateNfseXml(invoice);
  const blob = new Blob([xmlContent], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `NFSe_${cleanNumber}.xml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
