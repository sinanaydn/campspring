import React, { useEffect, useState } from 'react';
import rentalService from '../../services/rentalService';
import type { RentalResponse } from '../../models/types';
import styles from './Rentals.module.css';

const Rentals: React.FC = () => {
    const [rentals, setRentals] = useState<RentalResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        rentalService.getAll()
            .then(data => {
                setRentals(data);
            })
            .catch(err => console.error("Kiralamalar çekilemedi", err))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className={styles.rentalsContainer}>
            <div className={styles.headerRow}>
                <h2>Kiralama Yönetimi</h2>
                <span className={styles.totalBadge}>{rentals.length} Kiralama</span>
            </div>

            {isLoading ? (
                <div className={styles.loading}>Kiralamalar yükleniyor... ⏳</div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Araç</th>
                                <th>Plaka</th>
                                <th>Kiracı</th>
                                <th>Başlangıç</th>
                                <th>Bitiş</th>
                                <th>Toplam Tutar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rentals.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className={styles.emptyState}>Henüz kiralama kaydı yok.</td>
                                </tr>
                            ) : (
                                rentals.map(rental => (
                                    <tr key={rental.id}>
                                        <td className={styles.fwBold}>{rental.carModelName}</td>
                                        <td><span className={styles.plate}>{rental.carPlate}</span></td>
                                        <td>{rental.userEmail}</td>
                                        <td>{rental.startDate}</td>
                                        <td>{rental.endDate}</td>
                                        <td className={styles.priceColumn}>₺{rental.totalPrice.toLocaleString('tr-TR')}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Rentals;
