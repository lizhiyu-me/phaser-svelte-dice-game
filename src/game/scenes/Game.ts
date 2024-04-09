import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Game extends Scene {
    private textDiceValue:Phaser.GameObjects.Text;
    private doDice:Function;
    constructor() {
        super('Game');
    }

    preload() {
        this.load.setPath('assets');

        this.load.image("dice-albedo", "https://labs.phaser.io/assets/obj/dice/dice-albedo.png");
        this.load.obj("dice-obj", "https://labs.phaser.io/assets/obj/dice/dice.obj");
    }

    create() {

        const _doDice = this.createDice(this.scale.width / 2, this.scale.height / 2, this, 5000);

        this.doDice = ()=>{
            _doDice(this.dice)
        }

        // Text object to show the dice value
        this.textDiceValue = this.add.text(this.scale.width / 2, this.scale.height / 2, '0', { fontFamily: 'Arial Black', fontSize: 74, color: '#c51b7d' });
        this.textDiceValue.setStroke('#de77ae', 16)
            .setScale(0);


        EventBus.emit('current-scene-ready', this);

    }


    createDice(x, y, scene, duration = 1000) {

        let diceIsRolling = false;

        const dice = scene.add.mesh(x, y, "dice-albedo");
        const shadowFX = dice.postFX.addShadow(0, 0, 0.006, 2, 0x111111, 10, .8);

        dice.addVerticesFromObj("dice-obj", 0.25);
        dice.panZ(6);

        dice.modelRotation.x = Phaser.Math.DegToRad(0);
        dice.modelRotation.y = Phaser.Math.DegToRad(-90);

        return (callback) => {
            if (!diceIsRolling) {
                diceIsRolling = true;
                const diceRoll = Phaser.Math.Between(1, 6);

                // Shadow
                scene.add.tween({
                    targets: shadowFX,
                    x: -8,
                    y: 10,
                    duration: duration - 250,
                    ease: "Sine.easeInOut",
                    yoyo: true,
                });

                scene.add.tween({
                    targets: dice,
                    from: 0,
                    to: 1,
                    duration: duration,
                    onUpdate: () => {
                        dice.modelRotation.x -= .02;
                        dice.modelRotation.y -= .08;
                    },
                    onComplete: () => {
                        switch (diceRoll) {
                            case 1:
                                dice.modelRotation.x = Phaser.Math.DegToRad(0);
                                dice.modelRotation.y = Phaser.Math.DegToRad(-90);
                                break;
                            case 2:
                                dice.modelRotation.x = Phaser.Math.DegToRad(90);
                                dice.modelRotation.y = Phaser.Math.DegToRad(0);
                                break;
                            case 3:
                                dice.modelRotation.x = Phaser.Math.DegToRad(180);
                                dice.modelRotation.y = Phaser.Math.DegToRad(0);
                                break;
                            case 4:
                                dice.modelRotation.x = Phaser.Math.DegToRad(180);
                                dice.modelRotation.y = Phaser.Math.DegToRad(180);
                                break;
                            case 5:
                                dice.modelRotation.x = Phaser.Math.DegToRad(-90);
                                dice.modelRotation.y = Phaser.Math.DegToRad(0);
                                break;
                            case 6:
                                dice.modelRotation.x = Phaser.Math.DegToRad(0);
                                dice.modelRotation.y = Phaser.Math.DegToRad(90);
                                break;
                        }
                    },
                    ease: "Sine.easeInOut",
                });

                // Intro dice
                scene.add.tween({
                    targets: [dice],
                    scale: 1.2,
                    duration: duration - 200,
                    yoyo: true,
                    ease: Phaser.Math.Easing.Quadratic.InOut,
                    onComplete: () => {
                        dice.scale = 1;
                        if (callback !== undefined) {
                            diceIsRolling = false;
                            callback(diceRoll);
                        }
                    }
                });
            } else {
                console.log("Is rolling");
            }
        }

    }


    dice(diceValue) {
        console.log('Dice value ', diceValue);

        // Show the dice value
        this.textDiceValue.text = diceValue;
        this.textDiceValue.setOrigin(0.5);
        this.textDiceValue.setPosition(this.scale.width / 2, this.scale.height / 2);

        this.add.tween({
            targets: this.textDiceValue,
            scale: 1,
            duration: 1000,
            ease: Phaser.Math.Easing.Bounce.Out,
            onComplete: () => {
                this.add.tween({
                    targets: [this.textDiceValue],
                    scale: 0,
                    delay: 1000,
                    duration: 1000,
                    ease: Phaser.Math.Easing.Bounce.Out,
                });
            }
        });
    }

}