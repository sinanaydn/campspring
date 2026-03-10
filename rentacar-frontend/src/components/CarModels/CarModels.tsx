import React, { useEffect, useState } from 'react';
import carModelService from '../../services/carModelService';
import brandService from '../../services/brandService';
import { type CarModelResponse, type BrandResponse } from '../../models/types';
import Button from '../Button/Button';
import Input from '../Input/Input';
import Modal from '../Modal/Modal';
import styles from './CarModels.module.css';

const CarModels: React.FC = () => {
    const [models, setModels] = useState<CarModelResponse[]>([]);
    const [brands, setBrands] = useState<BrandResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal Durum (State) Yönetimi
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    // Form içeriğimiz
    const [formData, setFormData] = useState({ id: 0, name: '', brandId: 0 });
    const [error, setError] = useState<string | null>(null);

    // İlk açılışta Araç Modellerini ve de Select (Seçenekler) için Markaları getir
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [modelsData, brandsData] = await Promise.all([
                carModelService.getAll(),
                brandService.getAll()
            ]);
            setModels(modelsData);
            setBrands(brandsData);
        } catch (err) {
            console.error("Araç modelleri çekilirken hata oluştu");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Yeni Modal Ekleme/Düzenleme İçin
    const openModal = (mode: 'create' | 'edit', modelInfo?: CarModelResponse) => {
        setError(null);
        setModalMode(mode);

        if (mode === 'edit' && modelInfo) {
            // İlgili model adından (String) markayı listede bulmak
            const selectedBrand = brands.find(b => b.name === modelInfo.brandName);
            setFormData({
                id: modelInfo.id,
                name: modelInfo.name,
                brandId: selectedBrand ? selectedBrand.id : (brands.length > 0 ? brands[0].id : 0)
            });
        } else {
            // Ekleme modunda sıfırla (Varsayılan olarak ilk markayı seçer)
            setFormData({
                id: 0,
                name: '',
                brandId: brands.length > 0 ? brands[0].id : 0
            });
        }
        setIsModalOpen(true);
    };

    // Model Kaydet/Güncelle Aksiyonu
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            if (formData.brandId === 0) {
                setError("Lütfen geçerli bir marka seçiniz! Sisteme marka eklenmiş olması gerekir.");
                return;
            }

            if (modalMode === 'create') {
                await carModelService.add({ name: formData.name, brandId: Number(formData.brandId) });
            } else {
                await carModelService.update({ id: formData.id, name: formData.name, brandId: Number(formData.brandId) });
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err: any) {
            setError(err.response?.data?.detail || "Bir hata oluştu");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Dikkat! Bu modeli silerseniz ona bağlı tüm araçlar da silinebilir veya hata verebilir. Onaylıyor musunuz?")) {
            try {
                await carModelService.delete(id);
                fetchData();
            } catch (err: any) {
                alert("Silme işlemi başarısız. Bu modele bağlı araçlar var!");
            }
        }
    };

    return (
        <div className={styles.modelsContainer}>
            <div className={styles.headerRow}>
                <h2>Araç Modelleri Yönetimi (A4, X5, Fiesta)</h2>
                <Button onClick={() => openModal('create')}>+ Yeni Model Ekle</Button>
            </div>

            {isLoading ? (
                <div className={styles.loading}>Modeller Yükleniyor...</div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Bağlı Olduğu Marka</th>
                                <th>Model Adı (Seri)</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {models.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className={styles.emptyState}>Henüz kayıtlı bir araç modeli (Seri) yok.</td>
                                </tr>
                            ) : (
                                models.map((model) => (
                                    <tr key={model.id}>
                                        <td>#{model.id}</td>
                                        <td>{model.brandName}</td>
                                        <td className={styles.fwBold}>{model.name}</td>
                                        <td className={styles.actions}>
                                            <button className={styles.actionBtnEdit} onClick={() => openModal('edit', model)}>Düzenle</button>
                                            <button className={styles.actionBtnDelete} onClick={() => handleDelete(model.id)}>Sil</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* EKLE/DÜZENLE POPUP'I (MODAL) */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'create' ? "Yeni Araç Modeli Ekle" : "Modeli Düzenle"}
            >
                <form onSubmit={handleSave} className={styles.formGroup}>
                    {error && <div className={styles.errorText}>{error}</div>}

                    {/* Marka Seçimi (Select Box) */}
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Hangi Markaya Ait?</label>
                        <select
                            className={styles.selectInput}
                            value={formData.brandId}
                            onChange={(e) => setFormData({ ...formData, brandId: Number(e.target.value) })}
                            required
                        >
                            <option value={0} disabled>Lütfen bir Marka seçiniz</option>
                            {brands.map(brand => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Model Adı (Örn: A4, X5, Egea)"
                        placeholder="Araba Serisi / Modeli"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        autoFocus
                    />

                    <div className={styles.modalActions}>
                        <Button type="submit" fullWidth>
                            {modalMode === 'create' ? "Modeli Kaydet" : "Güncelle"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default CarModels;
