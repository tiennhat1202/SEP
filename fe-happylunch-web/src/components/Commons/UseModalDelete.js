import { useState } from 'react';

function UseModalDelete() {
  const [isShowingDelete, setIsShowingDelete] = useState(false);

  function toggleDelete() {
    setIsShowingDelete(!isShowingDelete);
  }

  return {
    isShowingDelete,
    toggleDelete,
  };
}

export default UseModalDelete;
