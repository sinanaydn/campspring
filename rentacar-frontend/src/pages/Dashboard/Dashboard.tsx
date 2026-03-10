import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import authService from '../../services/authService';
import carService from '../../services/carService';
import type { CarResponse } from '../../models/types';
import styles from './Dashboard.module.css';
import Button from '../../components/Button/Button';
import Brands from '../../components/Brands/Brands';
import CarModels from '../../components/CarModels/CarModels';
import Cars from '../../components/Cars/Cars';
import Rentals from '../../components/Rentals/Rentals';
import Profile from '../../components/Profile/Profile';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    // Müşterinin rolünü token içerisinden okuyoruz
    const userRole = authService.getUserRole();
    const isAdmin = userRole === 'ADMIN';

    const [activeTab, setActiveTab] = useState<'home' | 'brands' | 'carmodels' | 'cars' | 'rentals' | 'profile'>(isAdmin ? 'home' : 'profile');

    // *** STATE'LER (Veriler) ***
    const [cars, setCars] = useState<CarResponse[]>([]);

    useEffect(() => {
        if (isAdmin) {
            // Sadece yöneticiyse arabaları yükle ki grafikleri çizelim
            carService.getAll()
                .then(data => setCars(data))
                .catch(err => console.error("Grafik verileri alınamadı", err));
        }
    }, [isAdmin]);

    // *** GRAFİK İSTATİSTİK HESAPLAMALARI ***
    // 1. Araç Durumlarına Göre Dağılım (Pasta Grafik İçin)
    const availableCount = cars.filter(c => c.state === 1).length;
    const rentedCount = cars.filter(c => c.state === 2).length;
    const maintenanceCount = cars.filter(c => c.state === 3).length;

    const pieData = [
        { name: 'Müsait', value: availableCount, color: '#16a34a' }, // Yeşil
        { name: 'Kirada', value: rentedCount, color: '#f59e0b' },    // Turuncu
        { name: 'Bakımda', value: maintenanceCount, color: '#dc2626' } // Kırmızı
    ];

    // 2. Marka Miktarına Göre Dağılım (Sütun Grafik İçin)
    const brandDataMap = new Map<string, number>();
    cars.forEach(car => {
        const brand = car.modelName.split(" ")[0]; // Örn: "Toyota Corolla" -> "Toyota"
        brandDataMap.set(brand, (brandDataMap.get(brand) || 0) + 1);
    });
    const barData = Array.from(brandDataMap.entries()).map(([name, count]) => ({
        name,
        count
    })).sort((a, b) => b.count - a.count).slice(0, 5); // En çok aracı olan 5 markayı göster.

    // Kullanıcının güvenli çıkış yapmasını sağlayan eylem
    const handleLogout = () => {
        authService.logout(); // Tarayıcıdan gizli tokeni siler
        navigate('/login'); // Kullanıcıyı tekrar kapıya fırlatır
    };

    return (
        <div className={styles.dashboardContainer}>
            {/* Üst Menü (Navbar) */}
            <header className={styles.header}>
                <div className={styles.logo}>
                    <h2>Rent<span>ACar</span></h2>
                </div>

                {/* YENİ EKLENEN SEKME (TAB) MENÜSÜ */}
                <nav className={styles.navMenu}>
                    <button
                        className={styles.navItem}
                        onClick={() => navigate('/')}
                    >
                        Anasayfa
                    </button>

                    {!isAdmin && (
                        <button
                            className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            👤 Profilim
                        </button>
                    )}

                    {/* Sadece yetkili ADMIN ise bu yönetim sekmelerini görsün */}
                    {isAdmin && (
                        <>
                            <button
                                className={`${styles.navItem} ${activeTab === 'brands' ? styles.active : ''}`}
                                onClick={() => setActiveTab('brands')}
                            >
                                🏢 Markalar
                            </button>
                            <button
                                className={`${styles.navItem} ${activeTab === 'carmodels' ? styles.active : ''}`}
                                onClick={() => setActiveTab('carmodels')}
                            >
                                ⚙️ Modeller
                            </button>
                            <button
                                className={`${styles.navItem} ${activeTab === 'cars' ? styles.active : ''}`}
                                onClick={() => setActiveTab('cars')}
                            >
                                🚗 Araçlar
                            </button>
                            <button
                                className={`${styles.navItem} ${activeTab === 'rentals' ? styles.active : ''}`}
                                onClick={() => setActiveTab('rentals')}
                            >
                                📋 Kiralamalar
                            </button>
                        </>
                    )}
                </nav>

                <div className={styles.userSection}>
                    <span className={styles.welcomeText}>Hoş Geldin!</span>
                    <Button variant="outline" onClick={handleLogout}>Çıkış Yap</Button>
                </div>
            </header>

            {/* Ana İçerik Alanı (Hangi Sekmedeysek Onu Göster) */}
            <main className={styles.mainContent}>
                {activeTab === 'home' && (
                    <div className={styles.welcomeCard}>
                        <h1>Harika Bir Yolculuğa Hazır Mısın?</h1>
                        <p>Şu an yönetim panelindesin ve güvendesin. Yukarıdaki menüden kiralık araçları ve markaları ayarlamaya başlayabilirsin!</p>
                        <div className={styles.statsContainer}>
                            <div className={styles.statBox}>
                                <h3>{cars.length}</h3>
                                <p>Toplam Araç</p>
                            </div>
                            <div className={styles.statBox}>
                                <h3>{rentedCount}</h3>
                                <p>Aktif Kiralama</p>
                            </div>
                            <div className={styles.statBox}>
                                <h3>{availableCount}</h3>
                                <p>Garıjdaki (Müsait) Araçlar</p>
                            </div>
                        </div>

                        {/* *** RECHARTS GRAFİKLERİ *** */}
                        {isAdmin && cars.length > 0 && (
                            <div className={styles.chartsContainer}>

                                <div className={styles.chartBox}>
                                    <h3>🚗 Araç Durum Dağılımı</h3>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={pieData.filter(d => d.value > 0)} // Değeri sıfır olanı gösterme
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={5}
                                                dataKey="value"
                                                label={({ name, value }) => `${name}: ${value}`}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => [`${value} Araç`, 'Miktar']} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className={styles.chartBox}>
                                    <h3>📊 En Popüler (Stoklardaki) Markalar</h3>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                            <Tooltip formatter={(value) => [`${value} Adet`, 'Stok']} cursor={{ fill: 'rgba(255,217,0, 0.1)' }} />
                                            <Bar dataKey="count" fill="var(--primary-color)" radius={[4, 4, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'brands' && (
                    <Brands />
                )}

                {activeTab === 'carmodels' && (
                    <CarModels />
                )}

                {activeTab === 'cars' && (
                    <Cars />
                )}

                {activeTab === 'rentals' && (
                    <Rentals />
                )}

                {activeTab === 'profile' && (
                    <Profile />
                )}
            </main>
        </div>
    );
};

export default Dashboard;
