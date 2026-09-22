/**
 * Serviço Fiscal e Contábil - Projeto Eclipse
 * Geração de NF-e 4.00, Chave de Acesso (44 dígitos) e Exportação XML
 */

export const COMPANY_FISCAL_DATA = {
  razaoSocial: 'COLLECTIVE DESENVOLVIMENTO DE SOFTWARE LTDA',
  nomeFantasia: 'Eclipse Studios & Consultoria TI',
  cnpj: '48.120.934/0001-82',
  inscricaoEstadual: 'ISENTO',
  inscricaoMunicipal: '104.928-1',
  logradouro: 'Rua das Indústrias, 450 - Sala 302',
  bairro: 'Zona Industrial',
  municipio: 'Joinville',
  uf: 'SC',
  cep: '89219-500',
  codigoMunicipio: '4209102',
  regimeTributario: '1 - Simples Nacional',
  cnae: '6203-1/00',
  codigoServico: '1.05'
};

// Gerador de chave de acesso oficial de 44 dígitos
export const generateNfeAccessKey = (
  ufCode = '42', 
  year = '26', 
  month = '09', 
  cnpj = '48120934000182', 
  model = '55', 
  series = '001', 
  nfeNum = '000000142'
) => {
  const randomCode = Math.floor(10000000 + Math.random() * 90000000).toString();
  const rawKey = `${ufCode}${year}${month}${cnpj.replace(/\D/g, '')}${model}${series.padStart(3, '0')}${nfeNum.padStart(9, '0')}1${randomCode}`;
  
  // Cálculo ponderado do dígito verificador (Módulo 11)
  let sum = 0;
  let weight = 2;
  for (let i = rawKey.length - 1; i >= 0; i--) {
    sum += parseInt(rawKey.charAt(i), 10) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  const remainder = sum % 11;
  const dv = (remainder === 0 || remainder === 1) ? 0 : 11 - remainder;
  
  return `${rawKey}${dv}`;
};

// Formatação visual da chave de 44 dígitos em blocos de 4
export const formatAccessKey = (key = '') => {
  return (key || '').replace(/(\d{4})/g, '$1 ').trim();
};

// Geração da string XML oficial padrão SEFAZ NF-e 4.00
export const generateNfeXmlString = (invoiceData = {}) => {
  const accessKey = invoiceData.accessKey || generateNfeAccessKey();
  const issueDateIso = new Date().toISOString();
  const nfeNum = (invoiceData.nfeNumber || invoiceData.number || '142').replace(/\D/g, '');
  const gross = Number(invoiceData.grossAmount || 10).toFixed(2);
  const fee = Number(invoiceData.gatewayFee || 0.95).toFixed(2);
  const net = Number(invoiceData.netAmount || 9.05).toFixed(2);
  const sefazProt = invoiceData.sefazProtocol || '142260089451234';
  const cName = invoiceData.customerName || invoiceData.customer || 'Consumidor Final';
  const cEmail = invoiceData.customerEmail || 'cliente@dominio.com';
  const payMethod = invoiceData.paymentMethod || 'PIX Instantâneo';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe${accessKey}" versao="4.00">
    <ide>
      <cUF>42</cUF>
      <cNF>${accessKey.slice(35, 43)}</cNF>
      <natOp>VENDA DE LICENCA DE SOFTWARE</natOp>
      <mod>55</mod>
      <serie>1</serie>
      <nNF>${nfeNum}</nNF>
      <dhEmi>${issueDateIso}</dhEmi>
      <tpNF>1</tpNF>
      <idDest>1</idDest>
      <cMunFG>4209102</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>${accessKey.slice(-1)}</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>1</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>Eclipse_Fiscal_v1.0</verProc>
    </ide>
    <emit>
      <CNPJ>${COMPANY_FISCAL_DATA.cnpj.replace(/\D/g, '')}</CNPJ>
      <xNome>${COMPANY_FISCAL_DATA.razaoSocial}</xNome>
      <xFant>${COMPANY_FISCAL_DATA.nomeFantasia}</xFant>
      <enderEmit>
        <xLgr>${COMPANY_FISCAL_DATA.logradouro}</xLgr>
        <nro>450</nro>
        <xBairro>${COMPANY_FISCAL_DATA.bairro}</xBairro>
        <cMun>4209102</cMun>
        <xMun>${COMPANY_FISCAL_DATA.municipio}</xMun>
        <UF>${COMPANY_FISCAL_DATA.uf}</UF>
        <CEP>${COMPANY_FISCAL_DATA.cep.replace(/\D/g, '')}</CEP>
      </enderEmit>
      <CRT>1</CRT>
    </emit>
    <dest>
      <CPF>00000000000</CPF>
      <xNome>${cName}</xNome>
      <email>${cEmail}</email>
      <indIEDest>9</indIEDest>
    </dest>
    <det nItem="1">
      <prod>
        <cProd>ECL-001</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Eclipse: Ecos do Abismo - Licenca Digital Godot Engine 4.7.1</xProd>
        <NCM>85234990</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>${gross}</vUnCom>
        <vProd>${gross}</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>${gross}</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMSSN102>
            <orig>0</orig>
            <CSOSN>102</CSOSN>
          </ICMSSN102>
        </ICMS>
        <PIS>
          <PISNT><CST>07</CST></PISNT>
        </PIS>
        <COFINS>
          <COFINSNT><CST>07</CST></COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vProd>${gross}</vProd>
        <vNF>${gross}</vNF>
        <vTotTrib>${(Number(gross) * 0.06).toFixed(2)}</vTotTrib>
      </ICMSTot>
    </total>
    <pag>
      <detPag>
        <tPag>${payMethod.toLowerCase().includes('pix') ? '17' : '03'}</tPag>
        <vPag>${gross}</vPag>
      </detPag>
    </pag>
    <infAdic>
      <infCpl>DOC EMITIDO POR EPP OPTANTE SIMPLES NACIONAL. GATEWAY: PAGBANK (TAXA: R$ ${fee} | LIQUIDO REPASSADO: R$ ${net}). PROTOCOLO AUTORIZACAO SEFAZ: ${sefazProt}.</infCpl>
    </infAdic>
  </infNFe>
</NFe>`;
};

// Download imediato da string XML salva no Firestore
export const downloadXmlBlob = (xmlString, nfeNumber = '142') => {
  const content = xmlString || generateNfeXmlString({ nfeNumber });
  const blob = new Blob([content], { type: 'application/xml;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `NFe_${String(nfeNumber).replace(/\D/g, '') || '142'}.xml`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Aliases para compatibilidade
export const generateNfseXml = generateNfeXmlString;
export const downloadXmlFile = (invoice) => {
  const num = invoice?.number || invoice?.nfeNumber || '142';
  const xml = invoice?.xmlString || generateNfeXmlString(invoice);
  downloadXmlBlob(xml, num);
};
