import React, { useState, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import NavComponent from './Navbar';
import CommonService from '../../services/CommonService';
import { ToastContainer, toast } from 'react-toastify';

Quill.register('modules/imageResize', ImageResize);

function Feedback() {
  const [value, setValue] = useState('');
  const commonService = new CommonService();
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }],
      ['link', 'image', 'video'],
    ],
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize'],
    },
  };
  useEffect(() => {
    document.title = 'Report Problem';
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const reportTitle = document.getElementById('reportTitle').value;

    const reportContent = value;

    const formData = {
      reportTitle,
      reportContent,
    };
    if (reportTitle !== '' && reportContent !== '') {
      try {
        const res = await commonService.reportProblemCustomer(formData);
        if (res && res.code === 200) {
          toast.success('Report Successfully');
          // setSubmittedData(formData)
          document.getElementById('reportTitle').value = '';
        }
      } catch (error) {
        toast.error(error.data.response.data);
      }
    } else {
      toast.error('This field is required and cannot be empty');
    }
  };

  return (
    <>
      <NavComponent />
      <div className="min-h-[92vh] bg-gray-100">
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              <h2 className="text-xl text-gray-800 font-bold sm:text-3xl dark:text-white">
                Report Problem
              </h2>
            </div>
            <div className="mt-5 p-4 relative z-10 bg-white border rounded-xl sm:mt-10 md:p-10 dark:bg-gray-800 dark:border-gray-700">
              <form onSubmit={handleSubmit}>
                <div className="mb-4 sm:mb-6">
                  <label
                    htmlFor="reportTitle"
                    className="block mb-2 text-sm font-medium dark:text-white"
                  >
                    Report Title
                  </label>
                  <input
                    type="text"
                    id="reportTitle"
                    className="px-4 block w-full border-gray-200 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reportContent"
                    className="block mb-2 text-sm font-medium dark:text-white"
                  >
                    Specific description of the problem
                  </label>
                  <div className="mt-1">
                    <ReactQuill
                      id="reportContent"
                      theme="snow"
                      value={value}
                      onChange={setValue}
                      modules={modules}
                    />
                  </div>
                </div>
                <div className="mt-6 grid">
                  <button
                    type="submit"
                    disabled={
                      value.trim() === '' ||
                      document.getElementById('reportTitle').value.trim() === ''
                    }
                    className={`py-2 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold 
    ${
      value.trim() === '' ||
      document.getElementById('reportTitle').value.trim() === ''
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all dark:focus:ring-offset-gray-800'
    }`}
                  >
                    Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* {submittedData && (
          <div>
            <div
              dangerouslySetInnerHTML={{
                __html: submittedData.specificDescription,
              }}
            ></div>
          </div>
        )} */}
      </div>
      <ToastContainer />
    </>
  );
}
export default Feedback;
