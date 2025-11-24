/*import React, { useState, useEffect } from 'react';
import './LicenseModal.css';

const LicenseModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [licenseStatus, setLicenseStatus] = useState(null);

  useEffect(() => {
    checkLicense();
  }, []);

  const checkLicense = async () => {
    try {
      console.log('🔍 Frontend: Inizio verifica licenza...');
      
      const response = await fetch('https://qrcode-finale.onrender.com/api/license/status');
      const data = await response.json();
      
      console.log('📊 Frontend: Dati ricevuti:', data);
      console.log('🔑 Frontend: valid value:', data.license?.valid);
      console.log('📝 Frontend: full license object:', data.license);
      
      setLicenseStatus(data);
      
      // ✅ CORREGGI: controlla data.license.valid invece di data.valid
      if (!data.license?.valid) {
        console.log('🚫 Frontend: Licenza non valida - Mostro modal');
        setShowModal(true);
      } else {
        console.log('✅ Frontend: Licenza valida - Nascondo modal');
        setShowModal(false);
      }
      
    } catch (error) {
      console.error('❌ Frontend: Errore verifica licenza:', error);
    }
  };

  if (!showModal) return null;

  return (
    <div className="license-modal-overlay">
      <div className="license-modal">
        <div className="modal-header">
          <h2>⚠️ Problema Licenza</h2>
        </div>
        <div className="modal-content">
          <div className="license-details">
            <p><strong>Stato:</strong> {licenseStatus?.license?.valid ? 'Valida' : 'Non Valida'}</p>
            <p><strong>Motivo:</strong> {licenseStatus?.license?.reason || 'Nessun motivo specificato'}</p>
            <p><strong>Tipo:</strong> {licenseStatus?.license?.type || 'N/A'}</p>
            <p><strong>Giorni rimanenti:</strong> {licenseStatus?.license?.daysRemaining || '0'}</p>
          </div>
          
          <div className="action-buttons">
            <button onClick={() => window.location.reload()} className="btn-retry">
              🔄 Ricarica Pagina
            </button>
            <button onClick={() => setShowModal(false)} className="btn-close">
              ❌ Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicenseModal;






*/





/*import React, { useState, useEffect, useCallback } from 'react';
import './LicenseModal.css';

const LicenseModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [licenseStatus, setLicenseStatus] = useState(null);
  const [modalType, setModalType] = useState(''); // 'expired' o 'expiring'

  const shouldShowExpiringWarning = useCallback((daysRemaining) => {
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem('licenseWarningLastShown');
    
    // Mostra solo se:
    // 1. Mancano 5 giorni o meno
    // 2. Non è già stato mostrato oggi
    return daysRemaining <= 5 && lastShown !== today;
  }, []);

  // ✅ USA useCallback PER EVITARE RICREAZIONE AD OGNI RENDER
  const checkLicense = useCallback(async () => {
    try {
      console.log('🔍 Frontend: Inizio verifica licenza...');
      
      const response = await fetch('https://qrcode-finale.onrender.com/api/license/status');
      const data = await response.json();
      
      console.log('📊 Frontend: Dati ricevuti:', data);
      console.log('🔑 Frontend: valid value:', data.license?.valid);
      console.log('📝 Frontend: full license object:', data.license);
      
      setLicenseStatus(data);
      
      const daysRemaining = data.license?.daysRemaining || 0;
      const isValid = data.license?.valid;
      
      if (!isValid) {
        // 🚫 LICENZA SCADUTA
        console.log('🚫 Frontend: Licenza non valida - Mostro modal');
        setModalType('expired');
        setShowModal(true);
      } else if (shouldShowExpiringWarning(daysRemaining)) {
        // ⚠️ LICENZA IN SCADENZA (5 giorni o meno)
        console.log(`⚠️ Frontend: Licenza in scadenza (${daysRemaining} giorni) - Mostro avviso`);
        setModalType('expiring');
        setShowModal(true);
        
        // Salva che è stato mostrato oggi
        localStorage.setItem('licenseWarningLastShown', new Date().toDateString());
      } else {
        console.log('✅ Frontend: Licenza valida - Nascondo modal');
        setShowModal(false);
      }
      
    } catch (error) {
      console.error('❌ Frontend: Errore verifica licenza:', error);
    }
  }, [shouldShowExpiringWarning]);

  useEffect(() => {
    checkLicense();
  }, [checkLicense]); // ✅ ORA checkLicense È STABILE

  const handleClose = () => {
    setShowModal(false);
    
    if (modalType === 'expiring') {
      // Per l'avviso di scadenza, puoi chiudere
      console.log('ℹ️ Avviso scadenza chiuso dall\'utente');
    }
    // Per la licenza scaduta, non permettere la chiusura
    // (rimane visibile finché non viene risolta)
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'expired':
        return '🚫 Licenza Scaduta';
      case 'expiring':
        return '⚠️ Licenza in Scadenza';
      default:
        return '⚠️ Problema Licenza';
    }
  };

  const getModalMessage = () => {
    const daysRemaining = licenseStatus?.license?.daysRemaining || 0;
    
    switch (modalType) {
      case 'expired':
        return (
          <div className="license-message expired">
            <p><strong>La tua licenza è scaduta!</strong></p>
            <p>Il sistema potrebbe smettere di funzionare. Contatta il supporto per rinnovare la licenza.</p>
          </div>
        );
      case 'expiring':
        return (
          <div className="license-message expiring">
            <p><strong>La tua licenza scadrà tra {daysRemaining} giorni</strong></p>
            <p>Ricordati di rinnovare la licenza per continuare a utilizzare il sistema senza interruzioni.</p>
            <p className="note">(Questo avviso apparirà solo una volta al giorno)</p>
          </div>
        );
      default:
        return <p>Si è verificato un problema con la licenza.</p>;
    }
  };

  if (!showModal) return null;

  return (
    <div className="license-modal-overlay">
      <div className={`license-modal ${modalType}`}>
        <div className="modal-header">
          <h2>{getModalTitle()}</h2>
        </div>
        <div className="modal-content">
          <div className="license-details">
            {getModalMessage()}
            
            <div className="license-info">
              <p><strong>Stato:</strong> 
                <span className={licenseStatus?.license?.valid ? 'status-valid' : 'status-invalid'}>
                  {licenseStatus?.license?.valid ? 'Valida' : 'Non Valida'}
                </span>
              </p>
              <p><strong>Tipo Licenza:</strong> {licenseStatus?.license?.type || 'N/A'}</p>
              <p><strong>Giorni rimanenti:</strong> 
                <span className={licenseStatus?.license?.daysRemaining <= 5 ? 'days-warning' : 'days-normal'}>
                  {licenseStatus?.license?.daysRemaining || '0'}
                </span>
              </p>
              {licenseStatus?.license?.expiryDate && (
                <p><strong>Data scadenza:</strong> {new Date(licenseStatus.license.expiryDate).toLocaleDateString('it-IT')}</p>
              )}
            </div>
          </div>
          
          <div className="action-buttons">
            {modalType === 'expiring' && (
              <button onClick={handleClose} className="btn-close">
                ✅ Ho Capito
              </button>
            )}
            
            {modalType === 'expired' && (
              <>
                <button onClick={() => window.location.reload()} className="btn-retry">
                  🔄 Ricarica Pagina
                </button>
                <button onClick={() => window.open('mailto:support@example.com?subject=Rinnovo Licenza', '_blank')} className="btn-support">
                  📧 Contatta Supporto
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicenseModal;


*/














// FUNZIONANTE. 
/*import React, { useState, useEffect, useCallback } from 'react';
import './LicenseModal.css';

const LicenseModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [licenseStatus, setLicenseStatus] = useState(null);
  const [modalType, setModalType] = useState(''); // 'expired' o 'expiring'

  // ✅ FUNZIONE CON CONTROLLO "UNA VOLTA AL GIORNO"
  const shouldShowExpiringWarning = useCallback((daysRemaining) => {
    const today = new Date().toDateString();
    const lastShownData = localStorage.getItem('licenseWarningLastShown');
    
    console.log('🔍 DEBUG shouldShowExpiringWarning:', {
      daysRemaining,
      today,
      lastShownData
    });

    // Se mancano più di 5 giorni, non mostrare
    if (daysRemaining > 5) {
      console.log('❌ DEBUG: Più di 5 giorni - NON mostro');
      return false;
    }

    // Se non è mai stato mostrato, mostra
    if (!lastShownData) {
      console.log('✅ DEBUG: Primo avviso - MOSTRO');
      return true;
    }

    // Controlla se è già stato mostrato oggi
    const lastShownDate = JSON.parse(lastShownData).date;
    const alreadyShownToday = lastShownDate === today;
    
    console.log('📅 DEBUG Controllo data:', {
      lastShownDate,
      today,
      alreadyShownToday,
      shouldShow: !alreadyShownToday
    });

    // Mostra solo se NON è stato mostrato oggi
    return !alreadyShownToday;
  }, []);

  // ✅ VERIFICA LICENZA CON FIX PER LA VISUALIZZAZIONE
  const checkLicense = useCallback(async () => {
    try {
      console.log('🚀 INIZIO checkLicense');
      
      const response = await fetch('https://qrcode-finale.onrender.com/api/license/status');
      const data = await response.json();
      
      console.log('📊 DATI LICENZA:', data);
      
      setLicenseStatus(data);
      
      const daysRemaining = data.license?.daysRemaining || 0;
      const isValid = data.license?.valid;
      
      console.log('🎯 VALORI ESTRATTI:', {
        isValid,
        daysRemaining
      });
      
      if (!isValid) {
        // 🚫 LICENZA SCADUTA - mostra SEMPRE
        console.log('🚫 SCADUTA - Mostro modal scaduta');
        setModalType('expired');
        setShowModal(true);
        console.log('🎯 IMPOSTATO: showModal = true (scaduta)');
      } else if (shouldShowExpiringWarning(daysRemaining)) {
        // ⚠️ LICENZA IN SCADENZA - mostra solo una volta al giorno
        console.log(`⚠️ SCADENZA TRA ${daysRemaining} GIORNI - Mostro modal`);
        setModalType('expiring');
        setShowModal(true);
        console.log('🎯 IMPOSTATO: showModal = true (scadenza)');
        
        // Salva che è stato mostrato oggi
        const warningData = {
          date: new Date().toDateString(),
          daysRemaining: daysRemaining
        };
        localStorage.setItem('licenseWarningLastShown', JSON.stringify(warningData));
        console.log('💾 SALVATO DATA:', warningData);
      } else {
        console.log('✅ LICENZA VALIDA - Modal già mostrato oggi');
        setShowModal(false);
        console.log('🎯 IMPOSTATO: showModal = false (già mostrato)');
      }
      
    } catch (error) {
      console.error('❌ ERRORE:', error);
    }
  }, [shouldShowExpiringWarning]);

  useEffect(() => {
    console.log('🔄 useEffect - Chiamata iniziale');
    checkLicense();
    
    const interval = setInterval(() => {
      console.log('⏰ Verifica periodica');
      checkLicense();
    }, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [checkLicense]);

  // ✅ FIX: Aggiungi questo useEffect per debug dello stato
  useEffect(() => {
    console.log('🔍 EFFECT - Stato aggiornato:', {
      showModal,
      modalType,
      licenseStatus: !!licenseStatus
    });
  }, [showModal, modalType, licenseStatus]);

  const handleClose = () => {
    console.log('❌ Modal chiuso');
    setShowModal(false);
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'expired':
        return '🚫 Licenza Scaduta';
      case 'expiring':
        return '⚠️ Licenza in Scadenza';
      default:
        return '⚠️ Problema Licenza';
    }
  };

  const getModalMessage = () => {
    const daysRemaining = licenseStatus?.license?.daysRemaining || 0;
    
    switch (modalType) {
      case 'expired':
        return (
          <div className="license-message expired">
            <p><strong>La tua licenza è scaduta!</strong></p>
            <p>Il sistema potrebbe smettere di funzionare. Contatta il supporto per rinnovare la licenza.</p>
          </div>
        );
      case 'expiring':
        return (
          <div className="license-message expiring">
            <p><strong>La tua licenza scadrà tra {daysRemaining} giorni</strong></p>
            <p>Ricordati di rinnovare la licenza per continuare a utilizzare il sistema senza interruzioni.</p>
            <p className="note">(Questo avviso apparirà solo una volta al giorno)</p>
          </div>
        );
      default:
        return <p>Si è verificato un problema con la licenza.</p>;
    }
  };

  console.log('🎨 RENDER - showModal:', showModal, 'modalType:', modalType);

  if (!showModal) {
    console.log('🚫 RENDER: Modal nascosto');
    return null;
  }

  console.log('✅ RENDER: Modal visibile - MOSTRANDO MODAL');

  return (
    <div className="license-modal-overlay">
      <div className={`license-modal ${modalType}`}>
        <div className="modal-header">
          <h2>{getModalTitle()}</h2>
          <button onClick={handleClose} className="close-button">×</button>
        </div>
        <div className="modal-content">
          <div className="license-details">
            {getModalMessage()}
            
            <div className="license-info">
              <p><strong>Stato:</strong> 
                <span className={licenseStatus?.license?.valid ? 'status-valid' : 'status-invalid'}>
                  {licenseStatus?.license?.valid ? 'Valida' : 'Non Valida'}
                </span>
              </p>
              <p><strong>Tipo Licenza:</strong> {licenseStatus?.license?.type || 'N/A'}</p>
              <p><strong>Giorni rimanenti:</strong> 
                <span className={licenseStatus?.license?.daysRemaining <= 5 ? 'days-warning' : 'days-normal'}>
                  {licenseStatus?.license?.daysRemaining || '0'}
                </span>
              </p>
              {licenseStatus?.license?.expiryDate && (
                <p><strong>Data scadenza:</strong> {new Date(licenseStatus.license.expiryDate).toLocaleDateString('it-IT')}</p>
              )}
            </div>
          </div>
          
          <div className="action-buttons">
            {modalType === 'expiring' && (
              <button onClick={handleClose} className="btn-close">
                ✅ Ho Capito
              </button>
            )}
            
            {modalType === 'expired' && (
              <>
                <button onClick={() => window.location.reload()} className="btn-retry">
                  🔄 Ricarica Pagina
                </button>
                <button onClick={() => window.open('mailto:support@example.com?subject=Rinnovo Licenza', '_blank')} className="btn-support">
                  📧 Contatta Supporto
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicenseModal;


*/






import React, { useState, useEffect, useCallback } from 'react';
import './LicenseModal.css';

const LicenseModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [licenseStatus, setLicenseStatus] = useState(null);
  const [modalType, setModalType] = useState(''); // 'expired' o 'expiring'

  // ✅ FUNZIONE CHE MOSTRA SE GIORNI DIVERSI
  const shouldShowExpiringWarning = useCallback((daysRemaining) => {
    const lastShownData = localStorage.getItem('licenseWarningLastShown');
    
    console.log('🔍 DEBUG shouldShowExpiringWarning:', {
      daysRemaining,
      lastShownData
    });

    if (daysRemaining > 5) {
      console.log('❌ DEBUG: Più di 5 giorni - NON mostro');
      return false;
    }

    if (!lastShownData) {
      console.log('✅ DEBUG: Primo avviso - MOSTRO');
      return true;
    }

    try {
      const lastShown = JSON.parse(lastShownData);
      const lastShownDays = lastShown.daysRemaining;
      
      console.log('📅 DEBUG Confronto giorni:', {
        ultimaVolta: lastShownDays,
        adesso: daysRemaining,
        giorniDiversi: lastShownDays !== daysRemaining
      });

      return lastShownDays !== daysRemaining;

    } catch (error) {
      console.log('✅ DEBUG: Errore parsing - MOSTRO');
      return true;
    }
  }, []);

  // ✅ VERIFICA LICENZA 
  const checkLicense = useCallback(async () => {
    try {
      console.log('🚀 INIZIO checkLicense');
      
      // ✅ PRIMA CONTROLLA SE C'È UNA SIMULAZIONE ATTIVA
      const simulationActive = localStorage.getItem('licenseSimulationActive');
      let data;
      
      if (simulationActive) {
        console.log('🎭 USANDO DATI SIMULATI');
        // Usa dati simulati per test
        data = {
          success: true,
          license: {
            valid: true,
            daysRemaining: parseInt(localStorage.getItem('simulatedDays') || '4'),
            type: "TRIAL", 
            expiryDate: "2025-11-29T17:46:32.073Z",
            trial: true,
            paid: false
          },
          system: {
            serverTime: new Date().toISOString(),
            machineId: "test-machine"
          }
        };
      } else {
        console.log('🌐 USANDO DATI REALI');
        const response = await fetch('https://qrcode-finale.onrender.com/api/license/status');
        data = await response.json();
      }
      
      console.log('📊 DATI LICENZA:', data);
      
      setLicenseStatus(data);
      
      const daysRemaining = data.license?.daysRemaining || 0;
      const isValid = data.license?.valid;
      
      console.log('🎯 GIORNI RIMANENTI:', daysRemaining);
      
      if (!isValid) {
        console.log('🚫 SCADUTA - Mostro modal scaduta');
        setModalType('expired');
        setShowModal(true);
      } else if (shouldShowExpiringWarning(daysRemaining)) {
        console.log(`⚠️ SCADENZA TRA ${daysRemaining} GIORNI - Mostro modal`);
        setModalType('expiring');
        setShowModal(true);
        
        const warningData = {
          date: new Date().toISOString(),
          daysRemaining: daysRemaining,
          timestamp: Date.now()
        };
        localStorage.setItem('licenseWarningLastShown', JSON.stringify(warningData));
        console.log('💾 SALVATO:', warningData);
      } else {
        console.log('✅ LICENZA VALIDA - Modal già mostrato per questi giorni');
        setShowModal(false);
      }
      
    } catch (error) {
      console.error('❌ ERRORE:', error);
    }
  }, [shouldShowExpiringWarning]);

  useEffect(() => {
    console.log('🔄 INIZIO VERIFICA');
    checkLicense();
    
    const interval = setInterval(() => {
      console.log('⏰ VERIFICA AUTOMATICA');
      checkLicense();
    }, 30000); // 30 secondi per test
    
    return () => clearInterval(interval);
  }, [checkLicense]);

  const handleClose = () => {
    console.log('❌ Modal chiuso');
    setShowModal(false);
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'expired':
        return '🚫 Licenza Scaduta';
      case 'expiring':
        return '⚠️ Licenza in Scadenza';
      default:
        return '⚠️ Problema Licenza';
    }
  };

  const getModalMessage = () => {
    const daysRemaining = licenseStatus?.license?.daysRemaining || 0;
    
    switch (modalType) {
      case 'expired':
        return (
          <div className="license-message expired">
            <p><strong>La tua licenza è scaduta!</strong></p>
            <p>Il sistema potrebbe smettere di funzionare. Contatta il supporto per rinnovare la licenza.</p>
          </div>
        );
      case 'expiring':
        return (
          <div className="license-message expiring">
            <p><strong>La tua licenza scadrà tra {daysRemaining} giorni</strong></p>
            <p>Ricordati di rinnovare la licenza per continuare a utilizzare il sistema senza interruzioni.</p>
            <p className="note">(Giorni rimanenti: {daysRemaining})</p>
          </div>
        );
      default:
        return <p>Si è verificato un problema con la licenza.</p>;
    }
  };

  console.log('🎨 RENDER - showModal:', showModal, 'modalType:', modalType);

  if (!showModal) {
    console.log('🚫 RENDER: Modal nascosto');
    return null;
  }

  console.log('✅ RENDER: Modal visibile');

  return (
    <div className="license-modal-overlay">
      <div className={`license-modal ${modalType}`}>
        <div className="modal-header">
          <h2>{getModalTitle()}</h2>
          <button onClick={handleClose} className="close-button">×</button>
        </div>
        <div className="modal-content">
          <div className="license-details">
            {getModalMessage()}
            
            <div className="license-info">
              <p><strong>Stato:</strong> 
                <span className={licenseStatus?.license?.valid ? 'status-valid' : 'status-invalid'}>
                  {licenseStatus?.license?.valid ? 'Valida' : 'Non Valida'}
                </span>
              </p>
              <p><strong>Tipo Licenza:</strong> {licenseStatus?.license?.type || 'N/A'}</p>
              <p><strong>Giorni rimanenti:</strong> 
                <span className={licenseStatus?.license?.daysRemaining <= 5 ? 'days-warning' : 'days-normal'}>
                  {licenseStatus?.license?.daysRemaining || '0'}
                </span>
              </p>
              {licenseStatus?.license?.expiryDate && (
                <p><strong>Data scadenza:</strong> {new Date(licenseStatus.license.expiryDate).toLocaleDateString('it-IT')}</p>
              )}
            </div>
          </div>
          
          <div className="action-buttons">
            {modalType === 'expiring' && (
              <button onClick={handleClose} className="btn-close">
                ✅ Ho Capito
              </button>
            )}
            
            {modalType === 'expired' && (
              <>
                <button onClick={() => window.location.reload()} className="btn-retry">
                  🔄 Ricarica Pagina
                </button>
                <button onClick={() => window.open('mailto:support@example.com?subject=Rinnovo Licenza', '_blank')} className="btn-support">
                  📧 Contatta Supporto
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicenseModal;