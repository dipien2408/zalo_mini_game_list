import React, {useState} from "react";
import { Page, Header, Box, Text } from "zmp-ui";
import { GAME_LIST } from "@/game-config";
import { GameInfo } from "@/types";

const HomePage: React.FC = () => {
  //game chosen id
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  //get current game config
  const activeGameConfig = GAME_LIST.find(game => game.id === activeGameId);

  if(activeGameId && activeGameConfig) {
    const GameComponent = activeGameConfig.component;
    return (
      <Page className="bg-gray-50 h-screen overflow-hidden">
         {/*reset state for exit button*/}
        <GameComponent onExit={() => setActiveGameId(null)} />
      </Page>
    );
  }

  return (
    <Page className="bg-gray-100">
      <Header title="Game Center" showBackIcon={false} />
      
      <Box p={4} className="mt-16">
        <Text.Title className="mb-4 text-slate-700 font-bold">Danh sách trò chơi</Text.Title>
        
        <div className="grid grid-cols-2 gap-4">
          {GAME_LIST.map((game: GameInfo) => (
            <div 
              key={game.id}
              onClick={() => setActiveGameId(game.id)}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer flex flex-col items-center text-center h-40 justify-center"
            >
              <div className={`w-14 h-14 ${game.color} rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner`}>
                {game.icon}
              </div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">{game.name}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 px-2">{game.description}</p>
            </div>
          ))}

          {/* Coming soon slot */}
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 flex flex-col items-center justify-center text-gray-400 h-40">
            <span className="text-xs font-medium">Sắp ra mắt</span>
          </div>
        </div>
      </Box>
    </Page>
  );
};
export default HomePage;
