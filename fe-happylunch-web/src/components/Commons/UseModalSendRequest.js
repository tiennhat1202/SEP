import { useState } from 'react';

function UseModalSendRequest() {
  const [isShowingSendRequest, setIsShowingSendRequest] = useState(false);

  function toggleSendRequest() {
    setIsShowingSendRequest(!isShowingSendRequest);
  }

  return {
    isShowingSendRequest,
    toggleSendRequest,
  };
}

export default UseModalSendRequest;
