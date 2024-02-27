import React from 'react'
import { Link } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css';
import VideoPlayer from '../playVideo/PlayVideo';


export default function Footer() {

  return (
    <>
      <VideoPlayer />
      <div className="px-4 pt-32 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        <div className="grid gap-10 row-gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-2">
          <div className="flex flex-col items-center gap-5">
            <Link
              to="/"
              aria-label="Go home"
              title="Company"
              className="inline-flex items-center"
            >
              <span style={{ color: 'var(--sky-blue-1)' }} className="text-2xl font-bold tracking-wide text-blue-300 uppercase text-center">
                Movbixer
              </span>
            </Link>
            <div className="lg:max-w-sm">
              <p className="text-sm text-blue-300 text-center">
                In this app, you will find millions of Movies, TV Shows, Casts and other Media Entertainment things to explore, watch trailers
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-5">
            <span className="text-2xl font-bold tracking-wide text-blue-300">
              Social Connect
            </span>
            <div className="flex items-center justify-center mt-1 space-x-3 gap-1.5">
              <a
                target='_blank'
                rel='noreferrer'
                href="https://github.com/codewithMafuz"
                className="text-blue-300 transition-colors duration-300 hover:text-deep-purple-accent-400"
              >
                <i className="fab fa-github text-base"></i>
                <span className="text-base ml-2 text-blue-300">GitHub</span>
              </a>
              <a
                target='_blank'
                rel='noreferrer'
                href="https://www.linkedin.com/in/mafuzur-rahman-126559215/"
                className="text-blue-300 transition-colors duration-300 hover:text-deep-purple-accent-400"
              >
                <i className="fab fa-linkedin-in text-base"></i>
                <span className="text-base ml-2 text-blue-300">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse justify-center pt-5 pb-10 border-t lg:flex-row">
          <p className="text-sm text-blue-300 text-center">
            © Copyright 2023 Movbixer. All rights reserved.
          </p>
        </div>
      </div>
    </>
  )
}
