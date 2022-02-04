import React,{useEffect} from "react";
import Tilt from "react-parallax-tilt";
import Aos from "aos";
import "aos/dist/aos.css";
function Feature_card(props) {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);
  return (
    <>
      <Tilt
        data-tilt
        perspective={500}
        glareEnable={true}
        glareMaxOpacity={0.45}
        scale={1.05}
        gyroscope={true}
        glareBorderRadius={10}
      >
        <div
          className="card  p-3 text text-white rounded bg-primary"
          style={{ width: "18rem"}}
        ><h3 className="" data-aos="fade-down"><i className={`${props.icon} text-primary rounded-circle bg-white p-3 m-3 `} > </i> </h3>
          
          <div className="card-body">
             <h4 className="card-title text-white" data-aos="fade-up">{props.title}</h4>
            <p className="card-text text-dark text-white ">{props.info}</p>

          </div>
        </div>
      </Tilt>
    </>
  );
}

export default Feature_card;
