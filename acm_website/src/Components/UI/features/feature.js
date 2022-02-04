import React, { useEffect } from "react";
import Card from "./feature_card";
import Aos from "aos";
import "aos/dist/aos.css";

function Feature() {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <>
      <h2 className="text-center justify-content-center  main-heading fw-bold" data-aos="fade-right" >
        FEATURES
      </h2>
      <div className="container d-flex flex-wrap text-center justify-content-center ">
        <div data-aos="flip-up" className="m-3">
          <Card
            title="CODEPEN"
            icon="fab fa-codepen"
            info="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque perferendis sit impedit ipsum ad quisquam optio beatae molestias, deserunt quidem temporibus quibusdam suscipit delectus maxime qui nulla corporis? Facere ab dignissimos aspernatur aliquam eveniet. "
          />
        </div>
        <div data-aos="flip-up" className="m-3">
          <Card
            title="DISCUSSION FORUM"
            icon="fas fa-user-friends"
            info="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque perferendis sit impedit ipsum ad quisquam optio beatae molestias, deserunt quidem temporibus quibusdam suscipit delectus maxime qui nulla corporis aliquam"
          />
        </div>
        <div data-aos="flip-up" className="m-3">
          <Card
            title="INTERVIEW QUESTIONS "
            icon="fas fa-comments" 
            info="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque perferendis sit impedit ipsum ad quisquam optio beatae molestias, deserunt quidem temporibus quibusdam suscipit delectus maxime qui nulla corporis aliquam"
          />
        </div>
        <div data-aos="flip-up" className="m-3">
          <Card
            title="CODE COMPILER"
            icon="fas fa-code"
            info="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque perferendis sit impedit ipsum ad quisquam optio beatae molestias, deserunt quidem temporibus quibusdam suscipit delectus maxime qui nulla corporis? Facere ab dignissimos aspernatur aliquam eveniet. "
          />
        </div>
      </div>
    </>
  );
}

export default Feature;
