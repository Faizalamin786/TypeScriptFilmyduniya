import { getDocs, QuerySnapshot, DocumentData } from "firebase/firestore";
import { moviesRef } from "../firebase/Firebase.tsx";
import { useEffect, useState } from "react";
import { Dna } from "react-loader-spinner";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";
import SearchBar from "./Searchbar.tsx";

// Define the type for movie data
interface Movie {
  id: string;
  title: string;
  url: string;
  rating: number;
  userRated: number;
  year: number;
}

const Card: React.FC = () => {
  const [data, setData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);

  function handleSearch(newQuery: string): void {
    setQuery(newQuery);
    const filteredMovies = data.filter((movie) => {
      return movie.title.toLowerCase().includes(newQuery.toLowerCase());
    });

    setSearchResults(filteredMovies);
  }

  useEffect(() => {
    async function getData() {
      setData([]);
      setLoading(true);
      const _data: QuerySnapshot<DocumentData> = await getDocs(moviesRef);

      _data.forEach((doc) => {
        setData((prev) => [...prev, { ...doc.data(), id: doc.id } as Movie]);
      });

      setLoading(false);
    }
    getData();
  }, []);

  return (
    <>
      <div className="search-container">
        <SearchBar onSearch={handleSearch} />
      </div>

      {query !== '' ? (
        <div className="card-container">
          {searchResults.map((element, idx) => (
            <Link to={`detail/${element.id}`} key={idx}>
              <div className="card">
                <img
                  src={element.url}
                  alt="Pic Not Available"
                  width={200}
                  height={290}
                />
                <div className="mt-2 pl-2">{element.title} </div>
                <div className="mt-2 pl-2 flex items-center">
                  <span>Rating:</span>
                  <div className="react-star-comp">
                    {element.userRated === 0 ? (
                      <ReactStars edit={false} value={0} size={22} />
                    ) : (
                      <ReactStars
                        edit={false}
                        value={element.rating / element.userRated}
                        size={22}
                      />
                    )}
                  </div>
                </div>
                <div className="mt-2 pl-2">
                  <span>Year:</span> {element.year}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card-container">
          {loading ? (
            <div className="h-96 flex items-center loader">
              <Dna />
            </div>
          ) : (
            data.map((element, idx) => (
              <Link to={`detail/${element.id}`} key={idx}>
                <div className="card">
                  <img
                    src={element.url}
                    alt="Pic Not Available"
                    width={200}
                    height={290}
                  />
                  <div className="mt-2 pl-2">{element.title} </div>
                  <div className="mt-2 pl-2 flex items-center">
                    <span>Rating:</span>
                    <div className="react-star-comp">
                      {element.userRated === 0 ? (
                        <ReactStars edit={false} value={0} size={22} />
                      ) : (
                        <ReactStars
                          edit={false}
                          value={element.rating / element.userRated}
                          size={22}
                        />
                      )}
                    </div>
                  </div>
                  <div className="mt-2 pl-2">
                    <span>Year:</span> {element.year}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </>
  );
};

export default Card;
