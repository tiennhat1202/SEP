import React from 'react'
import '../../index.css'
function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <img src="https://www.elle.vn/wp-content/uploads/2017/07/25/hinh-anh-dep-1.jpg" alt="Loading Animation" />
        <p>Loading...</p>
      </div>
    </div>
  );
}

export default LoadingScreen