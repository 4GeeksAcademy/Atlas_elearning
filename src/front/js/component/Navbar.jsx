import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Context } from '../store/appContext';

export const Navbar = () => {
    const { store, actions } = useContext(Context)
    const navigate = useNavigate()

    function handleHomeView() {
        localStorage.removeItem('jwt-token')
        navigate('/SignOut')
    }

    return (
        <div>
            <nav className="navbar navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand">Atlas learning</a>
                    <div className="d-flex">

                        {
                            (localStorage.getItem('jwt-token'))
                                ? <div>
                                <Link to={`/${store.currentRole}View`}>
                                    <button className='btn btn-outline-success m-1' >Panel</button>
                                </Link>

                                <button className="btn btn-outline-danger m-1" onClick={handleHomeView}>
                                    Sign Out
                                </button>

                            </div>
                                : <div>
                                    <Link to='/FormUser'>
                                        <button className='btn btn-outline-success m-1' >Sign Up</button>
                                    </Link>
                                    <Link to='/logIn'>
                                        <button className="btn btn-outline-success m-1" >Log In</button>
                                    </Link>
                                </div>
                        }



                        <button className='btn btn-outline-success m-1'><i className="fa-solid fa-cart-shopping fa-fade" style={{ color: "#13ec49" }}></i></button>
                    </div>
                </div>
            </nav>
        </div>
    )
}
