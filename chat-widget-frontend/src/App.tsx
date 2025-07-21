// import React from 'react';
import ChatWidget from './components/ChatWidget';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import CallToAction from './components/CallToAction'; // Import the new component

function App() {
  return (
    <>
      <ArchitectureDiagram />
      
      {/* Renders on top */}
      
      <ChatWidget />
    </>
  );
}

export default App;