import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Auth.module.css';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import authService from '../../services/authService';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMSG, setErrorMSG] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (countdown !== null && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown((prev) => (prev !== null ? prev - 1 : null));
            }, 1000);
        } else if (countdown === 0) {
            setCountdown(null);
            setErrorMSG(null);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [countdown]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMSG(null);

        try {
            await authService.login({ email, password });
            // Başarılı olursa Dashboard (Panel) veya Anasayfaya gönder
            navigate('/dashboard');
        } catch (error: any) {
            if (error.response && error.response.status === 429) {
                setErrorMSG("Çok fazla istek gönderdiniz. Lütfen sürenin bitmesini bekleyin.");
                setCountdown(59);
            } else if (error.response && error.response.data && error.response.data.detail) {
                setErrorMSG(error.response.data.detail);
            } else {
                setErrorMSG("Giriş başarısız. Lütfen e-posta ve şifrenizi kontrol edin.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <h2>Araç Kiralama'ya Giriş Yap</h2>
                    <p>Yüzlerce araç arasından sana en uygun olanı bul.</p>
                </div>

                {errorMSG && <div className={styles.errorAlert}>{errorMSG}</div>}

                <form onSubmit={handleLogin} className={styles.authForm}>
                    <Input
                        label="E-posta Adresi"
                        type="email"
                        placeholder="ornek@mail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        icon={<span role="img" aria-label="email">✉️</span>}
                    />

                    <Input
                        label="Şifre"
                        type="password"
                        placeholder="••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        icon={<span role="img" aria-label="password">🔒</span>}
                    />

                    <div className={styles.authActions}>
                        <Button type="submit" fullWidth disabled={isLoading || (countdown !== null && countdown > 0)}>
                            {isLoading ? 'Giriş Yapılıyor...' : countdown !== null && countdown > 0 ? `Geçici Olarak Engellendi (${countdown}s)` : 'Giriş Yap'}
                        </Button>
                    </div>
                </form>

                <div className={styles.authFooter}>
                    <p>Hesabın yok mu? <Link to="/register" className={styles.link}>Hemen Üye Ol</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
