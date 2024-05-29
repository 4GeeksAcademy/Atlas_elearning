import React, { useState, useContext } from 'react';
import { Context } from '../../store/appContext';
import { useNavigate } from 'react-router-dom';
import { GoArrowLeft } from "react-icons/go";

export const ModuleCourse = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const initialFormState = {
        courseId: '',
        descriptionContent: '',
        typeFile: '',
        title: '',
        videoId: '',
        typeVideo: '',
        textId: '',
        typeText: '',
        imageId: '',
        typeImage: '',
        totalVideo: '',
    };

    const [formData, setFormData] = useState(initialFormState);
    const [moduleCreated, setModuleCreated] = useState(false); // Nuevo estado

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await actions.postModule(formData);
            console.log(response);
            setModuleCreated(true); // Actualizar el estado para indicar que se ha creado el módulo
            navigate('/success'); 
        } catch (error) {
            console.error(error);
        }
    };

    const formFields = [
        { label: "Course ID", name: "courseId", type: "text", required: true },
        { label: "Description Content", name: "descriptionContent", type: "text", required: true },
        { label: "Type of File", name: "typeFile", type: "text", required: true },
        { label: "Title", name: "title", type: "text", required: true },
        { label: "Video ID", name: "videoId", type: "text" },
        { label: "Type of Video", name: "typeVideo", type: "text" },
        { label: "Text ID", name: "textId", type: "text" },
        { label: "Type of Text", name: "typeText", type: "text" },
        { label: "Image ID", name: "imageId", type: "text" },
        { label: "Type of Image", name: "typeImage", type: "text" },
        { label: "Total Video", name: "totalVideo", type: "text" },
    ];

    return (
        <div className="container">
            <h2>Create Course Module</h2>
            {moduleCreated && ( // Mostrar la alerta si el módulo se ha creado correctamente
                <div className="alert alert-success" role="alert">
                    Module created successfully!
                </div>
            )}
            <form onSubmit={handleSubmit}>
                {formFields.map((field) => (
                    <div className="form-group" key={field.name}>
                        <label>{field.label}</label>
                        <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            className="form-control"
                            required={field.required}
                        />
                    </div>
                ))}
                <button type="submit" className="btn btn-primary">Create Modul e</button>
            </form>
            <button onClick={() => navigate(-1)} className="btn btn-secondary">
                <GoArrowLeft /> Back
            </button>
        </div>
    );
};
