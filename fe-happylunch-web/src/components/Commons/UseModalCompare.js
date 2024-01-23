import { useState } from 'react';

function UseModalCompare() {
  const [isShowingCompare, setIsShowingCompare] = useState(false);

  function toggleCompare() {
    setIsShowingCompare(!isShowingCompare);
  }

  return {
    isShowingCompare,
    toggleCompare,
  };
}

export default UseModalCompare;
