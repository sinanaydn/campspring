import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import carService from '../../services/carService';
import rentalService from '../../services/rentalService';
import authService from '../../services/authService';
import brandService from '../../services/brandService';
import carModelService from '../../services/carModelService';
import type { CarResponse, BrandResponse, CarModelResponse } from '../../models/types';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import styles from './Landing.module.css';

const Landing: React.FC = () => {
    const navigate = useNavigate();
    const [cars, setCars] = useState<CarResponse[]>([]);

    // Arama & Filtreleme State'leri
    const [brands, setBrands] = useState<BrandResponse[]>([]);
    const [carModels, setCarModels] = useState<CarModelResponse[]>([]);
    const [selectedBrandName, setSelectedBrandName] = useState<string>('');
    const [selectedModelName, setSelectedModelName] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<number | ''>('');
    const [isAutomaticOnly, setIsAutomaticOnly] = useState<boolean>(false);
    const [fuelFilter, setFuelFilter] = useState<string>('');
    const isAuthenticated = authService.isAuthenticated();

    // Kiralama Modal Durumları
    const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState<CarResponse | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [rentalError, setRentalError] = useState<string | null>(null);
    const [rentalSuccess, setRentalSuccess] = useState(false);

    // YENİ: Mock Payment State'leri (Sanal Ödeme)
    const [rentalStep, setRentalStep] = useState<1 | 2>(1); // 1 = Tarih Seçimi, 2 = Ödeme Ekranı
    const [isProcessingPayment, setIsProcessingPayment] = useState(false); // Yükleniyor animasyonu için
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');

    useEffect(() => {
        // Araçları getir
        carService.getAll()
            .then(data => {
                const availableCars = data.filter(c => c.state === 1);
                setCars(availableCars);
            })
            .catch(err => console.error("Araçlar yüklenemedi", err));

        // Markaları getir
        brandService.getAll()
            .then(data => setBrands(data))
            .catch(err => console.error("Markalar yüklenemedi", err));

        // Modelleri getir
        carModelService.getAll()
            .then(data => setCarModels(data))
            .catch(err => console.error("Modeller yüklenemedi", err));
    }, []);

    const handleRentClick = (car: CarResponse) => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            setSelectedCar(car);
            setStartDate('');
            setEndDate('');
            setRentalError(null);
            setRentalSuccess(false);
            setRentalStep(1); // Modalı açarken 1. adıma sıfırla
            setIsProcessingPayment(false);
            setCardName('');
            setCardNumber('');
            setCardExpiry('');
            setCardCvv('');
            setIsRentalModalOpen(true);
        }
    };

    // Toplam Fiyat Hesaplama (Gün × Günlük Fiyat)
    const calculateTotal = (): number => {
        if (!startDate || !endDate || !selectedCar) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays * selectedCar.dailyPrice : 0;
    };

    // Form Submission (Önce Ödemeye Geçilir, Sonra Backend'e Atılır)
    const handleRentalStep1 = (e: React.FormEvent) => {
        e.preventDefault();
        setRentalError(null);

        if (!selectedCar || !startDate || !endDate) return;

        // Validasyonlar tamam, ödeme ekranına geç
        setRentalStep(2);
    };

    // Aşama 2 (Sanal Ödemeyi Tamamla ve Bekle)
    const handleRentalProcess = async (e: React.FormEvent) => {
        e.preventDefault();
        setRentalError(null);
        if (!selectedCar) return;

        setIsProcessingPayment(true); // Yükleniyor... ekranını aç

        // Yapay 2 saniyelik bir bekletme simülasyonu koy
        setTimeout(async () => {
            try {
                // Gerçek Backend isteği başlat
                await rentalService.add({
                    carId: selectedCar.id,
                    startDate,
                    endDate
                });
                setRentalSuccess(true);
            } catch (err: any) {
                const detail = err.response?.data?.detail || err.response?.data?.message || "Kiralama sırasında bir hata oluştu!";
                setRentalError(detail);
                setRentalStep(1); // Hata verirse takvim ekranına geri dön
            } finally {
                setIsProcessingPayment(false);
            }
        }, 2000); // 2 saniye gecikme
    };

    // Seçilen markaya göre sadece o markanın modellerini filtrele
    const availableModels = selectedBrandName
        ? carModels.filter(m => m.brandName === selectedBrandName)
        : carModels;

    // Arama ve Filtreleme Mantığı
    const filteredCars = cars.filter(car => {
        let matchesBrand = true;
        let matchesModel = true;

        if (selectedBrandName) {
            // car.modelName, seçilen markanın modelleri içerisinde var mı?
            matchesBrand = availableModels.some(m => m.name === car.modelName);
        }

        if (selectedModelName) {
            matchesModel = car.modelName === selectedModelName;
        }

        const matchesPrice = maxPrice === '' || car.dailyPrice <= maxPrice;
        const matchesTransmission = isAutomaticOnly ? car.transmissionType === 'AUTOMATIC' : true;
        const matchesFuel = fuelFilter ? car.fuelType === fuelFilter : true;

        return matchesBrand && matchesModel && matchesPrice && matchesTransmission && matchesFuel;
    });

    // "Araç Bul" butonuna tıklandığında araçların olduğu kısma kaydır
    const handleScrollToShowcase = () => {
        document.getElementById('showcaseSection')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={styles.landingContainer}>
            {/* Navigasyon / Header */}
            <header className={styles.navbar}>
                <div className={styles.logo}>
                    <h2>Rent<span>ACar</span></h2>
                </div>
                <div className={styles.navActions}>
                    {isAuthenticated ? (
                        <Button variant="primary" onClick={() => navigate('/dashboard')}>
                            {authService.getUserRole() === 'ADMIN' ? 'Yönetim Paneline Dön' : 'Profilime Git'}
                        </Button>
                    ) : (
                        <>
                            <button className={styles.textBtn} onClick={() => navigate('/login')}>Giriş Yap</button>
                            <Button variant="primary" onClick={() => navigate('/register')}>Üye Ol</Button>
                        </>
                    )}
                </div>
            </header>

            {/* Hero / Karşılama Alanı */}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Hayalindeki Aracı<br /><span>Bugün Kirala.</span></h1>
                    <p className={styles.heroSubtitle}>Güvenilir, hızlı ve kusursuz kiralama deneyimi için yüzlerce araç arasından sana en uygununu seç.</p>

                    {/* Arama / Filtreleme Çubuğu */}
                    <div className={styles.searchBar}>
                        <div className={styles.searchGroup}>
                            <label>Hangi Marka?</label>
                            <select
                                value={selectedBrandName}
                                onChange={(e) => {
                                    setSelectedBrandName(e.target.value);
                                    setSelectedModelName(''); // Marka değişince modeli sıfırla
                                }}
                            >
                                <option value="">Tümü</option>
                                {brands.map(brand => (
                                    <option key={brand.id} value={brand.name}>{brand.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.searchDivider}></div>
                        <div className={styles.searchGroup}>
                            <label>Hangi Model?</label>
                            <select
                                value={selectedModelName}
                                onChange={(e) => setSelectedModelName(e.target.value)}
                                disabled={!selectedBrandName && carModels.length > 0} // Marka seçilmeden modele basmayı istersen engelleyebilirsin
                            >
                                <option value="">Tümü</option>
                                {availableModels.map(model => (
                                    <option key={model.id} value={model.name}>{model.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.searchDivider}></div>
                        <div className={styles.searchGroup}>
                            <label>Maksimum Günlük Fiyat (₺)</label>
                            <input
                                type="number"
                                placeholder="Örn: 2000"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                            />
                        </div>
                        <button className={styles.searchBtn} onClick={handleScrollToShowcase}>Araç Bul</button>
                    </div>

                    {/* Gelişmiş Filtreler (Toggles) */}
                    <div className={styles.advancedFilters}>
                        <button
                            className={`${styles.filterToggle} ${isAutomaticOnly ? styles.activeToggle : ''}`}
                            onClick={() => setIsAutomaticOnly(!isAutomaticOnly)}
                        >
                            {isAutomaticOnly ? '✓ Sadece Otomatik' : 'Sadece Otomatik'}
                        </button>

                        <select
                            className={styles.fuelSelect}
                            value={fuelFilter}
                            onChange={(e) => setFuelFilter(e.target.value)}
                        >
                            <option value="">Tüm Yakıt Tipleri</option>
                            <option value="GASOLINE">Benzin</option>
                            <option value="DIESEL">Dizel</option>
                            <option value="ELECTRIC">Elektrik</option>
                            <option value="HYBRID">Hibrit</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Vitrin (Araç Kartları) */}
            <section id="showcaseSection" className={styles.showcaseSection}>
                <div className={styles.sectionHeader}>
                    <h2>Müsait Araçlarımız</h2>
                    <p>Senin için özenle hazırladığımız ve hemen yola çıkmaya hazır lüks filomuz.</p>
                </div>

                {filteredCars.length > 0 ? (
                    <div className={styles.carGrid}>
                        {filteredCars.map(car => (
                            <div key={car.id} className={styles.carCard}>
                                <div className={styles.carImageWrapper}>
                                    <div className={styles.carYearBadge}>{car.modelYear}</div>
                                    {car.imageUrl ? (
                                        <img
                                            src={car.imageUrl}
                                            alt={car.modelName}
                                            className={styles.carImage}
                                        />
                                    ) : (
                                        <div className={styles.carImage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8e8e8', color: '#aaa', fontSize: '36px' }}>🚗</div>
                                    )}
                                </div>
                                <div className={styles.carInfo}>
                                    <h3>{car.modelName}</h3>

                                    <div className={styles.carBadgesRow}>
                                        <span className={styles.carBadge}>{car.transmissionType === 'AUTOMATIC' ? 'Otomatik' : 'Manuel'}</span>
                                        <span className={styles.carBadge}>
                                            {car.fuelType === 'GASOLINE' ? 'Benzin' : car.fuelType === 'ELECTRIC' ? 'Elektrik' : car.fuelType === 'HYBRID' ? 'Hibrit' : car.fuelType === 'DIESEL' ? 'Dizel' : 'Yakıt'}
                                        </span>
                                    </div>

                                    <div className={styles.carDetails}>
                                        <span className={styles.plate}>{car.plate}</span>
                                        <span className={styles.price}>₺{car.dailyPrice} <span>/ gün</span></span>
                                    </div>
                                    <Button
                                        variant="primary"
                                        style={{ width: '100%', marginTop: '16px' }}
                                        onClick={() => handleRentClick(car)}
                                    >
                                        Hemen Kirala
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <p>Arama kriterlerinize uygun araç bulunamadı.</p>
                    </div>
                )}
            </section>

            {/* Kiralama Modalı */}
            <Modal
                isOpen={isRentalModalOpen}
                onClose={() => setIsRentalModalOpen(false)}
                title={selectedCar ? `${selectedCar.modelName} Kirala` : 'Araç Kirala'}
            >
                {rentalSuccess ? (
                    <div className={styles.successBox}>
                        <div className={styles.successIcon}>✅</div>
                        <h3>Kiralama ve Ödeme Başarılı!</h3>
                        <p>
                            <strong>{selectedCar?.modelName}</strong> aracı, <strong>{startDate}</strong> - <strong>{endDate}</strong> tarihleri arasında sizin için rezerve edildi.
                        </p>
                        <p className={styles.totalHighlight}>Toplam Ödenen: ₺{calculateTotal().toLocaleString('tr-TR')}</p>
                        <Button variant="primary" onClick={() => setIsRentalModalOpen(false)} style={{ marginTop: '16px', width: '100%' }}>
                            Keşfetmeye Devam Et
                        </Button>
                    </div>
                ) : isProcessingPayment ? (
                    <div className={styles.processingPaymentBox}>
                        <div className={styles.spinner}></div>
                        <h3>Ödeme İşleniyor...</h3>
                        <p>Lütfen bekleyin, bankanız ile iletişim halindeyiz.</p>
                    </div>
                ) : rentalStep === 1 ? (
                    <form onSubmit={handleRentalStep1} className={styles.rentalForm}>
                        {rentalError && <div className={styles.rentalError}>{rentalError}</div>}

                        {selectedCar && (
                            <div className={styles.rentalCarInfo}>
                                <span className={styles.rentalPlate}>{selectedCar.plate}</span>
                                <span className={styles.rentalDailyPrice}>₺{selectedCar.dailyPrice} / gün</span>
                            </div>
                        )}

                        <div className={styles.dateRow}>
                            <div className={styles.dateGroup}>
                                <label>Başlangıç Tarihi</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.dateGroup}>
                                <label>Bitiş Tarihi</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    min={startDate || new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Canlı Fiyat Hesaplama Göstergesi */}
                        {startDate && endDate && calculateTotal() > 0 && (
                            <div className={styles.priceCalcBox}>
                                <div className={styles.priceCalcRow}>
                                    <span>{Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} gün</span>
                                    <span>× ₺{selectedCar?.dailyPrice}</span>
                                </div>
                                <div className={styles.priceCalcTotal}>
                                    Toplam: ₺{calculateTotal().toLocaleString('tr-TR')}
                                </div>
                            </div>
                        )}

                        <Button type="submit" fullWidth style={{ marginTop: '16px' }}>
                            Ödeme Adımına Geç
                        </Button>
                    </form>
                ) : (
                    // 2. AŞAMA: Ödeme Ekranı (Mock Payment)
                    <form onSubmit={handleRentalProcess} className={styles.paymentForm}>
                        <div className={styles.paymentHeader}>
                            <button type="button" onClick={() => setRentalStep(1)} className={styles.backButton}>
                                🔙 Geri Dön
                            </button>
                            <h3>Güvenli Ödeme</h3>
                        </div>

                        {/* Tasarım Kredi Kartı (CSS ile) */}
                        <div className={styles.creditCardVisual}>
                            <div className={styles.ccHeader}>
                                <span className={styles.ccChip}></span>
                                <span className={styles.ccLogo}>VISA</span>
                            </div>
                            <div className={styles.ccNumber}>
                                {cardNumber || '#### #### #### ####'}
                            </div>
                            <div className={styles.ccFooter}>
                                <div className={styles.ccName}>
                                    <span>Kart Sahibi</span>
                                    {cardName || 'İSIM SOYİSİM'}
                                </div>
                                <div className={styles.ccExpires}>
                                    <span>Geçerlilik</span>
                                    {cardExpiry || 'AA/YY'}
                                </div>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Kart Üzerindeki İsim</label>
                            <input
                                type="text"
                                placeholder="Örn: SİNAN GÜLTEKİN"
                                value={cardName}
                                onChange={e => setCardName(e.target.value.toUpperCase())}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Kart Numarası</label>
                            <input
                                type="text"
                                placeholder="0000 0000 0000 0000"
                                maxLength={16}
                                value={cardNumber}
                                onChange={e => setCardNumber(e.target.value.replace(/\D/g, ''))} // Sadece rakam
                                required
                            />
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Son Kullanma Tarihi</label>
                                <input
                                    type="text"
                                    placeholder="AA/YY"
                                    maxLength={5}
                                    value={cardExpiry}
                                    onChange={e => setCardExpiry(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>CVC / CVV</label>
                                <input
                                    type="password"
                                    placeholder="123"
                                    maxLength={3}
                                    value={cardCvv}
                                    onChange={e => setCardCvv(e.target.value.replace(/\D/g, ''))} // Sadece rakam
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.paymentTotalBox}>
                            <span>Ödenecek Tutar:</span>
                            <strong>₺{calculateTotal().toLocaleString('tr-TR')}</strong>
                        </div>

                        <Button type="submit" fullWidth style={{ marginTop: '24px' }}>
                            ₺{calculateTotal().toLocaleString('tr-TR')} Ödemeyi Tamamla
                        </Button>
                    </form>
                )}
            </Modal>

            {/* Footer */}
            <footer className={styles.footer}>
                <p>&copy; 2026 RentACar. Tüm hakları saklıdır. Geliştirici: Sinan.</p>
            </footer>
        </div>
    );
};

export default Landing;
