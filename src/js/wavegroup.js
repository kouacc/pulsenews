import { Wave } from "./wave.js";

export class Wavegroup {
    constructor() {
        this.totalWaves = 3;
        this.totalPoints = 6;

        this.color = ['rgba(161, 254, 195, 0.4)', 'rgba(255, 255, 0, 0.4)', 'rgba(0, 255, 255, 0.4)'];
        this.waves = [];

        this.waves = Array(this.totalWaves).fill().map((_, i) => new Wave(i, this.totalPoints, this.color[i]));
    }

    resize(stageWidth, stageHeight) {
        this.waves.forEach(wave => wave.resize(stageWidth, stageHeight));
    }

    draw(ctx) {
        this.waves.forEach(wave => wave.draw(ctx));
    }
}