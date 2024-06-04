import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/components.css';
import { Context } from '../store/appContext';

export const Suscribe = () => {
    const { store, actions } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();

    const courses = [

        { title: "15 days test", price: "$15" , soon: "soon"},
        { title: "Access all our courses", price: "$35" },
        { title: "All courses + certificate", price: "$40" , soon: "soon"},

    ];

    function test() {
        actions.updateMsg("")
    }

    /*  function handleAddTrolley(titleCourse, courseId, price) {
         // Remove the $ sign and convert the string to a number
         const cleanedPrice = parseFloat(price.replace('$', ''));
         console.log(titleCourse, courseId, cleanedPrice);
         navigate('/paypal', { state: { totalPrice: cleanedPrice, numberCourse: courseId } });
     } */

    const handleCheckout = (titleCourse, courseId, price) => {
        const cleanedPrice = parseFloat(price.replace('$', ''));
        console.log(titleCourse, courseId, cleanedPrice);

        if (courseId !== undefined) {
            navigate('/paypal', { state: { totalPrice: cleanedPrice, numberCourse: courseId } });
        } else {
            alert('Not Available.');
        }
    };

    return (
        <div className=" text-center container-fluid d-flex flex-column justify-content-around align-items-center" style={{ height: "100vh" }}>
            <div className="d-flex align-items-center">
            <h1 className="poppins-extrabold-italic lh-lg fw-light text-uppercase text-dark">Unleash your curiosity, enjoy the learning process, and reach new heights with us.</h1>


            </div>
            <div className='d-flex justify-content-center' >
                {courses.map((course, index) => (
                    <div key={index} className='card border-0 cardEdit shadow rounded-5 text-white bg-dark col-xxl-3 col-xl-3 col-lg-4 col-md-5 col-sm-12 me-3' style={{ height: "60vh" }}>
                        <div className="card-body rounded-4 p-3 d-flex flex-column justify-content-around align-items-center" style={{
                            backgroundColor: (index % 2 === 0) ? "#165D95" : "#3A6F99"
                        }}>
                            <div>
                                <h3 className="card-title fw-bolder fs-2 text-white">{course.title}</h3>
                            </div>

                            <div className="d-flex justify-content-end mt-3">
                                <p className="fs-1 py-1 px-1 me-3 d-inline-flex text-white">{course.price}</p>
                            </div>

                            <div id='Suscribe'
                                className={`py-2 px-4 border fs-5 rounded-pill d-inline-flex justify-content-center align-items-center btnFav ${course.soon === "soon" ? "disabled" : ""}`}
                                onClick={() => {
                                    if (course.soon !== "soon") {
                                        handleCheckout(course.title, index, course.price);
                                    }
                                }}
                            >
                                <strong style={{ cursor: course.soon === "soon" ? "not-allowed" : "pointer" }}>
                                    {course.soon === "soon" ? "Soon" : "Subscribe"}
                                </strong>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
