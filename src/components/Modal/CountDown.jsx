import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';

const CountDown = ({ title, initialTime, onClose, redirectPath }) => {
  const [redirectTime, setRedirectTime] = useState(initialTime); // Sử dụng state để theo dõi thời gian đếm ngược

  useEffect(() => {
    const countdown = setInterval(() => {
      setRedirectTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdown);
          onClose(redirectPath);
          return 0; // Trả về 0 khi thời gian kết thúc
        }
        return prevTime - 1; // Giảm thời gian đếm ngược
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [onClose, redirectPath]); // Bỏ qua redirectTime vì đã sử dụng setRedirectTime

  return (
    <Modal title={title} open={true} footer={null} onCancel={() => onClose()}>
      <p>{redirectTime > 0 ? `Redirect in ${redirectTime} . . .` : 'Redirecting...'}</p>
    </Modal>
  );
};

export default CountDown;
