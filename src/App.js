/*import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import HomePage from './pages/HomePage';
import OrdinaPage from './pages/OrdinaPage';
import OperatorePage from './pages/OperatorePage';
import GestioneMenuPage from './pages/GestioneMenuPage';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 10, background: '#eee' }}>
        <Link to="/">Home</Link> |{' '}
        {/*<Link to="/operatore">Area Operatore</Link>
         <Link to="/gestione-menu">Gestione Menu'</Link>
      //</nav>

      /*<Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ordina" element={<OrdinaPage />} />
        <Route path="/operatore" element={<OperatorePage />} />
         <Route path="/gestione-menu" element={<GestioneMenuPage />} /> 
        <Route path="*" element={<p>Pagina non trovata</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;*/





/*import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import OrdinaPage from './pages/OrdinaPage';
import OperatorePage from './pages/OperatorePage';
import GestioneMenuPage from './pages/GestioneMenuPage';
import LicenseModal from './components/LicenseModal';


function App() {
  const location = useLocation();
  const mostraNavbar = !location.pathname.startsWith('/ordina');

  return (
    <>
   
     <LicenseModal />

      {mostraNavbar && (
        <nav style={{ padding: 10, background: '#eee' }}>
          <Link to="/">Home</Link> |{' '}
          <Link to="/operatore">Area Operatore</Link> |{' '}
          <Link to="/gestione-menu">Gestione Menu'</Link>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ordina" element={<OrdinaPage />} />
        <Route path="/operatore" element={<OperatorePage />} />
        <Route path="/gestione-menu" element={<GestioneMenuPage />} />
        <Route path="*" element={<p>Pagina non trovata</p>} />
      </Routes>
    </>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;


*/





import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import OrdinaPage from './pages/OrdinaPage';
import OperatorePage from './pages/OperatorePage';
import GestioneMenuPage from './pages/GestioneMenuPage';
import LicenseModal from './components/LicenseModal';
import SecurityModal from './components/SecurityModal';

function App() {
  const location = useLocation();
  const mostraNavbar = !location.pathname.startsWith('/ordina');
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // ✅ DEFINISCO LE PAGINE PROTETTE
  const PAGINE_PROTETTE = ['/', '/operatore', '/gestione-menu'];
  const paginaCorrenteProtetta = PAGINE_PROTETTE.includes(location.pathname);

  // ✅ VERIFICA SICUREZZA SOLO ALL'AVVIO
  useEffect(() => {
    console.log('🔄 Verifica sicurezza...');
    
    const ultimoAccesso = localStorage.getItem('ultimoAccesso');
    
    if (!ultimoAccesso) {
      // ✅ PRIMO AVVIO - MOSTRA MODAL
      console.log('🔐 Primo avvio - mostra modal');
      setShowSecurityModal(true);
      setIsAuthorized(false);
    } else {
      // ✅ VERIFICA SE SONO PASSATI 15 MINUTI
      const dataAccesso = new Date(ultimoAccesso);
      const dataOra = new Date();
      const minutiTrascorsi = (dataOra - dataAccesso) / (1000 * 60);
      
      if (minutiTrascorsi > 15) {
        console.log('⌛ Sessione scaduta - mostra modal');
        setShowSecurityModal(true);
        setIsAuthorized(false);
      } else {
        console.log('✅ Sessione valida - accesso autorizzato');
        setIsAuthorized(true);
        setShowSecurityModal(false);
      }
    }
  }, []);

  // ✅ SUCCESSO AUTENTICAZIONE
  const handleAuthSuccess = () => {
    console.log('🎉 Autenticazione riuscita!');
    setIsAuthorized(true);
    setShowSecurityModal(false);
    localStorage.setItem('ultimoAccesso', new Date().toISOString());
  };

  // ✅ LOGOUT
  const handleLogout = () => {
    console.log('🚪 Logout - cancello tutto');
    localStorage.removeItem('ultimoAccesso');
    setIsAuthorized(false);
    setShowSecurityModal(true);
  };

  // ✅ SE NON AUTORIZZATO SU PAGINA PROTETTA, MOSTRA SOLO SECURITY MODAL
  if (paginaCorrenteProtetta && !isAuthorized) {
    return (
      <>
        <LicenseModal />
        <SecurityModal 
          isOpen={showSecurityModal} 
          onSuccess={handleAuthSuccess} 
        />
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          background: '#fff3cd',
          border: '1px solid #ffeaa7'
        }}>
          <h3>🔐 Accesso Richiesto</h3>
          <p>Inserisci il codice di sicurezza per continuare</p>
        </div>
      </>
    );
  }

  // ✅ APP NORMALE SE AUTORIZZATO
  return (
    <>
      <LicenseModal />

      {mostraNavbar && (
        <nav style={{ 
          padding: '15px 20px', 
          background: '#f8f9fa',
          borderBottom: '1px solid #dee2e6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {/* ✅ LINK CENTRATI */}
          <div style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '20px'
          }}>
            <Link 
              to="/" 
              style={{
                textDecoration: 'none',
                color: location.pathname === '/' ? '#007bff' : '#495057',
                fontWeight: location.pathname === '/' ? 'bold' : 'normal',
                fontSize: '16px'
              }}
            >
              Home
            </Link>
            <span style={{ color: '#dee2e6' }}>|</span>
            <Link 
              to="/operatore" 
              style={{
                textDecoration: 'none',
                color: location.pathname === '/operatore' ? '#007bff' : '#495057',
                fontWeight: location.pathname === '/operatore' ? 'bold' : 'normal',
                fontSize: '16px'
              }}
            >
              Area Operatore
            </Link>
            <span style={{ color: '#dee2e6' }}>|</span>
            <Link 
              to="/gestione-menu" 
              style={{
                textDecoration: 'none',
                color: location.pathname === '/gestione-menu' ? '#007bff' : '#495057',
                fontWeight: location.pathname === '/gestione-menu' ? 'bold' : 'normal',
                fontSize: '16px'
              }}
            >
              Gestione Menu
            </Link>
          </div>
          
          {/* ✅ TASTO LOGOUT A DESTRA */}
          <button 
            onClick={handleLogout}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              marginLeft: 'auto'
            }}
          >
            🚪 Logout
          </button>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ordina" element={<OrdinaPage />} />
        <Route path="/operatore" element={<OperatorePage />} />
        <Route path="/gestione-menu" element={<GestioneMenuPage />} />
        <Route path="*" element={<p>Pagina non trovata</p>} />
      </Routes>
    </>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;