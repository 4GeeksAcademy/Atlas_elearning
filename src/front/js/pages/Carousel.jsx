import React from 'react';

export const Carousel = () => {
    return (

        <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
            <div className="carousel-inner" style={{ height: "100vh", objectFit: "cover" }}>
                <div className="carousel-item active" style={{ height: "100vh", objectFit: "cover" }}>
                    <img src="https://res.cloudinary.com/dfoegvmld/image/upload/v1717467454/mooiato6fhy7vcrkmr7p.png" className="d-block w-100 opacity-25" alt='Img de Paris' style={{ height: "100vh", objectFit: "cover" }}/>
                    <div className='carousel-caption top-0 d-flex flex-column justify-content-around'>
                        <p className='mt-5 fs-3 text-uppercase fw-bolder' style={{ color: "#165D95" }}>We carry the weight of knowledge so that studying is light for you</p>
                        <h1 className='display-1 fw-bolder text-uppercase item-edit' style={{ color: "#165D95" }}>Atlas</h1>
                        <div className='row d-flex justify-content-between'>
                            <a href="#" className='btnFav2 col-md-5 col-sm-12 justify-content-center fs-4 text-decoration-none fw-bolder'>Explore</a>
                            <a href="#Suscribe" className='btnFav col-md-5 col-sm-12 justify-content-center fs-4 text-decoration-none fw-bolder'>Subscribe</a>
                        </div>
                    </div>
                </div>
                <div className="carousel-item" style={{ height: "100vh", objectFit: "cover" }}>
                    <img src="https://firebase.google.com/static/images/products/realtime-database/database-3.png?hl=es-419" className="d-block w-100 opacity-25" alt='Img de Sydney'  style={{ height: "100vh", objectFit: "cover" }}/>
                    <div className='carousel-caption top-0 d-flex flex-column justify-content-around'>
                        <p className='mt-5 fs-3 text-uppercase  fw-bolder' style={{ color: "#165D95" }}>Take advantage of our subscriptions</p>
                        <h1 className='display-2 fw-bolder text-uppercase' style={{ color: "#165D95" }}>Intensive Course</h1>
                        <div className='row d-flex justify-content-between'>
                            <a href="#" className='btnFav2 col-md-5 col-sm-12 justify-content-center fs-4 text-decoration-none fw-bolder'>Explore</a>
                            <a href="#Suscribe" className='btnFav col-md-5 col-sm-12 justify-content-center fs-4 text-decoration-none fw-bolder'>Subscribe</a>
                        </div>
                    </div>
                </div>
                <div className="carousel-item" style={{ height: "100vh", objectFit: "cover" }}>
                    <img src="https://content.cuerpomente.com/medio/2023/10/17/atlas_20b57cee_231017144606_1200x630.jpg" className="d-block w-100 opacity-25" alt='Img de Vzla'  style={{ height: "100vh", objectFit: "cover" }}/>
                    <div className='carousel-caption top-0 d-flex flex-column justify-content-around'>
                        <p className='mt-5 fs-3 text-uppercase fw-bolder' style={{ color: "#165D95" }}>Share your knowledge to improve the world</p>
                        <h1 className='display-3 fw-bolder text-uppercase ' style={{ color: "#165D95" }}>Teach others, and upload your content...</h1>
                        <div className='row d-flex justify-content-between'>
                            <a href="#" className='btnFav2 col-md-5 col-sm-12 justify-content-center fs-4 text-decoration-none fw-bolder'>Explore</a>
                            <a href="#Suscribe" className='btnFav col-md-5 col-sm-12 justify-content-center fs-4 text-decoration-none fw-bolder'>Subscribe</a>
                        </div>
                    </div>
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>

    )
}
