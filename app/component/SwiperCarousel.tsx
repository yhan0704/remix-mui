import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Link } from "@remix-run/react";

const SwiperCarousel = ({ popularMovie }: any) => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={100}
      slidesPerView={5}
      navigation
      loop={true}
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      //   onSwiper={(swiper) => console.log(swiper)}
      //   onSlideChange={() => console.log("slide change")}
      style={{ height: "250px", paddingLeft: "50px" }}
    >
      {popularMovie.map((i, index) => (
        <SwiperSlide key={index}>
          <div style={{ width: "18%" }}>
            <Link to={`/movie/detail/${i.id}`}>
              <img
                src={"https://image.tmdb.org/t/p/w154/" + i.poster_path}
                alt="alternatetext"
              />
            </Link>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperCarousel;
