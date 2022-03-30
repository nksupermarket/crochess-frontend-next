import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserContext } from '../../utils/contexts/UserContext';
import styles from '../../styles/GameDoor.module.scss';
import axios from 'axios';
import urls from '../../utils/urls';
import { GameSeekInterface } from '../../types/interfaces';

interface GameDoorProps {
  gameSeek: GameSeekInterface;
}

export default function GameDoor({ gameSeek }: GameDoorProps) {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const rootClasses = [
    'game_door',
    'foreground',
    'hover-highlight',
    'space-evenly',
  ];
  if (gameSeek.seeker === user) rootClasses.push(styles.my_seek);

  return (
    <div
      className={rootClasses.join(' ')}
      onClick={async (e) => {
        e.stopPropagation();
        const oppColor = gameSeek.color === 'white' ? 'black' : 'white';

        const [res] = await Promise.all([
          axios.post(`${urls.backend}/games`, {
            [gameSeek.color]: user,
            [oppColor]: gameSeek.seeker,
            time: gameSeek.time,
            increment: gameSeek.increment,
            seeker: gameSeek.seeker,
            challenger: user,
          }),
          axios.delete(`${urls.backend}/gameSeeks/${gameSeek._id}`),
        ]);

        if (res.status !== 200 || res.statusText !== 'OK')
          throw new Error('something went wrong fetching the game');

        const gameId = await res.data;
        router.push(`/${gameId}`);
      }}
    >
      {[
        gameSeek.color,
        `${gameSeek.time}+${gameSeek.increment}`,
        gameSeek.gameType,
      ].map((t, i) => (
        <p key={i} className="text-center">
          {t}
        </p>
      ))}
    </div>
  );
}
