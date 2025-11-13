import {train} from "./train.js"
import data from "./data.js"

class Graph {
    constructor(dimensions=512) {
        this.map = new Map()
        this.dimensions=dimensions
    }
    set(value, ...cords) {
        if (cords.length !== this.dimensions) {
            console.error("Expected " + this.dimensions + " got "+cords.length)
        }
        this.map.set(value, cords)
    }
    // gets the coordinates of a word 
    get(value) {
        return this.map.get(value)
    }

    normalize(n) {
        return n/Math.sqrt(this.dimensions)
    }
    distance(word1, word2) {
        word1 = this.map.get(word1)
        word2 = this.map.get(word2)
        return Math.sqrt(word1.reduce((sum, val, i) => sum + (val - word2[i]) ** 2, 0));
    }

    nearest(word, usedWords = new Set()) {
        const target = this.map.get(word)
        if (!target) return [];

        let distances = [];

        for (const [other, vec] of this.map.entries()) {
            if (other === word || usedWords.has(other)) continue; // skip self and used words
            const dist = Math.sqrt(target.reduce((sum, val, i) => sum + (val - vec[i]) ** 2, 0)); // distance formula
            distances.push({ word: other, distance: dist });
        }

        distances.sort((a, b) => a.distance - b.distance);
        return distances.slice(0, 3); // 3 closest
    }


    sentance(start, length) {
        let sentence = [start];
        let recent = new Set([start]);
        let current = start;

        for (let i = 0; i < length; i++) {
            const nextWords = this.nearest(current, recent);
            if (nextWords.length === 0) break;

            const nextWord = nextWords[0].word;// first word that hasnt been used yets
            sentence.push(nextWord);
            recent.add(nextWord);
            // exit on punctuation
            if (nextWord.includes(".") || nextWord.includes("?") || nextWord.includes("!")) {
                return sentence.join(" ")
            }
            current = nextWord;

        }

        return sentence.join(" ");
    }
}

let cube = new Graph()

train(cube, data, 1)

console.log(cube.sentance("I", 100))