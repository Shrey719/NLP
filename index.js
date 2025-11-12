/** THE DIFFERENT AXIS'
 * Concreteness (concrete<->abstract)- "paper" would have a positive number, "good" would have a negative number
 * Animacy (inanimate<->alive) - "paper" would be negative, "dog" would be positive
 * Valence (emotionional positive<->negative) for example 'grotesque' would be negative, 'wonderous' would be positive
 * Intensity (strong<->weak) for example the word "uhm" would have zero intensity, the word "hello" would have a low positive intensity, and the word "Magnificient" would have high positive intensity
 * Dynamic (still<->dynamic) the word 'run' would have a positive dynamic, but the word 'rock' would have no dynamic
 * Size/magnitude (big<->tiny) 
*/

// currently there are SIX dimensions
function normalize(n, dimensions=6) {
    return n/Math.sqrt(dimensions)
}

class Point {

}

class Graph {
    constructor() {
        this.map = new Map()
    }
    set(value, con, ani, val, int, dyn, mag) {
        this.map.set(value, [con, ani, val, int, dyn, mag])
    }
    // gets the coordinates of a word 
    get(value) {
        return this.map.get(value)
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
        return {word: closest, distance: minDist, normalized: normalize(minDist)}

    }

}

let cube = new Graph()

cube.set("dog", 0.9, 1.0, 0.6, 0.5, 0.7, 0.6)
cube.set("rock", 1.0, 0.0, 0.5, 0.6, 0.01, 0.7)

console.log(cube.nearest("dog"))