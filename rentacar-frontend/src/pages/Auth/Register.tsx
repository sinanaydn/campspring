import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Auth.module.css';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import authService from '../../services/authService';

const Register: React.FC = () => {
    const navigate = useNavigate();
    // Form nesneleri (State)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        nationalIdentity: '',
        email: '',
        password: ''
    });

    const [errorMSG, setErrorMSG] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Kullanıcı yazmaya başladığında ilgili hatayı temizle
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMSG(null);
        setValidationErrors({});

        try {
            await authService.register(formData);
            navigate('/dashboard'); // Kayıt başarılıysa Ansayfaya uç
        } catch (error: any) {
            if (error.response && error.response.data) {
                // Backend'den yazdığımız GlobalExceptionHandler devreye girdi!
                const problemDetails = error.response.data;
                if (problemDetails.validationErrors) {
                    setValidationErrors(problemDetails.validationErrors);
                } else if (problemDetails.detail) {
                    setErrorMSG(problemDetails.detail);
                } else {
                    setErrorMSG("Bir sorun oluştu.");
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <h2>Ücretsiz Kayıt Ol</h2>
                    <p>Avantajlı fiyatlarla kiralamaya hemen başla.</p>
                </div>

                {errorMSG && <div className={styles.errorAlert}>{errorMSG}</div>}

                <form onSubmit={handleRegister} className={styles.authForm}>

                    <div className={styles.doubleGroup}>
                        <Input
                            label="Ad"
                            name="firstName"
                            placeholder="Örn: Sinan"
                            value={formData.firstName}
                            onChange={handleChange}
                            error={validationErrors['firstName']}
                        />
                        <Input
                            label="Soyad"
                            name="lastName"
                            placeholder="Örn: Yılmaz"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={validationErrors['lastName']}
                        />
                    </div>

                    <Input
                        label="TC Kimlik No"
                        name="nationalIdentity"
                        placeholder="11 Haneli TC Kimlik Numaranız"
                        maxLength={11}
                        value={formData.nationalIdentity}
                        onChange={handleChange}
                        error={validationErrors['nationalIdentity']}
                    />

                    <Input
                        label="E-posta Adresi"
                        name="email"
                        type="email"
                        placeholder="mail@ornek.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={validationErrors['email']}
                    />

                    <Input
                        label="Şifre"
                        name="password"
                        type="password"
                        placeholder="••••••"
                        value={formData.password}
                        onChange={handleChange}
                        error={validationErrors['password']}
                    />

                    <div className={styles.authActions} style={{ marginTop: '10px' }}>
                        <Button type="submit" fullWidth disabled={isLoading}>
                            {isLoading ? 'Hesap Oluşturuluyor...' : 'Kayıt Ol'}
                        </Button>
                    </div>
                </form>

                <div className={styles.authFooter}>
                    <p>Zaten üye misin? <Link to="/login" className={styles.link}>Giriş Yap</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
