import React from 'react';
import { FiSmartphone, FiArrowRight, FiCloud } from 'react-icons/fi';
import { DiReact, DiPython } from 'react-icons/di';
import { SiPostgresql } from 'react-icons/si';
import './ArchitectureDiagram.css';
import CallToAction from './CallToAction';

// TechCard component remains unchanged
const TechCard: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({ icon, title, subtitle }) => (
  <div className="tech-card">
    <div className="tech-icon">{icon}</div>
    <div className="tech-label">
      <h4>{title}</h4>
      <p>{subtitle}</p>
    </div>
  </div>
);


const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="diagram-container">
      <div className="diagram-container">
      <h1 className="diagram-title">Conversational AI Platform Architecture</h1>
      
      <div className="diagram-grid">

        {/* --- COLUMN 1: CLIENT-SIDE --- */}
        <div className="diagram-column">
          <h3 className="column-title">Client-Side</h3>
          <TechCard icon={<DiReact size={35} />} title="Chat Widget" subtitle="React + Vite (TS)" />
          <TechCard icon={<FiSmartphone size={30} />} title="Client Website" subtitle="HTML/CSS/JS" />
        </div>

        {/* --- CONNECTOR 1 --- */}
        <div className="connector-column">
          <p className="arrow-text">HTTPS Request</p>
          <div className="arrow-icon"><FiArrowRight size={40} /></div>
        </div>

        {/* --- COLUMN 2: BACKEND SERVER --- */}
        <div className="diagram-column" style={{justifyContent: 'center'}}>
          <h3 className="column-title">Backend Server</h3>
          <TechCard icon={<DiPython size={35} />} title="API Layer" subtitle="FastAPI" />
        </div>

        {/* --- CONNECTOR 2 (Bidirectional) --- */}
        <div className="connector-column">
           <p className="arrow-text">DB & NLU API Calls</p>
           <div className="bidirectional-arrows">
             <div className="arrow-icon"><FiArrowRight size={40} /></div>
             <div className="arrow-icon"><FiArrowRight size={40} /></div>
           </div>
           <p className="arrow-text">Responses</p>
        </div>
        
        {/* --- COLUMN 3: CORE SERVICES --- */}
        <div className="diagram-column">
          <h3 className="column-title">Core Services</h3>
          <TechCard icon={<FiCloud size={30} />} title="NLU Brain" subtitle="Google Dialogflow CX" />
          <TechCard icon={<SiPostgresql size={30} />} title="Database" subtitle="PostgreSQL" />
        </div>
 <CallToAction />
      </div>
      
      </div>
    </div>
  );
};

export default ArchitectureDiagram;