import React, { useState, useEffect, useContext, useRef } from "react";
import ReactStars from "react-rating-stars-component";
import { reviewsRef, db } from "../firebase/Firebase";
import { addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { TailSpin, ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import { AppState } from "../App";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// Type definitions for the component props
interface ReviewProps {
  id: string;
  prevRating: number;
  userRated: number;
  setDetailReRender: React.Dispatch<React.SetStateAction<number>>;
  detailReRender: number;
}

interface ReviewData {
  name: string;
  rating: number;
  thought: string;
  timestamp: number;
}

const Review: React.FC<ReviewProps> = ({ id, prevRating, userRated, setDetailReRender, detailReRender }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && buttonRef.current) {
      buttonRef.current.click();
    }
  };

  const useAppState = useContext(AppState);
  const navigate = useNavigate();

  const [rating, setRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [thoughtVal, setThoughtVal] = useState<string>("");
  const [reRender, changereRender] = useState<number>(1);

  const [reviewLoading, setReviewLoading] = useState<boolean>(false);
  const [reviewData, setReviewData] = useState<ReviewData[]>([]);

  const resetRating = () => {
    changereRender(reRender + 1);
    setRating(0);
  };

  const sendReview = async () => {
    setLoading(true);

    try {
      if (useAppState && useAppState.login) {
        if (rating === 0 || thoughtVal === "") {
          throw new Error("Share Rating and Review Both");
        }

        await addDoc(reviewsRef, {
          movieid: id,
          name: useAppState.userName,
          rating: rating,
          thought: thoughtVal,
          timestamp: new Date().getTime(),
        });

        const docRef = doc(db, "movies", id);
        await updateDoc(docRef, {
          rating: prevRating + rating,
          userRated: userRated + 1,
        });

        setDetailReRender(detailReRender + 1);
        changereRender(reRender + 1);
        resetRating();
        setThoughtVal("");

        swal({
          title: "Review Sent",
          icon: "success",
          button: false,
          timer: 3000,
        });
      } else {
        window.alert("Please Login First");
        navigate("/login");
      }
    } catch (err) {
      swal({
        title: err instanceof Error ? err.message : "Something went wrong",
        icon: "error",
        button: false,
        timer: 6000,
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    async function getData() {
      setReviewLoading(true);
      setReviewData([]);

      const quer = query(reviewsRef, where("movieid", "==", id));
      const queryData = await getDocs(quer);

      queryData.forEach((doc) => {
        setReviewData((prev) => [...prev, doc.data() as ReviewData]);
      });

      setReviewLoading(false);
    }
    getData();
  }, [reRender, id]);

  return (
    <div className="mt-4 border-t-2 pt-3 border-gray-50 disable-text-selection">
      <div className="react-stars-div">
        <Link to={""} onClick={(e) => e.preventDefault()}>
          <ReactStars
            key={reRender}
            edit={true}
            isHalf={true}
            size={28}
            value={rating}
            onChange={(newRat:number) => setRating(newRat)}
          />
        </Link>
      </div>

      <input
        onKeyUp={handleKeyUp}
        value={thoughtVal}
        onChange={(e) => setThoughtVal(e.target.value)}
        type="text"
        placeholder="Share Your Review..."
        className="w-full mt-2 text-xl p-2 outline-none bg-gray-800"
      />
      <button
        ref={buttonRef}
        onClick={sendReview}
        className="bg-green-600 w-full p-2 text-xl mt-1 flex justify-center"
      >
        {loading ? <TailSpin color="white" height={28} /> : "Share"}
      </button>

      {reviewLoading ? (
        <div className="flex justify-center mt-[-10px]">
          <ThreeDots color="cyan" width={55} />
        </div>
      ) : (
        <div className="mt-4">
          {reviewData.map((element, index) => {
            return (
              <div key={index} className="bg-gray-800 p-2 mt-2 border-b-2 border-gray-500">
                <div className="flex">
                  <p className="text-blue-400">{element.name}</p>
                  <p className="ml-3 text-xs mt-1">
                    ({new Date(element.timestamp).toLocaleString('en-US', {
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit',  
                      hour12: true 
                    })})
                  </p>
                </div>

                <ReactStars key={reRender} edit={false} isHalf={true} size={17} value={element.rating} />

                <p>{element.thought}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Review;
