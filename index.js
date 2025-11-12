/** THE DIFFERENT AXIS'
 * Concreteness (concrete<->abstract)- "paper" would have a positive number, "good" would have a negative number
 * Animacy (inanimate<->alive) - "paper" would be negative, "dog" would be positive
 * Valence (emotionional positive<->negative) for example 'grotesque' would be negative, 'wonderous' would be positive
 * Intensity (strong<->weak) for example the word "uhm" would have zero intensity, the word "hello" would have a low positive intensity, and the word "Magnificient" would have high positive intensity
 * Dynamic (still<->dynamic) the word 'run' would have a positive dynamic, but the word 'rock' would have no dynamic
 * Size/magnitude (big<->tiny) 
*/

// i do realize one can just make a pytorch one and then run it itself... but thats BORING
import {train} from "./train.js"

class Graph {
    constructor(dimensions=120) {
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

    nearest(word) {

        let minDist = Infinity;

        const target = this.map.get(word)
        if (!target) return null;
        let closest = null;

        for (const [other, vec] of this.map.entries()) {
            if (other === word) continue; // skip self
            const dist = Math.sqrt(target.reduce((sum, val, i) => sum + (val - vec[i]) ** 2, 0))
            if (dist  < minDist) {
                minDist = dist
                closest = other
            }
        }
        return {word: closest, distance: minDist, normalized: this.normalize(minDist)}

    }

    next(start, length, punctuation=[".", "!", "?"]) {
        let sentance = [start]
        let recent = [start]
        let current = start

        for (let i=0; i<length; i++) {
            const skip = new Set(recent)

            const nextObj = this.nearest(current, skip)
            if (!nextObj) break

            const nextWord = nextObj.word
            sentance.push(nextWord)
            current = nextWord

            if(punctuation.includes(nextWord)) break
        }
        return sentance.join(" ");
    }
}

let cube = new Graph()


let data = [
    "she ate a chicken ?".split(" "),
    "he jumped the fence?".split(" "),
    "I ate a burger.".split(" "),
    "I went outside.".split(" "),
    "The chicken jumped quickly".split(" "),
    "The chicken then jumped quickly".split(" "),
    "one plus one is two".split(" "),
    "one plus three is four".split(" "),
    "a dog is a type of animal".split(" ")
]

train(cube, data, 2)

console.log(cube.next("animal", 3))