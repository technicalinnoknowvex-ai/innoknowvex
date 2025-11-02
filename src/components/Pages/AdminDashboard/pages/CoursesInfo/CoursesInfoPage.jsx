import React from "react";
import style from "./style/coursesinfo.module.scss";
import SideNavigation from "../../SideNavigation/SideNavigation";
import Image from "next/image";

const CoursesInfoPage = () => {
  return (
    <>
      <div className={style.main}>
        <SideNavigation />
        <div className={style.coursesInfoContent}>
          <div className={style.figures}>
            <p>Total Students : 100</p>
            <p>Total Courses : 100</p>
          </div>

          <div className={style.allcards}>
            <div className={style.cardsection}>
              <div className={style.card}>
                <div className={style.left}>
                  <Image
                    src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/Python.jpg"
                    height={100}
                    width={150}
                    alt="course pic"
                    className={style.courseimg}
                  />
                  <p>Python Programming</p>
                </div>
                <div className={style.right}>
                  <p className={style.p1}>
                    Self
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      className={style.svglink}
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                      />
                    </svg>
                  </p>

                  <p>
                    <span className={style.currentPrice}>₹5000</span>
                    <span className={style.originalPrice}>₹8000</span>
                  </p>
                  <p className={style.discount}>14% OFF</p>
                  <button className={style.edit}>Edit</button>
                </div>
              </div>
              <div className={style.card}>
                <div className={style.left}>
                  <Image
                    src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/Python.jpg"
                    height={100}
                    width={150}
                    alt="course pic"
                    className={style.courseimg}
                  />
                  <p>Python Programming</p>
                </div>
                <div className={style.right}>
                  <p className={style.p1}>
                    Self
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      className={style.svglink}
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                      />
                    </svg>
                  </p>

                  <p>
                    <span className={style.currentPrice}>₹5000</span>
                    <span className={style.originalPrice}>₹8000</span>
                  </p>
                  <p className={style.discount}>14% OFF</p>
                  <button className={style.edit}>Edit</button>
                </div>
              </div>
              <div className={style.card}>
                <div className={style.left}>
                  <Image
                    src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/Python.jpg"
                    height={100}
                    width={150}
                    alt="course pic"
                    className={style.courseimg}
                  />
                  <p>Python Programming</p>
                </div>
                <div className={style.right}>
                  <p className={style.p1}>
                    Self
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      className={style.svglink}
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                      />
                    </svg>
                  </p>

                  <p>
                    <span className={style.currentPrice}>₹5000</span>
                    <span className={style.originalPrice}>₹8000</span>
                  </p>
                  <p className={style.discount}>14% OFF</p>
                  <button className={style.edit}>Edit</button>
                </div>
              </div>
            </div>
            <div className={style.cardsection}>
              <div className={style.card}>
                <div className={style.left}>
                  <Image
                    src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/Python.jpg"
                    height={100}
                    width={150}
                    alt="course pic"
                    className={style.courseimg}
                  />
                  <p>Python Programming</p>
                </div>
                <div className={style.right}>
                  <p className={style.p1}>
                    Self
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      className={style.svglink}
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                      />
                    </svg>
                  </p>

                  <p>
                    <span className={style.currentPrice}>₹5000</span>
                    <span className={style.originalPrice}>₹8000</span>
                  </p>
                  <p className={style.discount}>14% OFF</p>
                  <button className={style.edit}>Edit</button>
                </div>
              </div>
              <div className={style.card}>
                <div className={style.left}>
                  <Image
                    src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/Python.jpg"
                    height={100}
                    width={150}
                    alt="course pic"
                    className={style.courseimg}
                  />
                  <p>Python Programming</p>
                </div>
                <div className={style.right}>
                  <p className={style.p1}>
                    Self
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      className={style.svglink}
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                      />
                    </svg>
                  </p>

                  <p>
                    <span className={style.currentPrice}>₹5000</span>
                    <span className={style.originalPrice}>₹8000</span>
                  </p>
                  <p className={style.discount}>14% OFF</p>
                  <button className={style.edit}>Edit</button>
                </div>
              </div>
              <div className={style.card}>
                <div className={style.left}>
                  <Image
                    src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/Python.jpg"
                    height={100}
                    width={150}
                    alt="course pic"
                    className={style.courseimg}
                  />
                  <p>Python Programming</p>
                </div>
                <div className={style.right}>
                  <p className={style.p1}>
                    Self
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      className={style.svglink}
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                      />
                    </svg>
                  </p>

                  <p>
                    <span className={style.currentPrice}>₹5000</span>
                    <span className={style.originalPrice}>₹8000</span>
                  </p>
                  <p className={style.discount}>14% OFF</p>
                  <button className={style.edit}>Edit</button>
                </div>
              </div>
            </div>
            <div className={style.cardsection}>
              <div className={style.card}>
                <div className={style.left}>
                  <Image
                    src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/Python.jpg"
                    height={100}
                    width={150}
                    alt="course pic"
                    className={style.courseimg}
                  />
                  <p>Python Programming</p>
                </div>
                <div className={style.right}>
                  <p className={style.p1}>
                    Self
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      className={style.svglink}
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                      />
                    </svg>
                  </p>

                  <p>
                    <span className={style.currentPrice}>₹5000</span>
                    <span className={style.originalPrice}>₹8000</span>
                  </p>
                  <p className={style.discount}>14% OFF</p>
                  <button className={style.edit}>Edit</button>
                </div>
              </div>
              <div className={style.card}>
                <div className={style.left}>
                  <Image
                    src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/Python.jpg"
                    height={100}
                    width={150}
                    alt="course pic"
                    className={style.courseimg}
                  />
                  <p>Python Programming</p>
                </div>
                <div className={style.right}>
                  <p className={style.p1}>
                    Self
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      className={style.svglink}
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                      />
                    </svg>
                  </p>

                  <p>
                    <span className={style.currentPrice}>₹5000</span>
                    <span className={style.originalPrice}>₹8000</span>
                  </p>
                  <p className={style.discount}>14% OFF</p>
                  <button className={style.edit}>Edit</button>
                </div>
              </div>
              <div className={style.card}>
                <div className={style.left}>
                  <Image
                    src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/Python.jpg"
                    height={100}
                    width={150}
                    alt="course pic"
                    className={style.courseimg}
                  />
                  <p>Python Programming</p>
                </div>
                <div className={style.right}>
                  <p className={style.p1}>
                    Self
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      className={style.svglink}
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                      />
                    </svg>
                  </p>

                  <p>
                    <span className={style.currentPrice}>₹5000</span>
                    <span className={style.originalPrice}>₹8000</span>
                  </p>
                  <p className={style.discount}>14% OFF</p>
                  <button className={style.edit}>Edit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursesInfoPage;
