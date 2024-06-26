import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Context } from '../../store/appContext';


import { AddUser } from '../AddUser.jsx';

export const ActiveUsers = () => {
    const { store, actions } = useContext(Context);

    const [active, setActive] = useState(false);
    const [rol, setRol] = useState("user");

    const navigate = useNavigate();

    const handleUpdateUser = (userId) => {
        navigate(`/userUpdate/${userId}`);
    };

    const deleteUser = (rol, userId) => {
        actions.deleteUser(rol, userId);
    };

    const toggleActive = () => {
        setActive(!active);
    };

    const [users, setUsers] = useState(store.user.access_to_user);

    return (
        <div className="container d-flex justify-content-center align-items-center p-4">
            {store.spinner ? (
                <div className="d-flex justify-content-center">
                    <div>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-center">Loading...</p>
                    </div>
                </div>
            ) : (
                <div className='border border-primary rounded mx-5 my-2 py-3 px-3 text-center'>
                    <div>
                        {store.user.access_to_user.length === 0 ? (
                            "There are no registered users"
                        ) : (
                            <table className="table mx-auto">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Last Name</th>
                                        <th scope="col">Correo</th>
                                        <th scope="col">Number Document</th>
                                        <th scope="col">Phone</th>
                                        <th scope="col">Username</th>
                                        <th scope="col">Gender</th>
                                        <th scope="col">EDIT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {store.user.access_to_user.map((item, index) => (
                                        <tr key={item.id || index}>
                                            <th scope="row">{item.id}</th>
                                            <td>{item.name}</td>
                                            <td>{item.lastName}</td>
                                            <td>{item.email}</td>
                                            <td>{item.numberDocument}</td>
                                            <td>{item.phone}</td>
                                            <td>{item.username}</td>
                                            <td>{item.gender}</td>
                                            <td>
                                                <button onClick={() => handleUpdateUser(item.id)}>Edit</button>
                                                <button onClick={() => deleteUser(rol, item.id)}>Del</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    <button onClick={toggleActive}>Add</button>
                    <div className={`${active ? "d-block" : "d-none"}`}>
                        <AddUser />
                    </div>
                </div>
            )}
        </div>
    );
};
