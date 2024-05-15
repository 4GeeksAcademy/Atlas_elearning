import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import { FaCircleArrowLeft } from "react-icons/fa6";
import { TeacherCourses } from '../component/TeacherCourses.jsx'
import { TeacherStudents } from './TeacherStudents.jsx';
import { TeacherFiles } from './TeacherFiles.jsx';
import { TeacherMyPayment } from './TeacherMyPayment.jsx';
import { TeacherSettings } from './TeacherSettings.jsx';

export const TeacherDashboard = () => {
    const { store, actions } = useContext(Context);

    const navigate = useNavigate();

    function handleHome() {
        navigate('/');
    }

    const [buttonSelected, setButtonSelected] = useState(null)

    const handleMyCourses =()=>{
        setButtonSelected(<TeacherCourses />)
    }

    
    const handleMyStudents =()=>{
        setButtonSelected(<TeacherStudents />)
    }
   
    const  handleMyFiles =()=>{
        setButtonSelected(<TeacherFiles />)
    }
    
    const  handleMyPayment =()=>{
        setButtonSelected(<TeacherMyPayment />)
    }

        
    const  handleSettings =()=>{
        setButtonSelected(<TeacherSettings />)
    }
  
    return (
        <div>
            <div className='row' style={{ height: '200vh' }}>

                <div className='col-3 border border-secondary text-center'>
                    <div className='text-center my-3 d-flex align-items-center justify-content-center'>

                        <div className='fs-4' onClick={handleHome} style={{ cursor: "pointer" }}>
                            <FaCircleArrowLeft />
                        </div>
                        <div>
                            <h3 className='text-center d-inline mx-2'>Welcome!</h3>
                        </div>
                    </div>
                    <div>
                        <div className='border-bottom w-100 mx-1 my-3 pb-3'><h5 className='fw-bolder'>Profile</h5></div>

                        <div className='col-12 w-100'>
                        
                            <button className='btn btn-outline-primary my-2 w-75' onClick={handleMyCourses}>My courses</button>
                        </div>

                        <div className='col-12 w-100'>
                           
                            <button className='btn btn-outline-primary my-2 w-75' onClick={handleMyStudents} >My students</button>
                        </div>

                        <div className='col-12 w-100'>
                           
                           <button className='btn btn-outline-primary my-2 w-75' onClick={handleMyFiles} >My files</button>
                       </div>


                        <div className='col-12 w-100'>
                            
                                <button className='btn btn-outline-primary my-2 w-75' onClick={handleMyPayment}>Payment history</button>
                            
                        </div>

                        <div className='col-12 w-100'>
                            
                                <button className='btn btn-outline-primary my-2 w-75'onClick={handleSettings}>Settings</button>
                            
                        </div>
                    </div>
                </div>

               
                <div className='col border border-secondary'>
                  <div className="col-9">
                     {buttonSelected}
            </div>
                </div>
            </div>
        </div>
    );
};