import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck } from 'lucide-react';

const Login = ({ setAuth }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Fixed credentials provided by the user
        if (username === 'vetia' && password === 'Vetia_27350505') {
            localStorage.setItem('adminAuth', 'true');
            setAuth(true);
            navigate('/admin');
        } else {
            setError('Identifiants invalides');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <ShieldCheck size={48} className="gold-icon" />
                    <h1>Accès Réservé</h1>
                    <p>Espace d'administration Rimy</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <User size={20} />
                        <input
                            type="text"
                            placeholder="Utilisateur"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Lock size={20} />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="error-msg">{error}</p>}

                    <button type="submit" className="login-btn">
                        SE CONNECTER
                    </button>
                </form>
            </div>

            <style jsx="true">{`
        .login-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000000;
          color: white;
        }
        .login-card {
          background: #111;
          padding: 3rem;
          border-radius: 12px;
          width: 100%;
          max-width: 400px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          text-align: center;
        }
        .login-header h1 {
          font-size: 1.8rem;
          margin: 1rem 0 0.5rem;
          color: var(--accent);
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .login-header p {
          color: #888;
          font-size: 0.9rem;
          margin-bottom: 2rem;
        }
        .gold-icon {
          color: var(--accent);
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .input-group {
          position: relative;
          display: flex;
          align-items: center;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 6px;
          padding: 0 1rem;
          transition: var(--transition);
        }
        .input-group:focus-within {
          border-color: var(--accent);
        }
        .input-group svg {
          color: #555;
        }
        .input-group input {
          background: transparent;
          border: none;
          color: white;
          padding: 12px;
          width: 100%;
          outline: none;
        }
        .login-btn {
          background: var(--accent);
          color: black;
          border: none;
          padding: 14px;
          border-radius: 6px;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
          transition: var(--transition);
          margin-top: 1rem;
        }
        .login-btn:hover {
          background: #fbf5b7;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
        }
        .error-msg {
          color: #ff4d4d;
          font-size: 0.85rem;
          margin: -0.5rem 0;
        }
      `}</style>
        </div>
    );
};

export default Login;
