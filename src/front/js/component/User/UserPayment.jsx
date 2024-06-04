import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../store/appContext';

export const UserPayment = () => {
    const { store } = useContext(Context);
    const urlPayments = process.env.BACKEND_URL + '/api/payment/courses';

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userToLogin = JSON.parse(localStorage.getItem("userToLogin"));
    // console.log("User to Login:", userToLogin);

    // Obtener el userId basado en el email del usuario logueado
    const currentUser = store.user?.access_to_user.find(user => user.email === userToLogin.email);
    // console.log("Current User:", currentUser);

    const paymentInfo = async () => {
        try {
            const response = await fetch(urlPayments);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            console.log("Data from backend:", data);

            // data.payments.forEach((payment, index) => {
            //   console.log(`Payment ${index + 1}:`, payment); // Verificar cada pago
            // });

            if (currentUser && currentUser.id) {
                const userPayments = data.payments.filter(payment => payment.userId === currentUser.id);
                console.log("Filtered Payments:", userPayments); // Verificar pagos filtrados
                setPayments(userPayments);
            } else {
                console.error("Current user does not have a valid id.");
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser && currentUser.id) {
            paymentInfo();
        }
    }, [currentUser]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Nro Paypal #</th>
                        <th scope="col">Date</th>
                        <th scope="col">Status</th>
                        <th scope="col">Currency</th>
                        <th scope="col">Value</th>
                        <th scope="col">Type of payment</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.length > 0 ? (
                        payments.map((pay, index) => (
                            <tr key={index}>
                                <th scope="row">{pay.idPaypal}</th>
                                <td>{pay.date}</td>
                                <td>{pay.status}</td>
                                <td>{pay.currencyCode}</td>
                                <td>{pay.value}</td>
                                <td>{pay.typePayment}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No payments found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
};





