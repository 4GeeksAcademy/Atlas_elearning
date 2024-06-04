import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserNavbar } from "../component/User/UserNavbar.jsx";
import { Context } from "../store/appContext.js";
import { LuHeart } from "react-icons/lu";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"

export const CourseCategorySelected = () => {
    const { store, actions } = useContext(Context);
    const { titleCategory } = useParams();
    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (store.category) {
            const categorySelected = store.category.filter(category => category.titleCategory === titleCategory);
            setCategories(categorySelected);
        }
    }, [store.category, titleCategory]);

    useEffect(() => {
        if (store.course && store.course.access_to_courses) {
            const categoryCourses = store.course.access_to_courses.filter(course => course.categoryTitle === titleCategory);
            setCourses(categoryCourses);
        }
    }, [store.course, titleCategory]);

    const handleAddTrolley = (titleCourse, id, price) => {
        actions.addCourseToTrolley(titleCourse, id, price);
    };

    return (
        <div>
            <UserNavbar />
            <button
                className="btnFav d-flex justify-content-center align-items-center top-50 end-0 translate-middle-y ms-3 mt-3"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasScrolling"
                aria-controls="offcanvasScrolling"
                onClick={() => navigate(`/`)}
            >
                <FaArrowLeft />
            </button>
            <div className="container-fluid">
                <h3>Courses:</h3>
                <div className="d-flex flex-wrap justify-content-center">
                    {courses.length === 0 ? (
                        "No hay Cursos Cargados"
                    ) : (
                        courses.map((item, index) => (
                            <div key={index} className='card border-0 cardEdit shadow rounded-5 text-white bg-dark col-xxl-3 col-xl-3 col-lg-4 col-md-5 col-sm-12 me-3 my-5' style={{ width: "20rem", minHeight: "20rem" }}
                                onClick={() => navigate(`/course/${item.id}`)}>
                                <div className="card-img-top">
                                    <div className="course-thumbnail">
                                        <img
                                            src={item.titleUrlMedia}
                                            className="img-fluid rounded-top-4"
                                            alt="course"
                                            style={{ objectFit: 'cover', width: '100%', height: '200px' }}
                                        />
                                    </div>
                                </div>

                                <div className="card-body rounded-bottom-4" style={{ backgroundColor: (item.id % 2 === 0) ? "#18BEBE" : (item.id % 3 === 0) ? "#3A6F99" : (item.id % 4 === 0) ? "#F6CA1F" : (item.id % 5 === 0) ? "#139895" : "#165D95" }}>
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h3 className="card-title fw-bolder fs-5 text-dark text-truncate">{item.title}</h3>
                                        </div>
                                        <div className="mt-3">
                                            <p className="border rounded-pill fs-6 py-1 px-2 me-2 d-inline-flex letter text-truncate" style={{ maxWidth: '48%', backgroundColor: "rgba(255, 255, 255, 0.5)" }}>{item.categoryTitle}</p>
                                            <p className="border rounded-pill fs-6 py-1 px-2 d-inline-flex letter text-truncate" style={{ maxWidth: '48%', backgroundColor: "rgba(255, 255, 255, 0.5)" }}>Modulos: {item.modulesLength}</p>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <div className="py-2 px-2 border fs-6 rounded-pill d-inline-flex justify-content-center align-items-center btnFav">
                                            <strong>subscribe</strong>
                                        </div>
                                        <button className='py-2 px-2 border fs-6 rounded-circle d-flex justify-content-center align-items-center btnFav' onClick={() => handleAddTrolley(item.title)}>
                                            <LuHeart size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

