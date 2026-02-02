
import React, { useState } from 'react';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import { MdInfoOutline, MdCheckCircleOutline, MdClose } from 'react-icons/md';
import LoginForm from './LoginForm';
import LoginSlider from './LoginSlider';
import './login.css'

interface LoginCredentials {
  username: string;
  password: string;
}

type HomeProps = {
  onLogin: (email: string, pass: string) => Promise<void>;
};

const LoginPage: React.FC<HomeProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const handleLogin = async (credentials: LoginCredentials): Promise<void> => {

    setIsLoading(true);
    setLoadingMessage('LOGGING IN...'); 
    
 
    const toastId = toast.loading(
      <span style={{ marginLeft: '8px' }}>Logging in...</span>, 
      {
        style: {
          background: '#cfe2ff', 
          color: '#084298',      
          border: '1px solid #b6d4fe',
          fontWeight: '600',
          padding: '12px 24px',
          borderRadius: '4px', 
          width: '600px',      
          maxWidth: '90vw',
        },
        icon: <MdInfoOutline size={22} style={{ color: '#084298' }} />,
      }
    );
    
    try {
  
      await onLogin(credentials.username, credentials.password);
      
 
      setTimeout(() => {
        
      
        toast.success(
          <span style={{ marginLeft: '8px' }}>Logged in Successfully</span>, 
          { 
            id: toastId, 
            duration: 1500,
            style: {
              background: '#d1e7dd', 
              color: '#0f5132',      
              border: '1px solid #badbcc',
              fontWeight: '600',
              padding: '12px 24px',
              borderRadius: '4px',
              width: '600px',
              maxWidth: '90vw',
            },
            icon: <MdCheckCircleOutline size={22} style={{ color: '#0f5132' }} />
          }
        );     
        setIsLoading(false);
      }, 1500); 

    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(error.message || "Invalid credentials");
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0 overflow-hidden ">
     
      <Toaster 
        position="top-center" 
        containerStyle={{ top: 40 }} 
        reverseOrder={false} 
        gutter={8}
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                <div style={{ flex: '1 1 auto', textAlign: 'left' }}>{message}</div>
              
                {t.type !== 'loading' && (
                  <button 
                    onClick={() => toast.dismiss(t.id)} 
                    style={{ 
                        border: 'none', 
                        background: 'transparent', 
                        padding: '4px', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        color: 'inherit',
                        opacity: 0.8 
                    }}
                  >
                    <MdClose size={18} />
                  </button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>

      <div className="login-row">
        {/* Left column  */}
        <div 
          className="login-left-column" 
          style={{ background: 'linear-gradient(270deg, #c8e6c9, #cbe7cc, #cee9cf, #d1ead2, #d4ecd5, #d6edd8, #d9eedb, #dcf0dd, #dff1e0, #e2f2e3, #e5f4e6, #e8f5e9)' }}
        >
          <div className='login-info-container'>
            <LoginSlider />
          </div>
        </div>
         {/* Right column  */}
        <div className="login-right-column">
          <div style={{ width: '100%', maxWidth: '540px' }}>
            <LoginForm onSubmitLogin={handleLogin} isLoading={isLoading} loadingMessage={loadingMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;