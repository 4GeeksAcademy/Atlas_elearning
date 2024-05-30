import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../../store/appContext';
import { CloudinaryComponent } from '../CloudinaryComponent.jsx';

export const PostCourseM = () => {
    const { store, actions } = useContext(Context);
    const [active, setActive] = useState(false);
    const [counter, setCounter] = useState(7);
    const [courseData, setCourseData] = useState({
        title: '',
        categoryTitle: '',
        modulesLength: '',
        titleCertificateToGet: '',
        price: '',
        description: '',
        assessment: '',
        titleTeacher: '',
        dateExpiration: '',
        titleUrlMedia: `${store.media}`
    });

    const [media, setMedia] = useState('');
    const [mediaType, setMediaType] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData({
            ...courseData,
            [name]: value
        });
    };

    const resetCourseData = () => {
        setCourseData({
            title: '',
            categoryTitle: '',
            modulesLength: '',
            titleCertificateToGet: '',
            price: '',
            description: '',
            assessment: '',
            titleTeacher: '',
            dateExpiration: '',
            titleUrlMedia: ''
        });
    };

    async function handlerCreateCourse(e) {
        e.preventDefault();
        if (courseData.title !== '' && courseData.categoryTitle !== '' && courseData.modulesLength !== '' && courseData.titleCertificateToGet !== '' && courseData.price !== '') {
            console.log("Creating course with data:", courseData);
            await actions.createCourseNew(courseData);
            setCounter(0);
            resetCourseData()
        } else {
            alert('Ingrese todos los campos');
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter(prevCounter => prevCounter + 1);
        }, 500);

        return () => clearInterval(interval);
    }, []);

    const uploadMedia = async (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            await actions.uploadCloudinaryMedia(files);
            console.log("Uploaded media:", store.media);
        }
    };

    useEffect(() => {
        console.log("Media updated:", store.media);
        setMedia(store.media);
        setMediaType(store.mediaType);
        setLoading(store.loading);
        setCourseData(prevData => ({
            ...prevData,
            titleUrlMedia: store.media
        }));
    }, [store.media, store.mediaType, store.loading]);

    const msgError = typeof store.error === 'string' ? store.error : JSON.stringify(store.error);
    const msg = typeof store.msg === 'string' ? store.msg : JSON.stringify(store.msg);

    return (
        <div className="container">
            <div className="row justify-content-center border border-dark">
                <div className="col-lg-8 col-md-10 col-sm-12 ">
                    <div className="border border-dark rounded-3 p-4 my-5 shadow">
                        <div className="text-center position-relative">
                            {(msgError === '' && msg === '') ? (
                                <div className={`mt-3 fs-5 fw-bold ${(counter >= 1 && counter <= 5) ? "alert alert-danger" : "d-none"}`}>
                                    {"Internet or server connection failure"}
                                </div>
                            ) : (msgError === '') ? (
                                <div className={`mt-3 fs-5 fw-bold ${(counter >= 1 && counter <= 5) ? "alert alert-success" : "d-none"}`}>
                                    {msg}
                                </div>
                            ) : (
                                <div className={`mt-3 fs-5 fw-bold ${(counter >= 1 && counter <= 5) ? "alert alert-danger" : "d-none"}`}>
                                    {msgError}
                                </div>
                            )}
                        </div>

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
                                <label className="form-label">Title Certificate To Get</label>
                                <input
                                    type="text"
                                    name="titleCertificateToGet"
                                    value={courseData.titleCertificateToGet}
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
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    name="description"
                                    value={courseData.description}
                                    onChange={handleChange}
                                    className="form-control"
                                    rows="3">
                                </textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Title Teacher</label>
                                <input
                                    type="text"
                                    name="titleTeacher"
                                    value={courseData.titleTeacher}
                                    onChange={handleChange}
                                    className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Assessment</label>
                                <input
                                    type="text"
                                    name="assessment"
                                    value={courseData.assessment}
                                    onChange={handleChange}
                                    className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Date Expiration</label>
                                <input
                                    type="date"
                                    name="dateExpiration"
                                    value={courseData.dateExpiration}
                                    onChange={handleChange}
                                    className="form-control" />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Upload Media</label>
                                <input type="file" className="form-control" onChange={uploadMedia} />
                                {store.loading ? (
                                    <div className="text-center mt-3">
                                        <div className="spinner-border" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                ) : (
                                    store.media && (
                                        store.mediaType === 'image' ? (
                                            <img src={store.media} className="img-fluid mt-3" alt="Uploaded" />
                                        ) : (
                                            <video controls className="img-fluid mt-3">
                                                <source src={store.media} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        )
                                    )
                                )}
                            </div>

                            <button type="submit" className="btn btn-primary w-100">Upload Course</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};