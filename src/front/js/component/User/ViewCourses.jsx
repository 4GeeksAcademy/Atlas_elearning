import React, { useState, useEffect } from 'react';
import { UserNavbar } from '../../component/User/UserNavbar.jsx';
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
        <div>
          {courses.map(course => (
            <div key={course.id} className="mb-4">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>Price: {course.price}</p>
              <p>Category: {course.categoryTitle}</p>
              <p>Teacher: {course.titleTeacher}</p>
              <p>Modules:</p>
              <ul>
                {course.modules.map(module => (
                  <li key={module.id}>
                    <strong>{module.title}</strong> - {module.description}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewCourses;






