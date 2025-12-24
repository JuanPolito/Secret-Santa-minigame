
export type GameState = 'setup' | 'intro' | 'playing' | 'revealing' | 'finished';

export interface GameTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  type: 'collect' | 'click' | 'riddle';
}

export interface SecretSantaData {
  recipientName: string;
}
