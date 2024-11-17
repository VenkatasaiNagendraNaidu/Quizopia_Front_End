import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../Animations/teacher.json';

const LottieComponent = () => {
  const defaultOptions = {
    animationData: animationData,
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice' // Ensures the animation is scaled while maintaining its aspect ratio
    }
  };

  return (
    <div style={{ width: '400px', height: '400px' }}>
      <Lottie {...defaultOptions} />
    </div>
  );
};

export default LottieComponent;
