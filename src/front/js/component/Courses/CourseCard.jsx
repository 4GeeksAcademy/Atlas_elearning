import React, { useContext } from "react";
import { Context } from '../../store/appContext';
import { useNavigate } from "react-router-dom";
import '../../../styles/components.css';

const CourseCard = ({ id, img, title, description, price, categoryTitle, modulesLength, titleTeacher }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const handleViewCourse = () => {
    if (store.currentUser && store.currentUser.role === 'student') {
      navigate(`/view/courses/${id}`);
    }
  };

  const handleAddToTrolley = () => {
    actions.addCourseToTrolley(id);
  };

  return (
    <div className="card mx-2 shadow" style={{ width: "18rem", height: "auto", paddingTop: "20px", paddingBottom: "20px" }}>
      <div className="card-img-top">
        <div className="course-thumbnail">
          <img
            src={img}
            className="img-fluid"
            alt={title}
            style={{ objectFit: 'cover', width: '100%', height: '180px' }}
          />
        </div>
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{title}</h5>
        <p className="card-text"><strong>Category: </strong>{categoryTitle}</p>
        <p className="card-text"><strong>Modules: </strong>{modulesLength}</p>
        <p className="card-text"><strong>Teacher: </strong>{titleTeacher}</p>
        <p className="card-text"><strong>Price: </strong>${price}</p>
        <p className="card-text">{description}</p>
        <div className="d-flex justify-content-between mt-auto">
          <button type="button" className="btn btn-primary" onClick={handleViewCourse}>
            View Course
          </button>
          <button type="button" className="btn btn-success" onClick={handleAddToTrolley}>
            Buy Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
