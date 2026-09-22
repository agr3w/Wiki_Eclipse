import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { DanfeVisualModal } from '../../components/fiscal/DanfeVisualModal';
import styles from './PagBankGatewayPage.module.css';

export const PagBankGatewayPage = () => {
  const { user, claimGameLicense } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [method, setMethod] = useState('pix');
  const [cardNumber, setCardNumber] = useState('5502 •••• •••• 9842');
  const [cardHolder, setCardHolder] = useState(user?.displayName?.toUpperCase() || 'JOGADOR SENTINELA');
  const [cardExpiry, setCardExpiry] = useState('09/29');
  const [cardCvv, setCardCvv] = useState('412');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [transactionProtocol, setTransactionProtocol] = useState('');
  const [issuedInvoice, setIssuedInvoice] = useState(null);
  const [showDanfe, setShowDanfe] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [countdown, setCountdown] = useState(6);

  // Parâmetros de sessão simulada criptografada
  const sessionId = searchParams.get('session') || `tok_sec_${Date.now().toString(36)}_ecl9482`;
  const nominalPrice = 10.00;
  const gatewayFee = 0.95; // 4.5% + R$ 0,50 fixo
  const netReceived = nominalPrice - gatewayFee;
  const pixCodeMock = '00020126580014br.gov.bcb.pix0136pagbank-ecl-9482-transacao-aprovada-2026520400005303986540510.005802BR5925The Wavem Collective6009JOINVILLE62070503***6304A1B2';
  const boletoLineMock = '23793.38128 60083.010488 56006.333306 9 94820000001000';

  const handleCopy = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleAuthorizePayment = async () => {
    setIsProcessing(true);

    try {
      const methodLabels = {
        pix: 'PIX Instantâneo',
        card: 'Cartão de Crédito',
        boleto: 'Boleto Bancário'
      };

      const order = await claimGameLicense({
        paymentMethod: methodLabels[method] || 'PIX Instantâneo',
        grossAmount: nominalPrice,
        gatewayFee: gatewayFee,
        netAmount: netReceived,
        gatewayProvider: 'PagBank Gateway Enterprise',
        billingName: cardHolder || user?.displayName || user?.email?.split('@')[0] || 'Jogador Registrado'
      });

      setTransactionProtocol(order?.orderProtocol || `PAG-${Date.now().toString().slice(-6)}`);
      setIssuedInvoice(order);
      setIsProcessing(false);
      setIsApproved(true);
    } catch (err) {
      console.error('Erro na autorização do gateway:', err);
      alert('Erro ao autorizar a transação no PagBank. Verifique sua conexão.');
      setIsProcessing(false);
    }
  };

  // Redirecionamento automático suave após aprovação (pausado se a DANFE estiver aberta)
  useEffect(() => {
    let timer;
    if (isApproved && !showDanfe && countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    } else if (isApproved && !showDanfe && countdown === 0) {
      navigate('/biblioteca');
    }
    return () => clearTimeout(timer);
  }, [isApproved, showDanfe, countdown, navigate]);

  return (
    <div className={styles.pageContainer}>
      {/* Header Institucional PagBank */}
      <header className={styles.headerBar}>
        <div className={styles.brandGroup}>
          {/* Símbolo de Círculos / Crescente PagBank */}
          <svg className={styles.logoIcon} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="23" stroke="#00a868" strokeWidth="2" fill="#14171f"/>
            <path d="M16 24C16 19.5817 19.5817 16 24 16C28.4183 16 32 19.5817 32 24C32 28.4183 28.4183 32 24 32" stroke="#00e58d" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="27" cy="21" r="5" fill="#ffd54f"/>
            <circle cx="21" cy="27" r="4" fill="#4dd0e1"/>
          </svg>
          <div className={styles.brandText}>
            <span className={styles.brandName}>PagBank</span>
            <span className={styles.brandSub}>Gateway</span>
          </div>
        </div>

        <div className={styles.securityPill}>
          <LockOutlinedIcon className={styles.sslLock} />
          <span>Ambiente Criptografado TLS 1.3 • Certificado PCI-DSS</span>
        </div>
      </header>

      {/* Barra de Simulação de URL Segura */}
      <div className={styles.urlSecurityBar}>
        <div className={styles.urlSafeLink}>
          <ShieldOutlinedIcon style={{ fontSize: '0.85rem' }} />
          <span>https://gateway.pagbank.com.br/checkout/v3/pay</span>
        </div>
        <div className={styles.tokenHash}>
          Sessão: {sessionId}
        </div>
      </div>

      {/* Conteúdo Principal do Gateway */}
      <main className={styles.mainContent}>
        {!isApproved ? (
          <>
            {/* Card do Estabelecimento e Cobrança */}
            <section className={styles.merchantCard}>
              <div className={styles.merchantLeft}>
                <span className={styles.merchantTag}>Estabelecimento Credenciado</span>
                <h2 className={styles.merchantTitle}></h2>
                <span className={styles.merchantDesc}>Produto: <strong>Eclipse: Ecos do Abismo</strong> (Licença Digital Vitalícia)</span>
              </div>
              <div className={styles.chargeRight}>
                <span className={styles.chargeTag}>Total a Pagar</span>
                <span className={styles.chargeAmount}>R$ {nominalPrice.toFixed(2)}</span>
              </div>
            </section>

            {/* Container de Pagamento */}
            <div className={styles.paymentContainer}>
              {/* Abas de Seleção */}
              <div className={styles.methodTabs}>
                <button 
                  type="button"
                  className={`${styles.tabBtn} ${method === 'pix' ? styles.activeTab : ''}`}
                  onClick={() => setMethod('pix')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <QrCode2OutlinedIcon style={{ fontSize: '1.1rem' }} />
                    <span>PIX Instantâneo</span>
                  </div>
                  <span className={styles.tabBadge}>Aprovação Imediata</span>
                </button>

                <button 
                  type="button"
                  className={`${styles.tabBtn} ${method === 'card' ? styles.activeTab : ''}`}
                  onClick={() => setMethod('card')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CreditCardOutlinedIcon style={{ fontSize: '1.1rem' }} />
                    <span>Cartão de Crédito</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#8fa3b0' }}>Até 2x sem juros</span>
                </button>

                <button 
                  type="button"
                  className={`${styles.tabBtn} ${method === 'boleto' ? styles.activeTab : ''}`}
                  onClick={() => setMethod('boleto')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <ReceiptLongOutlinedIcon style={{ fontSize: '1.1rem' }} />
                    <span>Boleto Bancário</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#8fa3b0' }}>Compensação CIP</span>
                </button>
              </div>

              {/* Área Dinâmica do Método */}
              <div className={styles.methodArea}>
                {method === 'pix' && (
                  <div className={styles.pixPanel}>
                    <div className={styles.qrCodeFrame}>
                      <svg width="128" height="128" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="120" height="120" fill="white" rx="4"/>
                        <rect x="10" y="10" width="30" height="30" rx="3" stroke="#000" strokeWidth="4" fill="none"/>
                        <rect x="18" y="18" width="14" height="14" fill="#000"/>
                        <rect x="80" y="10" width="30" height="30" rx="3" stroke="#000" strokeWidth="4" fill="none"/>
                        <rect x="88" y="18" width="14" height="14" fill="#000"/>
                        <rect x="10" y="80" width="30" height="30" rx="3" stroke="#000" strokeWidth="4" fill="none"/>
                        <rect x="18" y="88" width="14" height="14" fill="#000"/>
                        <rect x="48" y="16" width="6" height="6" fill="#000"/>
                        <rect x="60" y="16" width="6" height="14" fill="#000"/>
                        <rect x="48" y="28" width="8" height="6" fill="#000"/>
                        <rect x="16" y="48" width="12" height="6" fill="#000"/>
                        <rect x="34" y="48" width="6" height="12" fill="#000"/>
                        <rect x="46" y="44" width="16" height="16" rx="3" fill="#00a868"/>
                        <circle cx="54" cy="52" r="3" fill="#fff"/>
                        <rect x="68" y="48" width="12" height="6" fill="#000"/>
                        <rect x="86" y="48" width="6" height="14" fill="#000"/>
                        <rect x="98" y="48" width="8" height="6" fill="#000"/>
                        <rect x="48" y="66" width="8" height="10" fill="#000"/>
                        <rect x="62" y="64" width="12" height="6" fill="#000"/>
                        <rect x="80" y="66" width="6" height="12" fill="#000"/>
                        <rect x="48" y="82" width="14" height="6" fill="#000"/>
                        <rect x="68" y="78" width="6" height="16" fill="#000"/>
                        <rect x="80" y="86" width="14" height="6" fill="#000"/>
                        <rect x="98" y="80" width="8" height="14" fill="#000"/>
                        <rect x="48" y="96" width="6" height="12" fill="#000"/>
                        <rect x="60" y="100" width="16" height="6" fill="#000"/>
                        <rect x="84" y="100" width="10" height="8" fill="#000"/>
                      </svg>
                    </div>

                    <div className={styles.pixCodeBox}>
                      <input 
                        readOnly 
                        value={pixCodeMock} 
                        className={styles.pixCodeInput}
                        title="Chave Pix Copia e Cola" 
                      />
                      <button 
                        type="button" 
                        className={styles.copyButton}
                        onClick={() => handleCopy(pixCodeMock)}
                      >
                        <ContentCopyOutlinedIcon style={{ fontSize: '0.85rem', verticalAlign: 'middle', marginRight: '4px' }} />
                        {copiedCode ? 'Copiado!' : 'Copiar Pix'}
                      </button>
                    </div>

                    <p className={styles.pixInstruction}>
                      Abra o aplicativo de qualquer banco ou carteira digital, escolha a opção <strong>PIX</strong> e aponte a câmera para o QR Code ou copie o código acima. A confirmação de pagamento é recebida pelo PagBank em segundos.
                    </p>
                  </div>
                )}

                {method === 'card' && (
                  <div className={styles.cardPanel}>
                    {/* Visual Mock do Cartão */}
                    <div className={styles.cardPreview}>
                      <div className={styles.cardTopRow}>
                        <div className={styles.chipGold}></div>
                        <span className={styles.cardBrand}>PAGBANK MASTER</span>
                      </div>
                      <div className={styles.cardNumberDisplay}>{cardNumber}</div>
                      <div className={styles.cardBottomRow}>
                        <span>{cardHolder}</span>
                        <span>VAL: {cardExpiry}</span>
                      </div>
                    </div>

                    {/* Formulário */}
                    <div className={styles.cardForm}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Número do Cartão de Crédito</label>
                        <input 
                          type="text" 
                          value={cardNumber} 
                          onChange={(e) => setCardNumber(e.target.value)}
                          className={styles.input} 
                          placeholder="5502 •••• •••• 9842" 
                        />
                      </div>

                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Nome Impresso no Cartão</label>
                        <input 
                          type="text" 
                          value={cardHolder} 
                          onChange={(e) => setCardHolder(e.target.value)}
                          className={styles.input} 
                          placeholder="NOME DO TITULAR" 
                        />
                      </div>

                      <div className={styles.rowInputs}>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Validade (MM/AA)</label>
                          <input 
                            type="text" 
                            value={cardExpiry} 
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className={styles.input} 
                            placeholder="09/29" 
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Código de Segurança (CVV)</label>
                          <input 
                            type="text" 
                            value={cardCvv} 
                            onChange={(e) => setCardCvv(e.target.value)}
                            className={styles.input} 
                            placeholder="412" 
                          />
                        </div>
                      </div>

                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Parcelas</label>
                        <select className={styles.input} defaultValue="1">
                          <option value="1">1x de R$ 10,00 sem juros (À vista)</option>
                          <option value="2">2x de R$ 5,00 sem juros</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {method === 'boleto' && (
                  <div className={styles.boletoPanel}>
                    <div className={styles.boletoLineBox}>{boletoLineMock}</div>
                    <button 
                      type="button" 
                      className={styles.copyButton}
                      onClick={() => handleCopy(boletoLineMock)}
                    >
                      <ContentCopyOutlinedIcon style={{ fontSize: '0.85rem', verticalAlign: 'middle', marginRight: '4px' }} />
                      {copiedCode ? 'Linha Copiada!' : 'Copiar Linha Digitável do Boleto'}
                    </button>
                    <p className={styles.pixInstruction}>
                      O boleto bancário é registrado diretamente pela CIP PagBank. O prazo de compensação bancária é de até 24 horas úteis. O comprovante e a representação gráfica serão enviados para <strong>{user?.email}</strong>.
                    </p>
                  </div>
                )}
              </div>

              {/* Rodapé de Ação */}
              <div className={styles.actionFooter}>
                <button 
                  type="button" 
                  className={styles.btnCancel} 
                  onClick={() => navigate('/loja')}
                  disabled={isProcessing}
                >
                  ← Cancelar e Voltar para a Loja
                </button>
                <button 
                  type="button" 
                  className={styles.btnAuthorize}
                  onClick={handleAuthorizePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processando no PagBank...' : `Autorizar Pagamento (R$ ${nominalPrice.toFixed(2)})`}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Tela de Sucesso Institucional PagBank */
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <CheckCircleOutlineIcon style={{ fontSize: '3rem' }} />
            </div>

            <h2 className={styles.successTitle}>Pagamento Aprovado pelo PagBank</h2>
            
            <div className={styles.protocolBox}>
              Protocolo de Autorização: {transactionProtocol}
            </div>

            <p style={{ fontSize: '0.95rem', color: '#9ba3af', maxWidth: '520px', lineHeight: 1.6, margin: 0 }}>
              A transação de <strong>R$ {nominalPrice.toFixed(2)}</strong> foi compensada e confirmada pelo PagBank. A sua licença digital vitalícia de <strong>Eclipse: Ecos do Abismo</strong> já está ativada no Cloud Firestore.
            </p>

            <div className={styles.receiptDetails}>
              <div className={styles.receiptRow}>
                <span>Estabelecimento:</span>
                <span className={styles.receiptValue}>Collective</span>
              </div>
              <div className={styles.receiptRow}>
                <span>Data e Hora:</span>
                <span className={styles.receiptValue}>{new Date().toLocaleString('pt-BR')}</span>
              </div>
              <div className={styles.receiptRow}>
                <span>Forma de Pagamento:</span>
                <span className={styles.receiptValue}>
                  {method === 'pix' ? 'PIX Instantâneo' : method === 'card' ? 'Cartão de Crédito' : 'Boleto Bancário'}
                </span>
              </div>
              <div className={styles.receiptRow}>
                <span>Valor Total Faturado:</span>
                <span className={styles.receiptValue} style={{ color: '#00e58d' }}>R$ {nominalPrice.toFixed(2)}</span>
              </div>
              <div className={styles.receiptRow}>
                <span>Destinatário da Licença:</span>
                <span className={styles.receiptValue}>{user?.email}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%', maxWidth: '520px', marginTop: '1rem' }}>
              <button 
                type="button" 
                className={styles.btnReturn}
                onClick={() => setShowDanfe(true)}
                style={{ 
                  background: '#161d26', 
                  border: '1px solid #00a868', 
                  color: '#00e58d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontWeight: 600
                }}
              >
                📄 Visualizar DANFE (Nota Fiscal Eletrônica)
              </button>
              
              <button 
                type="button" 
                className={styles.btnReturn}
                onClick={() => navigate('/biblioteca')}
              >
                Acessar Minha Biblioteca e Download ({countdown}s) →
              </button>
            </div>
          </div>
        )}

        {/* Modal de Espelho Visual da DANFE */}
        {showDanfe && issuedInvoice && (
          <DanfeVisualModal 
            invoice={issuedInvoice} 
            onClose={() => setShowDanfe(false)} 
          />
        )}
      </main>

      {/* Footer Institucional da Página */}
      <footer className={styles.footerBar}>
        <div className={styles.footerLinks}>
          <span className={styles.footerLink}>Central de Ajuda PagBank</span>
          <span>•</span>
          <span className={styles.footerLink}>Termos de Uso</span>
          <span>•</span>
          <span className={styles.footerLink}>Política de Privacidade</span>
          <span>•</span>
          <span className={styles.footerLink}>Segurança da Informação</span>
        </div>
        <div>
          PagBank PagSeguro Internet S.A. CNPJ: 08.561.701/0001-01 — Av. Brigadeiro Faria Lima, São Paulo - SP
        </div>
      </footer>
    </div>
  );
};

export default PagBankGatewayPage;
