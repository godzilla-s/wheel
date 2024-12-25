import PropTypes from 'prop-types';
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';
import { Dialog } from '../components/Dialog';

export const PhaserGame = forwardRef(function PhaserGame ({ currentActiveScene }, ref)
{
    const game = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState("");

    const closeDialog = () => {
        setIsOpen(false);
    }

    const openDialog = (data) => {
        setContent(data);
        setIsOpen(true);
    }

    // Create the game inside a useLayoutEffect hook to avoid the game being created outside the DOM
    useLayoutEffect(() => {
        
        if (game.current === undefined)
        {
            game.current = StartGame("game-container");
            
            if (ref !== null)
            {
                ref.current = { game: game.current, scene: null };
            }
        }

        return () => {

            if (game.current)
            {
                game.current.destroy(true);
                game.current = undefined;
            }

        }
    }, [ref]);

    useEffect(() => {

        EventBus.on('current-scene-ready', (currentScene) => {

            if (currentActiveScene instanceof Function)
            {
                currentActiveScene(currentScene);
            }
            ref.current.scene = currentScene;
            
        });

        return () => {

            EventBus.removeListener('current-scene-ready');

        }
        
    }, [currentActiveScene, ref])

    useEffect(() => {
        EventBus.on('winPrize', (data) => {
            console.log("open dialog: winPrize:", data);
            openDialog(data);
        })

        return () => {
            EventBus.removeListener('winPrize');
        }
    }, [currentActiveScene])

    return (
        <div id="wheel-game">
            <div id="game-container"></div>
            <Dialog isOpen={isOpen} title="win prize" content={content} onClose={closeDialog}/>
        </div>
        
    );

});

// Props definitions
PhaserGame.propTypes = {
    currentActiveScene: PropTypes.func 
}
