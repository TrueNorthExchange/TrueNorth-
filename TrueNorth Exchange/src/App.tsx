import React, { useState, useEffect } from 'react';
import { Search, Globe, ArrowRight, Shield, Zap, Users, TrendingUp, Bitcoin, Feather as Ethereum, X, ArrowUpDown, ChevronDown, AlertTriangle, Play } from 'lucide-react';
import OrderDetailsPage from './components/OrderDetailsPage';
import { fetchTopCryptocurrencies, calculateExchangeRate, formatAmount, CryptoCurrency } from './lib/coingecko';

interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (currency: CryptoCurrency) => void;
  title: string;
  cryptocurrencies: CryptoCurrency[];
}

function CurrencyModal({ isOpen, onClose, onSelect, title, cryptocurrencies }: CurrencyModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const filteredCurrencies = cryptocurrencies.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-700">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-4 bg-gray-800 rounded-lg p-1">
            {['All', 'Top 100', 'DeFi'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Currency List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {filteredCurrencies.slice(0, 50).map((crypto) => (
              <button
                key={crypto.id}
                onClick={() => {
                  onSelect(crypto);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700 hover:border-purple-500"
              >
                <div className="flex items-center space-x-4">
                  {crypto.image ? (
                    <img src={crypto.image} alt={crypto.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className={`w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold ${crypto.color}`}>
                      {crypto.icon}
                    </div>
                  )}
                  <div className="text-left">
                    <div className="font-semibold text-white flex items-center space-x-2">
                      <span>{crypto.symbol}</span>
                      <span className="text-xs text-gray-400">#{crypto.rank}</span>
                    </div>
                    <div className="text-sm text-gray-400">{crypto.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-white">
                    ${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                  </div>
                  <div className={`text-sm ${crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// TradingView Widget Component
function TradingViewWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
      {
        "symbols": [
          {
            "proName": "BITSTAMP:BTCUSD",
            "title": "Bitcoin"
          },
          {
            "proName": "BITSTAMP:ETHUSD",
            "title": "Ethereum"
          },
          {
            "description": "XRP",
            "proName": "BITSTAMP:XRPUSD"
          },
          {
            "description": "BNB",
            "proName": "CRYPTO:BNBUSD"
          },
          {
            "description": "Solana",
            "proName": "CRYPTOCAP:SOL"
          },
          {
            "description": "TRON",
            "proName": "CRYPTOCAP:TRX"
          },
          {
            "description": "Avalanche",
            "proName": "CRYPTOCAP:AVAX"
          },
          {
            "description": "Sui",
            "proName": "CRYPTOCAP:SUI"
          },
          {
            "description": "Chainlink",
            "proName": "CRYPTOCAP:LINK"
          },
          {
            "description": "Toncoin",
            "proName": "CRYPTOCAP:TON"
          },
          {
            "description": "Polkadot",
            "proName": "CRYPTOCAP:DOT"
          },
          {
            "description": "Aptos",
            "proName": "CRYPTOCAP:APTO"
          },
          {
            "description": "Ethena",
            "proName": "CRYPTO:ENAUSD"
          },
          {
            "description": "Cosmos Hub",
            "proName": "CRYPTOCAP:ATOM"
          }
        ],
        "showSymbolLogo": true,
        "isTransparent": true,
        "displayMode": "adaptive",
        "colorTheme": "dark",
        "locale": "en"
      }
    `;

    const container = document.querySelector('.tradingview-widget-container__widget');
    if (container) {
      container.appendChild(script);
    }

    return () => {
      // Cleanup function to remove script when component unmounts
      if (container && container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container">
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState('');
  const [cryptocurrencies, setCryptocurrencies] = useState<CryptoCurrency[]>([]);
  const [sendCurrency, setSendCurrency] = useState<CryptoCurrency | null>(null);
  const [receiveCurrency, setReceiveCurrency] = useState<CryptoCurrency | null>(null);
  const [sendAmount, setSendAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [orderType, setOrderType] = useState('Floating');
  const [modalOpen, setModalOpen] = useState<'send' | 'receive' | null>(null);
  const [currentPage, setCurrentPage] = useState<'main' | 'order-details'>('main');
  const [warningExpanded, setWarningExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load cryptocurrencies on component mount
  useEffect(() => {
    const loadCryptocurrencies = async () => {
      setIsLoading(true);
      try {
        const cryptos = await fetchTopCryptocurrencies();
        setCryptocurrencies(cryptos);
        
        // Set default currencies
        if (cryptos.length > 0) {
          setSendCurrency(cryptos.find(c => c.symbol === 'BTC') || cryptos[0]);
          setReceiveCurrency(cryptos.find(c => c.symbol === 'ETH') || cryptos[1]);
        }
      } catch (error) {
        console.error('Failed to load cryptocurrencies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCryptocurrencies();
  }, []);

  // Calculate exchange rate when currencies or send amount changes
  useEffect(() => {
    if (sendCurrency && receiveCurrency && sendAmount && !isNaN(Number(sendAmount))) {
      const rate = calculateExchangeRate(sendCurrency, receiveCurrency, Number(sendAmount));
      setReceiveAmount(formatAmount(rate));
    } else if (!sendAmount) {
      setReceiveAmount('');
    }
  }, [sendCurrency, receiveCurrency, sendAmount]);

  // Calculate reverse exchange rate when receive amount changes
  useEffect(() => {
    if (sendCurrency && receiveCurrency && receiveAmount && !isNaN(Number(receiveAmount))) {
      const rate = calculateExchangeRate(receiveCurrency, sendCurrency, Number(receiveAmount));
      setSendAmount(formatAmount(rate));
    }
  }, [receiveAmount]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero-section', 'aml-policy', 'exchange-form', 'how-it-works', 'advantages', 'popular-currencies'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const swapCurrencies = () => {
    if (sendCurrency && receiveCurrency) {
      const tempCurrency = sendCurrency;
      const tempAmount = sendAmount;
      setSendCurrency(receiveCurrency);
      setReceiveCurrency(tempCurrency);
      setSendAmount(receiveAmount);
      setReceiveAmount(tempAmount);
    }
  };

  const handleStartExchange = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Validate that amounts are entered
    if (!sendAmount || !receiveAmount) {
      alert('Please enter both send and receive amounts before proceeding.');
      return;
    }
    
    if (!sendCurrency || !receiveCurrency) {
      alert('Please select both currencies before proceeding.');
      return;
    }
    
    // Force navigation to order details page
    console.log('Navigating to order details page...');
    setCurrentPage('order-details');
  };

  const handleBackToCalculator = () => {
    console.log('Navigating back to main page...');
    setCurrentPage('main');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading cryptocurrencies...</p>
        </div>
      </div>
    );
  }

  // Render Order Details Page
  if (currentPage === 'order-details' && sendCurrency && receiveCurrency) {
    console.log('Rendering Order Details Page');
    return (
      <OrderDetailsPage
        sendCurrency={sendCurrency}
        receiveCurrency={receiveCurrency}
        sendAmount={sendAmount}
        receiveAmount={receiveAmount}
        orderType={orderType}
        onBack={handleBackToCalculator}
      />
    );
  }

  // Render Main Page
  console.log('Rendering Main Page');
  return (
    <div className="bg-gray-900 text-white">
      {/* Fixed Background Image */}
      <div 
        className="fixed top-0 left-0 w-full h-screen z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(/0001.png)'
        }}
      />

      {/* Fixed Navigation */}
      <nav className="fixed top-0 right-0 p-6 flex items-center space-x-8 z-30">
        <button
          onClick={() => scrollToSection('how-it-works')}
          className={`text-white hover:text-purple-400 transition-colors duration-300 ${
            activeSection === 'how-it-works' ? 'text-purple-400' : ''
          }`}
        >
          How It Works
        </button>
        <button
          onClick={() => scrollToSection('advantages')}
          className={`text-white hover:text-purple-400 transition-colors duration-300 ${
            activeSection === 'advantages' ? 'text-purple-400' : ''
          }`}
        >
          Advantages
        </button>
        <button
          onClick={() => scrollToSection('popular-currencies')}
          className={`text-white hover:text-purple-400 transition-colors duration-300 ${
            activeSection === 'popular-currencies' ? 'text-purple-400' : ''
          }`}
        >
          Popular Currencies
        </button>
      </nav>

      {/* Fixed Logo in Top Left */}
      <div className="fixed top-6 left-6 z-30">
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 drop-shadow-lg">
          TrueNorth Exchange
        </h1>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-20">
        {/* Hero Section - Now Scrollable */}
        <section id="hero-section" className="min-h-screen flex items-center justify-center py-20" style={{ backgroundColor: 'rgba(17, 24, 39, 0.36)' }}>
          <div className="text-center max-w-4xl px-6">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Instant Exchange of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-green-400">
                500+
              </span>{' '}
              cryptocurrency directions{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-400">
                without registration
              </span>
            </h1>
            <p className="text-xl md:text-2xl mt-8 text-gray-300">
              Fast, secure, and anonymous crypto exchanges at the best rates
            </p>
            <button 
              onClick={() => scrollToSection('exchange-form')}
              className="mt-12 bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white px-12 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Start Exchange
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </button>
          </div>
        </section>

        {/* AML Policy Section - Moved to the beginning */}
        <section id="aml-policy" className="py-20" style={{ backgroundColor: 'rgba(31, 41, 55, 0.36)' }}>
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto bg-gray-800/38 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700">
              <h2 className="text-3xl font-bold mb-8 text-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-green-400">
                  Exchange Operation Procedure
                </span>
              </h2>
              
              <div className="space-y-6">
                {/* Main Text */}
                <div className="text-gray-300 leading-relaxed text-lg">
                  <p>
                    This operation is performed automatically. The final rate is fixed upon reaching{' '}
                    <span className="font-bold text-purple-400">2 confirmations</span>{' '}
                    on the network and within two additional minutes after funds are credited to the service's balance. 
                    Re-calculation of applications only occurs downwards. If quotes fall by more than 0.2% on the WhiteBit exchange, 
                    the automatic system changes the exchange rate in favor of the exchange point by up to 1.5% of the market rate of that exchange.
                  </p>
                </div>

                {/* Important AML Note */}
                <div className="bg-gradient-to-r from-purple-900/30 to-green-900/30 border-2 border-purple-500/50 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <Shield className="w-8 h-8 text-purple-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-purple-400 mb-3">AML Policy Compliance</h3>
                      <p className="text-white font-bold text-lg leading-relaxed">
                        In this regard, the service adheres to the AML policy. High-risk transactions will be suspended until identity verification.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interactive Warning Block */}
                <div className="bg-gray-900/38 backdrop-blur-sm rounded-xl border border-gray-600 overflow-hidden">
                  <button
                    onClick={() => setWarningExpanded(!warningExpanded)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-red-900/30 p-3 rounded-full border border-red-500/50">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-lg font-bold text-red-400">
                          Funds from Bitpara and Capitalist platforms are blocked
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">
                          Click to {warningExpanded ? 'collapse' : 'expand'} details
                        </p>
                      </div>
                    </div>
                    <div className={`transform transition-transform duration-300 ${warningExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                  
                  {/* Expandable Content */}
                  <div className={`overflow-hidden transition-all duration-300 ${warningExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-6 pb-6 bg-red-900/10 border-t border-red-500/20">
                      <div className="space-y-4 text-gray-300">
                        <p className="text-red-300 font-semibold">
                          ⚠️ Important Security Notice
                        </p>
                        <p>
                          Transactions originating from Bitpara and Capitalist platforms are automatically flagged and blocked 
                          due to enhanced security protocols and compliance requirements.
                        </p>
                        <p>
                          If you have funds from these platforms, please contact our support team for alternative exchange options 
                          and verification procedures.
                        </p>
                        <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30">
                          <p className="text-sm text-red-200">
                            <strong>Note:</strong> This measure is implemented to ensure compliance with international 
                            anti-money laundering regulations and to protect all users of our platform.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Security Information */}
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-gray-900/38 backdrop-blur-sm p-6 rounded-xl border border-gray-600">
                    <div className="flex items-center space-x-3 mb-4">
                      <Shield className="w-6 h-6 text-green-400" />
                      <h4 className="text-lg font-semibold text-green-400">Automated Screening</h4>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      All transactions undergo automatic AML screening using advanced blockchain analysis tools 
                      to ensure compliance and security.
                    </p>
                  </div>
                  
                  <div className="bg-gray-900/38 backdrop-blur-sm p-6 rounded-xl border border-gray-600">
                    <div className="flex items-center space-x-3 mb-4">
                      <Users className="w-6 h-6 text-purple-400" />
                      <h4 className="text-lg font-semibold text-purple-400">Identity Verification</h4>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      High-risk transactions may require additional identity verification to comply with 
                      regulatory requirements and ensure platform security.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Exchange Form Section */}
        <section id="exchange-form" className="py-20" style={{ backgroundColor: 'rgba(17, 24, 39, 0.36)' }}>
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto bg-gray-900/38 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700">
              <h2 className="text-3xl font-bold text-center mb-8">Exchange Cryptocurrencies</h2>
              
              <div className="space-y-6">
                {/* You Send */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-300">You Send</label>
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-600">
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        placeholder="0.00"
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        className="bg-transparent text-3xl font-bold outline-none flex-1 text-white placeholder-gray-500"
                      />
                      <button
                        onClick={() => setModalOpen('send')}
                        className="flex items-center space-x-3 bg-gray-700 hover:bg-gray-600 rounded-xl px-4 py-3 transition-colors border border-gray-600 hover:border-purple-500"
                      >
                        {sendCurrency?.image ? (
                          <img src={sendCurrency.image} alt={sendCurrency.name} className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className={`w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-lg font-bold ${sendCurrency?.color || 'text-white'}`}>
                            {sendCurrency?.icon || '?'}
                          </div>
                        )}
                        <div className="text-left">
                          <div className="font-semibold text-white">{sendCurrency?.symbol || 'Select'}</div>
                          <div className="text-xs text-gray-400">{sendCurrency?.name || 'Currency'}</div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <button
                    onClick={swapCurrencies}
                    className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg"
                  >
                    <ArrowUpDown className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* You Receive */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-300">You Receive</label>
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-600">
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        placeholder="0.00"
                        value={receiveAmount}
                        onChange={(e) => setReceiveAmount(e.target.value)}
                        className="bg-transparent text-3xl font-bold outline-none flex-1 text-white placeholder-gray-500"
                      />
                      <button
                        onClick={() => setModalOpen('receive')}
                        className="flex items-center space-x-3 bg-gray-700 hover:bg-gray-600 rounded-xl px-4 py-3 transition-colors border border-gray-600 hover:border-purple-500"
                      >
                        {receiveCurrency?.image ? (
                          <img src={receiveCurrency.image} alt={receiveCurrency.name} className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className={`w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-lg font-bold ${receiveCurrency?.color || 'text-white'}`}>
                            {receiveCurrency?.icon || '?'}
                          </div>
                        )}
                        <div className="text-left">
                          <div className="font-semibold text-white">{receiveCurrency?.symbol || 'Select'}</div>
                          <div className="text-xs text-gray-400">{receiveCurrency?.name || 'Currency'}</div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Type */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-300">Order Type</label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="Floating">Floating</option>
                    <option value="Fixed">Fixed</option>
                  </select>
                </div>

                {/* Start Exchange Button - CRITICAL FIX */}
                <button 
                  type="button"
                  onClick={handleStartExchange}
                  className="w-full mt-8 bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white py-4 rounded-xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
                  style={{ pointerEvents: 'auto' }}
                >
                  Start Exchange
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </button>
              </div>

              {/* Important Information */}
              <div className="mt-8 space-y-4 text-sm text-gray-400 leading-relaxed">
                <p>
                  The final exchange rate is determined only after the order is paid. An order is considered paid after the required number of confirmations is received on the network, along with an additional period (up to 4 minutes) for the full crediting of funds to the service's liquidity provider's balance.
                </p>
                <p>
                  If the exchange rate changes by more than 0.00% before the execution begins, the order will be automatically recalculated based on the current market rate (according to data from KuCoin, HTX).
                </p>
                <p>
                  Detailed conditions can be found in clause 8.1 of the Terms of Use.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cryptocurrency Converter Section - MOVED TO FIRST POSITION */}
        <section className="py-20" style={{ backgroundColor: 'rgba(31, 41, 55, 0.36)' }}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Cryptocurrency Converter</h2>
              <p className="text-xl text-gray-400">Convert any cryptocurrency in real-time</p>
            </div>
            <div className="max-w-4xl mx-auto bg-gray-900/38 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700">
              <script src="https://widgets.coingecko.com/gecko-coin-converter-widget.js"></script>
              <gecko-coin-converter-widget 
                locale="en" 
                dark-mode="true" 
                transparent-background="true" 
                outlined="true" 
                initial-currency="usd">
              </gecko-coin-converter-widget>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20" style={{ backgroundColor: 'rgba(17, 24, 39, 0.36)' }}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-gray-400">4 simple steps</p>
            </div>
            
            {/* 4 Steps Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 01 */}
              <div className="text-center group">
                <div className="bg-gradient-to-r from-purple-600 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl font-bold text-white">01</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Select Exchange Pair</h3>
                <p className="text-gray-400 leading-relaxed">
                  Select your preferred exchange pair from our extensive list of 500+ supported cryptocurrencies.
                </p>
              </div>

              {/* Step 02 */}
              <div className="text-center group">
                <div className="bg-gradient-to-r from-purple-600 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl font-bold text-white">02</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Specify Wallet Address</h3>
                <p className="text-gray-400 leading-relaxed">
                  Specify your wallet address to receive funds and provide your email for transaction updates.
                </p>
              </div>

              {/* Step 03 */}
              <div className="text-center group">
                <div className="bg-gradient-to-r from-purple-600 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl font-bold text-white">03</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Make Payment</h3>
                <p className="text-gray-400 leading-relaxed">
                  Make the payment following the detailed instructions provided in your email confirmation.
                </p>
              </div>

              {/* Step 04 */}
              <div className="text-center group">
                <div className="bg-gradient-to-r from-purple-600 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl font-bold text-white">04</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Receive Funds</h3>
                <p className="text-gray-400 leading-relaxed">
                  Relax and wait for the funds to arrive in your wallet within minutes of confirmation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section id="advantages" className="py-20" style={{ backgroundColor: 'rgba(31, 41, 55, 0.36)' }}>
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16">Why Choose Us</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gray-900/38 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors duration-300">
                <Shield className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Secure & Safe</h3>
                <p className="text-gray-400">Advanced security protocols protect your transactions and personal data.</p>
              </div>
              <div className="bg-gray-900/38 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors duration-300">
                <Zap className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
                <p className="text-gray-400">Complete exchanges in minutes with our optimized trading engine.</p>
              </div>
              <div className="bg-gray-900/38 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors duration-300">
                <Users className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-3">No Registration</h3>
                <p className="text-gray-400">Start trading immediately without lengthy verification processes.</p>
              </div>
              <div className="bg-gray-900/38 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors duration-300">
                <TrendingUp className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Best Rates</h3>
                <p className="text-gray-400">Competitive exchange rates with transparent fee structure.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Currencies Section */}
        <section id="popular-currencies" className="py-20" style={{ backgroundColor: 'rgba(17, 24, 39, 0.36)' }}>
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16">Popular Currencies</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cryptocurrencies.slice(0, 8).map((coin, index) => (
                <div key={index} className="bg-gray-800/38 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    {coin.image ? (
                      <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className={`w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center ${coin.color} text-lg font-bold`}>
                        {coin.icon}
                      </div>
                    )}
                    <span className={`text-sm font-semibold ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">{coin.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{coin.symbol}</p>
                  <p className="text-xl font-bold">${coin.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Market Ticker Section - MOVED TO BOTTOM */}
        <section className="py-8 border-t border-gray-700" style={{ backgroundColor: 'rgba(17, 24, 39, 0.5)' }}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-200 mb-2">Live Market Ticker</h2>
              <p className="text-sm text-gray-400">Real-time cryptocurrency prices</p>
            </div>
            <div className="max-w-full mx-auto overflow-hidden rounded-xl border border-gray-700">
              <TradingViewWidget />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-700" style={{ backgroundColor: 'rgba(17, 24, 39, 0.36)' }}>
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Left Column - About Us/Support */}
              <div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-4">
                    TrueNorth Exchange
                  </h3>
                </div>
                <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-purple-400">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                    </div>
                    <a href="mailto:admin@truenorthexchange.com" className="text-gray-300 hover:text-purple-400 transition-colors">
                      admin@truenorthexchange.com
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-purple-400">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                      Telegram
                    </a>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-gray-300 font-semibold">Holder Rank</span>
                    <span className="text-yellow-400 font-bold">5.0</span>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 text-yellow-400">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle Column - Documentation */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-white">Documentation</h4>
                <ul className="space-y-3">
                  <li><a href="terms-of-use.html" className="text-gray-300 hover:text-purple-400 transition-colors">Terms of Use</a></li>
                  <li><a href="privacy-policy.html" className="text-gray-300 hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                  <li><a href="aml-policy.html" className="text-gray-300 hover:text-purple-400 transition-colors">AML / KYC</a></li>
                </ul>
                <div className="mt-6">
                  <p className="text-gray-400 text-sm font-medium">For Competent Authorities</p>
                </div>
              </div>

              {/* Right Column - Partners/Ratings with PRECISE LAYOUT */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-white">Partners & Ratings</h4>
                
                {/* Grid with 2 columns and 3 rows - PRECISE CONTAINER SHAPES */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Row 1 */}
                  {/* Left: Rectangular container (3:1 ratio) */}
                  <div className="group relative">
                    <div className="bg-gray-800/50 border border-gray-600 rounded-lg overflow-hidden transition-all duration-300 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
                         style={{ aspectRatio: '3/1', height: '48px' }}>
                      <img 
                        src="/21.png" 
                        alt="CoiNSmart" 
                        className="w-full h-full object-contain p-1"
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      <span className="font-bold">CoiNSmart</span>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-600"></div>
                    </div>
                  </div>
                  
                  {/* Right: Square container (1:1 ratio) */}
                  <div className="group relative">
                    <div className="bg-gray-800/50 border border-gray-600 rounded-lg overflow-hidden transition-all duration-300 hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/20 hover:scale-105"
                         style={{ aspectRatio: '1/1', height: '48px' }}>
                      <img 
                        src="/12 copy.png" 
                        alt="CryptoHub Exchange" 
                        className="w-full h-full object-contain p-1"
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      <span className="font-bold">CryptoHub Exchange</span>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-teal-600"></div>
                    </div>
                  </div>

                  {/* Row 2 */}
                  {/* Left: Rectangular container (3:1 ratio) */}
                  <div className="group relative">
                    <div className="bg-gray-800/50 border border-gray-600 rounded-lg overflow-hidden transition-all duration-300 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20 hover:scale-105"
                         style={{ aspectRatio: '3/1', height: '48px' }}>
                      <img 
                        src="/22.png" 
                        alt="Ndax" 
                        className="w-full h-full object-contain p-1"
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      <span className="font-bold">Ndax</span>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-600"></div>
                    </div>
                  </div>
                  
                  {/* Right: Square container (1:1 ratio) */}
                  <div className="group relative">
                    <div className="bg-gray-800/50 border border-gray-600 rounded-lg overflow-hidden transition-all duration-300 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-105"
                         style={{ aspectRatio: '1/1', height: '48px' }}>
                      <img 
                        src="/13 copy.png" 
                        alt="Digital Assets Pro" 
                        className="w-full h-full object-contain p-1"
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      <span className="font-bold">Digital Assets Pro</span>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-emerald-600"></div>
                    </div>
                  </div>

                  {/* Row 3 */}
                  {/* Left: Rectangular container (3:1 ratio) */}
                  <div className="group relative">
                    <div className="bg-gray-800/50 border border-gray-600 rounded-lg overflow-hidden transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 hover:scale-105"
                         style={{ aspectRatio: '3/1', height: '48px' }}>
                      <img 
                        src="/23.png" 
                        alt="BitBuy" 
                        className="w-full h-full object-contain p-1"
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      <span className="font-bold">BitBuy</span>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-orange-600"></div>
                    </div>
                  </div>
                  
                  {/* Right: Square container (1:1 ratio) */}
                  <div className="group relative">
                    <div className="bg-gray-800/50 border border-gray-600 rounded-lg overflow-hidden transition-all duration-300 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-105"
                         style={{ aspectRatio: '1/1', height: '48px' }}>
                      <img 
                        src="/11 copy.png" 
                        alt="BlockTrade Network" 
                        className="w-full h-full object-contain p-1"
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      <span className="font-bold">BlockTrade Network</span>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-indigo-600"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
              <p>&copy; 2025 TrueNorth Exchange. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Currency Selection Modals */}
      <CurrencyModal
        isOpen={modalOpen === 'send'}
        onClose={() => setModalOpen(null)}
        onSelect={setSendCurrency}
        title="Select Currency to Send"
        cryptocurrencies={cryptocurrencies}
      />
      <CurrencyModal
        isOpen={modalOpen === 'receive'}
        onClose={() => setModalOpen(null)}
        onSelect={setReceiveCurrency}
        title="Select Currency to Receive"
        cryptocurrencies={cryptocurrencies}
      />
    </div>
  );
}

export default App;