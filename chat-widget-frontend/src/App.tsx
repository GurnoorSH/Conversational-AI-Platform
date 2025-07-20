// import React from 'react';
import ChatWidget from './components/ChatWidget';
import ArchitectureDiagram from './components/ArchitectureDiagram';

function App() {
  return (
    <>
      {/* Renders in the background */}
      <ArchitectureDiagram />
      
      {/* Renders on top, since it is position: fixed */}
      <ChatWidget />
    </>
  );
}

export default App;