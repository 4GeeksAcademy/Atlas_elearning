import React, { useState, useEffect } from 'react';
import { UserNavbar } from '../../component/User/UserNavbar.jsx';
import CourseCard from '../../component/Courses/CourseCard.jsx';
import '../../../styles/components.css';

const ViewCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    fetch('/api/view/courses') // Ruta para obtener los cursos del usuario
      .then(response => response.json())
      .then(data => {
        // Verificar si hay datos de cursos disponibles
        if (data && data.access_to_courses && data.access_to_courses.length > 0) {
          setCourses(data.access_to_courses); // Establecer los cursos obtenidos del usuario
        } else {
          console.log('No courses found for the user.');
        }
      })
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className={isFullScreen ? "full-screen" : ""}>
      <UserNavbar />
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Available Courses</h2>
          <button className="btn btn-primary" onClick={toggleFullScreen}>
            {isFullScreen ? "Exit Full Screen" : "Full Screen"}
          </button>
        </div>
        <div className="row">
          {courses.map(course => (
            <div key={course.id} className="col-md-4 mb-4">
              <CourseCard
                id={course.id}
                img={course.img}
                title={course.title}
                description={course.description}
                price={course.price}
                categoryTitle={course.categoryTitle}
                modulesLength={course.modulesLength}
                titleTeacher={course.titleTeacher}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewCourses;






