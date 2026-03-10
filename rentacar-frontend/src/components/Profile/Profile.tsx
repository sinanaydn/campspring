import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import rentalService from '../../services/rentalService';
import type { GetUserProfileResponse, RentalResponse } from '../../models/types';
import Button from '../Button/Button';
import styles from './Profile.module.css';

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<GetUserProfileResponse | null>(null);
    const [rentals, setRentals] = useState<RentalResponse[]>([]);

    // Password Update States
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        // Profil bilgilerini çek
        userService.getProfile()
            .then(data => setProfile(data))
            .catch(err => console.error("Profil yüklenemedi:", err));

        // Kiralama geçmişini çek
        rentalService.getMyRentals()
            .then(data => setRentals(data))
            .catch(err => console.error("Kiralamalar yüklenemedi:", err));
    }, []);

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage(null);

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor!' });
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'Yeni şifre en az 6 karakter olmalıdır!' });
            return;
        }

        try {
            await userService.updatePassword({ currentPassword, newPassword });
            setPasswordMessage({ type: 'success', text: 'Şifreniz başarıyla güncellendi!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            const errorText = err.response?.data?.detail || err.response?.data?.message || 'Şifre güncellenirken bir hata oluştu.';
            setPasswordMessage({ type: 'error', text: errorText });
        }
    };

    return (
        <div className={styles.profileContainer}>
            <div className={styles.header}>
                <h2>Hesabım</h2>
                <p>Kişisel bilgilerinizi ve kiralama geçmişinizi buradan yönetebilirsiniz.</p>
            </div>

            <div className={styles.contentGrid}>
                {/* Sol Taraf: Profil & Şifre İşlemleri */}
                <div className={styles.leftColumn}>
                    <div className={styles.card}>
                        <h3>Kullanıcı Bilgileri</h3>
                        {profile ? (
                            <div className={styles.infoGroup}>
                                <label>E-Posta Adresiniz:</label>
                                <div className={styles.infoValue}>{profile.email}</div>
                                <label>Hesap Rolü:</label>
                                <div className={styles.badge}>{profile.role === 'ADMIN' ? 'Yönetici' : 'Müşteri'}</div>
                            </div>
                        ) : (
                            <p>Yükleniyor...</p>
                        )}
                    </div>

                    <div className={styles.card}>
                        <h3>Şifre Değiştir</h3>
                        <form onSubmit={handlePasswordUpdate} className={styles.passwordForm}>
                            {passwordMessage && (
                                <div className={`${styles.message} ${styles[passwordMessage.type]}`}>
                                    {passwordMessage.text}
                                </div>
                            )}

                            <div className={styles.formGroup}>
                                <label>Mevcut Şifreniz</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Yeni Şifre</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Yeni Şifre (Tekrar)</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" variant="primary">Şifreyi Güncelle</Button>
                        </form>
                    </div>
                </div>

                {/* Sağ Taraf: Kiralama Geçmişi */}
                <div className={styles.rightColumn}>
                    <div className={styles.card}>
                        <h3>Kiralama Geçmişim</h3>
                        {rentals.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>🚗</div>
                                <p>Henüz hiç araç kiralamadınız.</p>
                            </div>
                        ) : (
                            <div className={styles.rentalList}>
                                {rentals.map(rental => (
                                    <div key={rental.id} className={styles.rentalItem}>
                                        <div className={styles.rentalCarHeader}>
                                            <span className={styles.carName}>{rental.carModelName}</span>
                                            <span className={styles.carPlate}>{rental.carPlate}</span>
                                        </div>
                                        <div className={styles.rentalDates}>
                                            <div className={styles.dateBox}>
                                                <span className={styles.dateLabel}>Alış:</span>
                                                <span className={styles.dateValue}>{rental.startDate}</span>
                                            </div>
                                            <div className={styles.dateBox}>
                                                <span className={styles.dateLabel}>Teslim:</span>
                                                <span className={styles.dateValue}>{rental.endDate}</span>
                                            </div>
                                        </div>
                                        <div className={styles.rentalPrice}>
                                            Toplam: <strong>₺{rental.totalPrice}</strong>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
