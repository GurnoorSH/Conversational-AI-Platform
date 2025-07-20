import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import './CallToAction.css';

const CallToAction: React.FC = () => {
  return (
    <div className="cta-container">
      <div className="cta-text">Click to chat!</div>
      <div className="cta-arrows">
        {/* Apply the className to a wrapper div, not the icon itself */}
        <div className="arrow-animated"><FiChevronRight /></div>
        <div className="arrow-animated"><FiChevronRight /></div>
        <div className="arrow-animated"><FiChevronRight /></div>
      </div>
    </div>
  );
};

export default CallToAction;