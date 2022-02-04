import React, { useEffect } from "react";
import Aos from "aos";

import "aos/dist/aos.css";
import Tilt from "react-parallax-tilt";
function Contact() {
  useEffect(() => {
    Aos.init({ duration: 1500 });

  }, []);

  return (
    <>
      <section className=" container p-3" >
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-10 mx-auto">
              <div className="row">
                <div className="contact-leftside col-12 col-lg-5" data-aos="fade-right">
                  <h1 className="main-heading fw-bold">
                    Connect With Our <br /> ACM Team.
                  </h1>
                  <p className="main-hero-para">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Deserunt eaque alias similique.
                  </p>
                  <Tilt
                    data-tilt
                    perspective={500}
                 
                  >
                    <img
                      src="https://i.ibb.co/9r2C8Z4/5124556-removebg-preview.png"
                      alt="contatUsImg"
                      className="img-fluid"
                    />
                  </Tilt>
                </div>

                {/* right side contact form  */}
                <div className="contact-rightside col-12 col-lg-7 m-6">
                  <form>
                    <div className="d-none d-lg-block"> <br /><br /><br /><br /></div>
                    <div className="row" data-aos="fade-up" >
                      <div className="col-12 col-lg-6 contact-input-field">
                        <input
                          type="text"
                          name="firstName"
                          id=""
                          className=" form-control m-3"
                          placeholder="First Name"
                        />
                      </div>
                      <div className="col-12 col-lg-6 contact-input-feild">
                        <input
                          type="text"
                          name="lastName"
                          id=""
                          className=" form-control m-3"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                    <div className="row"  data-aos="fade-up">
                      <div className="col-12 col-lg-6 contact-input-feild">
                        <input
                          type="text"
                          name="phone"
                          id=""
                          className=" form-control m-3"
                          placeholder="Phone Number "
                        />
                      </div>
                      <div className="col-12 col-lg-6 contact-input-feild">
                        <input
                          type="text"
                          name="email"
                          id=""
                          className=" form-control m-3"
                          placeholder="Email ID"
                        />
                      </div>
                    </div>
                    <div className="row"  data-aos="fade-up">
                      <div className="col-12 contact-input-feild">
                        <input
                          type="text"
                          name="address"
                          id=""
                          className=" form-control m-3"
                          placeholder="Add Address"
                        />
                      </div>
                    </div>

                    <div className="row"  data-aos="fade-up">
                      <div className="col-12 ">
                        <input
                          type="text"
                          name="message"
                          id=""
                          className=" form-control m-3"
                          placeholder="Enter Your Message"
                        />
                      </div>
                    </div>
                    <div  className="form-check form-checkbox-style">
                      <input
                         className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckChecked"
                      />
                      <label
                         className="form-check-label" data-aos="fade-up"
                        
                      >
                        I agree that the ACM Team may contact me at the email
                        address or phone number above
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary align-center justify-content-center m-3" 
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
