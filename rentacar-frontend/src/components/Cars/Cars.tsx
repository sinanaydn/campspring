import React, { useEffect, useState } from 'react';
import carService from '../../services/carService';
import carModelService from '../../services/carModelService';
import { type CarResponse, type CarModelResponse } from '../../models/types';
import Button from '../Button/Button';
import Input from '../Input/Input';
import Modal from '../Modal/Modal';
import styles from './Cars.module.css';

const Cars: React.FC = () => {
    const [cars, setCars] = useState<CarResponse[]>([]);
    const [models, setModels] = useState<CarModelResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [uploadingCarId, setUploadingCarId] = useState<number | null>(null); // Hangi araca resim yükleniyor?
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Form durumu (Request yapılarına uygun olarak tanımlanıyor)
    const [formData, setFormData] = useState({
        id: 0,
        modelYear: new Date().getFullYear(),
        plate: '',
        dailyPrice: 0,
        state: 1, // Varsayılan: Müsait
        modelId: 0,
        fuelType: 'GASOLINE',
        transmissionType: 'AUTOMATIC'
    });
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Arabaları ve Modelleri eşzamanlı çekiyoruz
            const [carsData, modelsData] = await Promise.all([
                carService.getAll(),
                carModelService.getAll()
            ]);
            setCars(carsData);
            setModels(modelsData);
        } catch (err) {
            console.error("Veriler çekilirken hata oluştu");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openModal = (mode: 'create' | 'edit', car?: CarResponse) => {
        setError(null);
        setModalMode(mode);
        if (mode === 'edit' && car) {
            // Düzenleme modunda listelenen arabayı forma aktar
            // Ancak CarResponse içinde modelId yok, modelName var. 
            // Seçili modeli listeden bulmamız gerekebilir veya varsayılan bırakabiliriz.
            const correspondingModel = models.find(m => m.name === car.modelName);

            setFormData({
                id: car.id,
                modelYear: car.modelYear,
                plate: car.plate,
                dailyPrice: car.dailyPrice,
                state: car.state,
                modelId: correspondingModel ? correspondingModel.id : 0,
                fuelType: car.fuelType || 'GASOLINE',
                transmissionType: car.transmissionType || 'AUTOMATIC'
            });
        } else {
            setFormData({
                id: 0,
                modelYear: new Date().getFullYear(),
                plate: '',
                dailyPrice: 0,
                state: 1,
                modelId: models.length > 0 ? models[0].id : 0,
                fuelType: 'GASOLINE',
                transmissionType: 'AUTOMATIC'
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            if (formData.modelId === 0) {
                setError("Lütfen geçerli bir araç modeli seçiniz!");
                return;
            }

            if (modalMode === 'create') {
                await carService.add({
                    modelYear: formData.modelYear,
                    plate: formData.plate,
                    dailyPrice: formData.dailyPrice,
                    state: formData.state,
                    modelId: Number(formData.modelId),
                    fuelType: formData.fuelType,
                    transmissionType: formData.transmissionType
                });
            } else {
                await carService.update({
                    id: formData.id,
                    modelYear: formData.modelYear,
                    plate: formData.plate,
                    dailyPrice: formData.dailyPrice,
                    state: formData.state,
                    modelId: Number(formData.modelId),
                    fuelType: formData.fuelType,
                    transmissionType: formData.transmissionType
                });
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err: any) {
            setError(err.response?.data?.detail || "Bir hata oluştu");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Bu aracı silmek istediğinize emin misiniz?")) {
            try {
                await carService.delete(id);
                fetchData();
            } catch (err: any) {
                alert("Silme işlemi başarısız. Araç kiralık durumda olabilir.");
            }
        }
    };

    const getStateLabel = (stateCode: number) => {
        switch (stateCode) {
            case 1: return <span className={`${styles.badge} ${styles.badgeAvailable}`}>Müsait</span>;
            case 2: return <span className={`${styles.badge} ${styles.badgeRented}`}>Kiralandı</span>;
            case 3: return <span className={`${styles.badge} ${styles.badgeMaintenance}`}>Bakımda</span>;
            default: return <span className={styles.badge}>Bilinmiyor</span>;
        }
    };

    // Resim Yükleme: Gizli input'u tetikle
    const triggerFileInput = (carId: number) => {
        setUploadingCarId(carId);
        fileInputRef.current?.click();
    };

    // Resim Yükleme: Dosya seçildikten sonra Cloudinary'ye gönder
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !uploadingCarId) return;

        try {
            await carService.uploadImage(uploadingCarId, file);
            fetchData(); // Tabloyu yenile
        } catch (err: any) {
            alert(err.response?.data?.detail || "Resim yüklenirken bir hata oluştu!");
        } finally {
            setUploadingCarId(null);
            // Input'u sıfırla ki aynı dosyayı tekrar seçebilsin
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className={styles.carsContainer}>
            {/* Gizli Dosya Seçici (Input) - Her resim yükleme butonu bunu tetikler */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
            />

            <div className={styles.headerRow}>
                <h2>Araç Yönetimi</h2>
                <Button onClick={() => openModal('create')}>+ Yeni Araç Ekle</Button>
            </div>

            {isLoading ? (
                <div className={styles.loading}>Araçlar Şartlanıyor... ⏳</div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Resim</th>
                                <th>Araç Modeli</th>
                                <th>Plaka</th>
                                <th>Yıl</th>
                                <th>Günlük Fiyat</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className={styles.emptyState}>Sistemde henüz kayıtlı araç yok.</td>
                                </tr>
                            ) : (
                                cars.map((car) => (
                                    <tr key={car.id}>
                                        <td>
                                            {car.imageUrl ? (
                                                <img src={car.imageUrl} alt={car.modelName} className={styles.carThumbnail} />
                                            ) : (
                                                <div className={styles.noImage}>📷</div>
                                            )}
                                        </td>
                                        <td className={styles.fwBold}>{car.modelName}</td>
                                        <td>{car.plate}</td>
                                        <td>{car.modelYear}</td>
                                        <td className={styles.priceColumn}>{car.dailyPrice} ₺</td>
                                        <td>{getStateLabel(car.state)}</td>
                                        <td className={styles.actions}>
                                            <button className={styles.actionBtnUpload} onClick={() => triggerFileInput(car.id)}>📸</button>
                                            <button className={styles.actionBtnEdit} onClick={() => openModal('edit', car)}>Düzenle</button>
                                            <button className={styles.actionBtnDelete} onClick={() => handleDelete(car.id)}>Sil</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'create' ? "Yeni Araç Kaydı" : "Aracı Düzenle"}
            >
                <form onSubmit={handleSave} className={styles.formGroup}>
                    {error && <div className={styles.errorText}>{error}</div>}

                    {/* Model Seçimi */}
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Araç Modeli</label>
                        <select
                            className={styles.selectInput}
                            value={formData.modelId}
                            onChange={(e) => setFormData({ ...formData, modelId: Number(e.target.value) })}
                            required
                        >
                            <option value={0} disabled>Lütfen bir model seçiniz</option>
                            {models.map(model => (
                                <option key={model.id} value={model.id}>
                                    {model.brandName} - {model.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Plaka (Örn: 34ABC123)"
                        placeholder="Araç Plakası"
                        value={formData.plate}
                        onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                        required
                    />

                    <div className={styles.flexRow}>
                        <div style={{ flex: 1 }}>
                            <Input
                                label="Model Yılı"
                                type="number"
                                min="1990"
                                max={new Date().getFullYear() + 1}
                                value={formData.modelYear}
                                onChange={(e) => setFormData({ ...formData, modelYear: Number(e.target.value) })}
                                required
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Input
                                label="Günlük Fiyat (₺)"
                                type="number"
                                step="10"
                                min="0"
                                value={formData.dailyPrice}
                                onChange={(e) => setFormData({ ...formData, dailyPrice: Number(e.target.value) })}
                                required
                            />
                        </div>
                    </div>

                    {/* Yakıt Tipi ve Vites Seçimi */}
                    <div className={styles.flexRow} style={{ marginTop: '16px' }}>
                        <div className={styles.inputContainer} style={{ flex: 1 }}>
                            <label className={styles.label}>Yakıt Tipi</label>
                            <select
                                className={styles.selectInput}
                                value={formData.fuelType}
                                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                            >
                                <option value="GASOLINE">Benzin</option>
                                <option value="DIESEL">Dizel</option>
                                <option value="ELECTRIC">Elektrik</option>
                                <option value="HYBRID">Hibrit</option>
                            </select>
                        </div>
                        <div className={styles.inputContainer} style={{ flex: 1, marginLeft: '16px' }}>
                            <label className={styles.label}>Vites Tipi</label>
                            <select
                                className={styles.selectInput}
                                value={formData.transmissionType}
                                onChange={(e) => setFormData({ ...formData, transmissionType: e.target.value })}
                            >
                                <option value="AUTOMATIC">Otomatik</option>
                                <option value="MANUAL">Manuel</option>
                            </select>
                        </div>
                    </div>

                    {/* Durum Seçimi */}
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Araç Durumu</label>
                        <select
                            className={styles.selectInput}
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: Number(e.target.value) })}
                        >
                            <option value={1}>Müsait (1)</option>
                            <option value={2}>Kiralandı (2)</option>
                            <option value={3}>Bakımda (3)</option>
                        </select>
                    </div>

                    <div className={styles.modalActions}>
                        <Button type="submit" fullWidth>
                            {modalMode === 'create' ? "Filoya Ekle" : "Değişiklikleri Kaydet"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Cars;
