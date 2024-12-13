import ReactStars from "react-rating-stars-component";
import { useParams } from "react-router-dom";
import { getDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import { useEffect, useState } from "react";
import { BallTriangle } from "react-loader-spinner";
import Review from "./Review";

const Detail = () => {
  const { id } = useParams();
  // console.log(id);
  const [reRender, setreRender] = useState(0);

  const [data, setData] = useState({
    title: "",
    year: "",
    url: "",
    description: "",

    rating: 0,
    userRated: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const _doc = doc(db, "movies", id);
      const _data = await getDoc(_doc);
      setData(_data.data());
      setLoading(false);
    }

    getData();
  }, [id, reRender]);

  return (
    <div className="flex justify-center items-start p-4 mt-4 flex-row max-md:flex-col max-md:items-center">
      {loading ? (
        <div className="flex justify-center items-center h-80">
          <BallTriangle color="#00FFFF" />
        </div>
      ) : (
        <>
          <img
            className="sticky top-24 max-md:relative max-md:top-0"
            src={data.url}
            alt="Pic Not Available"
            width={270}
            height={392}
          />

          <div className="ml-6 w-1/2 max-md:ml-0 max-md:w-full max-md:mt-3">
            <p className="text-3xl font-bold text-gray-300 ">
              {data.title} <span className="text-xl">({data.year})</span>
            </p>

            {data.userRated === 0 ? (
              <ReactStars edit={false} value={0} size={22} />
            ) : (
              <ReactStars
                edit={false}
                value={data.rating / data.userRated}
                size={22}
              />
            )}

            <p className="mt-3 text-justify">{data.description}</p>

            <Review
              id={id}
              prevRating={data.rating}
              userRated={data.userRated}
              setDetailReRender={setreRender}
              detailReRender={reRender}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Detail;
