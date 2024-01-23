import { useState } from 'react';

function CreateMenuInfo() {
  const [isShowingMenuInfo, setIsShowingMenuInfo] = useState(false);

  function toggleMenuInfo() {
    setIsShowingMenuInfo(!isShowingMenuInfo);
  }

  return {
    isShowingMenuInfo,
    toggleMenuInfo,
  };
}

export default CreateMenuInfo;
