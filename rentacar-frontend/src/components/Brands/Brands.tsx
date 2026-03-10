import React, { useEffect, useState } from 'react';
import brandService from '../../services/brandService';
import { type BrandResponse } from '../../models/types';
import Button from '../Button/Button';
import Input from '../Input/Input';
import Modal from '../Modal/Modal';
import styles from './Brands.module.css';

const Brands: React.FC = () => {
    const [brands, setBrands] = useState<BrandResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    const [formData, setFormData] = useState({ id: 0, name: '' });
    const [error, setError] = useState<string | null>(null);

    // İlk açılışta Markaları Getir
    const fetchBrands = async () => {
        setIsLoading(true);
        try {
            const data = await brandService.getAll();
            setBrands(data);
        } catch (err) {
            console.error("Markalar çekilirken hata oluştu");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    // Form Modalı Aç/Kapat (Ekleme/Güncelleme için ortak yapımız)
    const openModal = (mode: 'create' | 'edit', brand?: BrandResponse) => {
        setError(null);
        setModalMode(mode);
        if (mode === 'edit' && brand) {
            setFormData({ id: brand.id, name: brand.name });
        } else {
            setFormData({ id: 0, name: '' }); // Sıfırla
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            if (modalMode === 'create') {
                await brandService.add({ name: formData.name });
            } else {
                await brandService.update({ id: formData.id, name: formData.name });
            }
            setIsModalOpen(false); // Başarılıysa popup'ı kapat
            fetchBrands(); // Listeyi yenile
        } catch (err: any) {
            setError(err.response?.data?.detail || "Bir hata oluştu");
        }
    };

    // Marka Sil
    const handleDelete = async (id: number) => {
        if (window.confirm("Bu markayı silmek istediğinize emin misiniz?")) {
            try {
                await brandService.delete(id);
                fetchBrands(); // Yenile
            } catch (err: any) {
                alert("Silme işlemi başarısız veya bu markaya bağlı araçlar var.");
            }
        }
    };

    return (
        <div className={styles.brandsContainer}>
            <div className={styles.headerRow}>
                <h2>Marka Yönetimi</h2>
                <Button onClick={() => openModal('create')}>+ Yeni Marka Ekle</Button>
            </div>

            {isLoading ? (
                <div className={styles.loading}>Yükleniyor...</div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Marka Adı</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className={styles.emptyState}>Henüz kayıtlı marka yok.</td>
                                </tr>
                            ) : (
                                brands.map((brand) => (
                                    <tr key={brand.id}>
                                        <td>#{brand.id}</td>
                                        <td className={styles.fwBold}>{brand.name}</td>
                                        <td className={styles.actions}>
                                            <button className={styles.actionBtnEdit} onClick={() => openModal('edit', brand)}>Düzenle</button>
                                            <button className={styles.actionBtnDelete} onClick={() => handleDelete(brand.id)}>Sil</button>
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
                title={modalMode === 'create' ? "Yeni Marka Ekle" : "Markayı Düzenle"}
            >
                <form onSubmit={handleSave} className={styles.formGroup}>
                    {error && <div className={styles.errorText}>{error}</div>}
                    <Input
                        label="Marka Adı"
                        placeholder="Örn: BMW, Mercedes, Renault..."
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        autoFocus
                    />
                    <div className={styles.modalActions}>
                        <Button type="submit" fullWidth>
                            {modalMode === 'create' ? "Kaydet" : "Güncelle"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Brands;
