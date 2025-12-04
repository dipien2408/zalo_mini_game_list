export const GRID_SIZE = 20;
export const SPEED = 150; //initial snake speed

export interface Position {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';