import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext.js';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { UserNavbar } from '../component/User/UserNavbar.jsx';
import '../../styles/components.css'; // Ensure you import the CSS file
import { FaArrowLeft } from "react-icons/fa";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { GoXCircle } from "react-icons/go";

function Message({ content, details, className }) {
    const formatDate = (isoDate) => {
        if (!isoDate || isoDate === 'N/A') return 'N/A';
        const date = new Date(isoDate);
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son de 0 a 11
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    };

    return (
        <div className={className}>
            {content == "Ocurrió un error" && (
                <div className="bg-white border rounded-4 d-flex flex-column justify-content-center align-items-center border-danger">
                    <div className="text-danger fs-2"><GoXCircle /></div>
                    <p>{content}</p>
                </div>
            )}

            {details.status === 'COMPLETED' && (
                <div className="bg-white border rounded-4 d-flex flex-column justify-content-center align-items-center border-success">
                    <div className="text-success fs-2"><IoIosCheckmarkCircleOutline /></div>
                    <p className="letter my-2">Date: {formatDate(details.date)}</p>
                    <p className="letter my-2">ID Paypal: {details.idPaypal}</p>
                    <p className="letter my-2">Status: {details.status}</p>
                    <p className="letter my-2">Currency Code: {details.currencyCode}</p>
                    <p className="letter my-2">Value: {details.value}</p>
                    <p className="letter my-2">A Subscription of all courses for 30 days has been approved.</p>
                    <button className="btnFav my-2" onClick={handleHome}>Go to Dashboard</button>
                </div>
            )}
        </div>
    );
}

export function PaypalPayment() {
    const navigate = useNavigate();
    const initialOptions = {
        "client-id": "AevJ33XfD8OFiLiW8oNbuK33BjtIiZL3rNyccBkAwZArxDC8xmBcc4Th_ESuXEGqKBkBV83QXNl8I_ND",
        "enable-funding": "venmo",
        "disable-funding": "",
        currency: "USD",
        "data-page-type": "product-details",
        components: "buttons",
        "data-sdk-integration-source": "developer-studio",
    };

    const { store, actions } = useContext(Context);
    const [message, setMessage] = useState("");
    const [detailsPaypal, setDetailsPaypal] = useState({});
    const [getDataPaypal, setGetDataPaypal] = useState({
        date: 'N/A',
        idPaypal: 'N/A',
        status: 'N/A',
        currencyCode: 'N/A',
        value: 'N/A',
        typePayment: 'PAYPAL',
        courseId: 0 // Default value until it's updated later
    });

    const location = useLocation();
    const totalPrice = parseFloat(location.state?.totalPrice) || 0; // Ensure totalPrice is a number
    const numberCourse = location.state?.numberCourse || 0;

    function handleHome(){
        navigate("/")
    }

    // Update courseId with the correct value
    useEffect(() => {
        setGetDataPaypal(prevState => ({
            ...prevState,
            courseId: numberCourse
        }));
    }, [numberCourse]);

    const datos = {
        purchase_units: [
            {
                amount: {
                    currency_code: 'USD',
                    value: totalPrice.toFixed(2),
                },
            },
        ],
    };

    useEffect(() => {
        if (detailsPaypal) {
            setGetDataPaypal({
                date: detailsPaypal.create_time || 'N/A',
                idPaypal: detailsPaypal.id || 'N/A',
                status: detailsPaypal.status || 'N/A',
                currencyCode: detailsPaypal.purchase_units?.[0]?.amount?.currency_code || 'N/A',
                value: detailsPaypal.purchase_units?.[0]?.amount?.value || 'N/A',
                courseId: numberCourse
            });
        }
    }, [detailsPaypal, numberCourse]);

    async function createOrder(data, actions) {
        try {
            const orderID = await actions.order.create(datos);
            return orderID;
        } catch (error) {
            console.error("Error en order.create:", error);
            throw error;
        }
    }

    async function onApprove(data, actions) {
        try {
            const details = await actions.order.capture();
            setMessage(`Transacción completada por ${details.payer.name.given_name}!`);
            setDetailsPaypal(details);
            handleSentToPayment(details);
        } catch (error) {
            console.error('Error al capturar la transacción:', error);
            setMessage('Ocurrió un error al procesar la transacción.');
        }
    }

    async function onError(err) {
        console.error('Error durante la transacción:', err);
        setMessage(`Ocurrió un error durante la transacción: ${err.message}`);
    }

    async function handleSentToPayment(detailsPaypal) {
        const paymentData = {
            date: detailsPaypal.create_time,
            idPaypal: detailsPaypal.id,
            status: detailsPaypal.status,
            currencyCode: detailsPaypal.purchase_units?.[0]?.amount?.currency_code,
            value: detailsPaypal.purchase_units?.[0]?.amount?.value,
            typePayment: 'PAYPAL',
            courseId: numberCourse
        };
        await actions.createPayments(paymentData);
        await actions.getAccessCourse();
    }

    return (
        <div className="container mt-5 mb-5 ">
            <UserNavbar />
            <div className="card shadow-sm p-4 d-flex justify-content-center align-items-center">
                <div className='text-center d-flex justify-content-center align-items-center w-75 my-5'>
                    <button
                        className="btnFav"
                        type="button"
                        onClick={() => navigate(`/`)}
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="ms-5">Total: ${totalPrice.toFixed(2)}</h1>
                </div>

                <div className='text-center w-50'>
                    <PayPalScriptProvider options={initialOptions}>
                        <PayPalButtons
                            forceReRender={[totalPrice]}
                            style={{
                                shape: "pill",
                                layout: "vertical",
                                color: "silver",
                                label: "paypal",
                            }}
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                        />
                    </PayPalScriptProvider>
                </div>
                <div className='text-center w-75'>
                    <Message content={message} details={getDataPaypal} className="message-content" />
                </div>
            </div>
        </div>
    );
}
