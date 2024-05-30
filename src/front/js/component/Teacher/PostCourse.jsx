
import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '../../store/appContext'

export const PostCourse = () => {
    const { store, actions } = useContext(Context)
    const [active, setActive] = useState(false)
    const [counter, setCounter] = useState(7)
    const [courseData, setCourseData] = useState({
        title: '',
        categoryTitle: '',
        modulesLength: '',
        certificate: '',
        price: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData({
            ...courseData,
            [name]: value
        });
    };

    async function handlerCreateCourse(e) {
        e.preventDefault();
        if (courseData.title !== '' && courseData.categoryTitle !== '' && courseData.modulesLength !== '' && courseData.certificate !== '' && courseData.price !== '') {
            await actions.createCourseNew(courseData)
            setCounter(0)
        } else {
            alert('Please fill in all fields')
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter(prevCounter => {
                return prevCounter + 1;
            });
        }, 500);

        return () => clearInterval(interval)
    }, [])

    const msgError = typeof store.error === 'string' ? store.error : JSON.stringify(store.error)
    const msg = typeof store.msg === 'string' ? store.msg : JSON.stringify(store.msg)


    return (
        <div className="container">
            {/* Msg */}
            <div className="row justify-content-center position-relative">
                <div className="col-lg-8 col-md-10 col-sm-12 text-center">
                    {msgError === ''
                        ? <div className={`mt-3 fs-4 fw-bold ${(counter >= 1 && counter <= 5) ? "alert alert-success" : "d-none"}`}>
                            {msg}
                          </div>
                        : <div className={`mt-3 fs-4 fw-bold ${(counter >= 1 && counter <= 5) ? "alert alert-danger" : "d-none"}`}>
                            {msgError}
                          </div>}
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10 col-sm-12">
                    <div className="border border-dark rounded-3 p-4 my-5 shadow">
                        <div className="text-center mb-4">
                            <h1 className="display-4">Create New Course</h1>
                        </div>
                        
                        <form onSubmit={handlerCreateCourse}>
                            <div className="mb-3">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={courseData.title}
                                    onChange={handleChange}
                                    className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Category Title</label>
                                <input
                                    type="text"
                                    name="categoryTitle"
                                    value={courseData.categoryTitle}
                                    onChange={handleChange}
                                    className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Modules Length</label>
                                <input
                                    type="number"
                                    name="modulesLength"
                                    value={courseData.modulesLength}
                                    onChange={handleChange}
                                    className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Certificate</label>
                                <input
                                    type="text"
                                    name="certificate"
                                    value={courseData.certificate}
                                    onChange={handleChange}
                                    className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={courseData.price}
                                    onChange={handleChange}
                                    className="form-control" />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Upload Course</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};