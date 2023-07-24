import React from 'react';
import { useParams, Link, json } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import Spinner from '../../components/spinner/Spinner';
import ErrorPage from '../pageNotFound.js/PageNotFound';

export default function SearchResults() {
  const params = useParams();
  console.log(params);
  const { data, loading, error } = useFetch(`https://api.themoviedb.org/3/search/keyword?query=${params.query}&page=1`);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorPage />
  }
  console.log(data);
  return (
    <>
      {JSON.stringify(data)}
      {/* <div className="container my-12 mx-auto px-4 md:px-12">
        <div className="flex flex-wrap -mx-1 lg:-mx-4">
          <div className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
            <article className="overflow-hidden rounded-lg shadow-lg">
              <Link to="/">
                <img alt="Placeholder" className="block h-auto w-full" src="https://picsum.photos/600/400/?random" />
              </Link>
              <header className="flex items-center justify-between leading-tight p-2 md:p-4">
                <h1 className="text-lg">
                  <Link className="no-underline hover:underline text-black" to="/">Article Title</Link>
                </h1>
                <p className="text-grey-darker text-sm">11/1/19</p>
              </header>

              <footer className="flex items-center justify-between leading-none p-2 md:p-4">
                <Link className="flex items-center no-underline hover:underline text-black" to="/">
                  <img alt="Placeholder" className="block rounded-full" src="https://picsum.photos/32/32/?random" />
                  <p className="ml-2 text-sm">Author Name</p>
                </Link>
                <Link className="no-underline text-grey-darker hover:text-red-dark" to="/">
                  <span className="hidden">Like</span>
                  <i className="fa fa-heart"></i>
                </Link>
              </footer>
            </article>
          </div>
        </div>
      </div> */}
    </>
  );
}

