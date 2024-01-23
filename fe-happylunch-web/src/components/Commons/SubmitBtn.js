import React from 'react'
function SubmitBtn({ linkName, onSubmit }) {
  return (
      <button
        onClick={onSubmit}
        type="button"
        className="text-sm px-10 py-2.5 max-sm:px-2 max-sm:py-2 text-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-md shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg"
      >
        <div className="lg:flex md:flex sm:flex justify-center text-sm">
          <p className="md:w-max sm:w-max px-10 align-middle mt-0.5">
            {linkName}
          </p>
        </div>
      </button>
  )
}

export default SubmitBtn