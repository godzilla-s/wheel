/* eslint-disable no-undef */
import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Game extends Scene
{
    wheel = null;
    pin = null;
    canSpin = false;
    prizeText = null;
    prize = "";
    slices = 8;
    slicePrizes = ["A KEY!!!", "50 STARS", "500 STARS", "BAD LUCK!!!", "200 STARS", "100 STARS", "150 STARS", "BAD LUCK!!!"];
    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        this.load.setPath('assets');
        
        this.load.image('wheel', 'wheel.png');
        this.load.image('pin', 'pin.png');
    }

    create ()
    {
        let width = this.game.canvas.width / 2;
        let height = this.game.canvas.height / 2;
        this.wheel = this.add.sprite(width, height, 'wheel');
        this.wheel.setOrigin(0.5, 0.5);
        this.pin = this.add.sprite(width, height, 'pin');
        this.pin.setOrigin(0.5, 0.5);
        this.prizeText = this.add.text(width, 480 + height/2, "", {
            fontSize: '24px',
            color: '#32F0a1',
        });
        this.prizeText.setOrigin(0.5, 0.5);
        this.prizeText.align = 'center';
        this.canSpin = true;
        this.input.on('pointerdown', this.spin, this);
    }

    spin() {
        if (this.canSpin) {
            this.prizeText.text = '';
            var rounds = Phaser.Math.RND.between(2, 4);
            var degrees = Phaser.Math.RND.between(0, 360);
            
            this.prize = this.slices - 1 - Math.floor(degrees / (360 / this.slices));
            this.canSpin = false;
            this.add.tween({
                targets: this.wheel,
                duration: 3000,
                angle: 360 * rounds +degrees,
                ease: 'Cubic.easeOut',
                callbackScope: this,
                onComplete: this.winPrize,
            });
        }
    }
    winPrize(){
        this.canSpin = true;
        console.log("win prize:", this.prize, this.slicePrizes[this.prize]);
        this.prizeText.text = this.slicePrizes[this.prize];
        EventBus.emit('winPrize', this.slicePrizes[this.prize]);
   }
}
