import React from 'react';

export interface GameComponentProps {
  onExit: () => void;
}

export interface GameInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  component: React.ComponentType<GameComponentProps>; //props for exit function
  color: string;
}


