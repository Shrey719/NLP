function randomVector(dim) {
  return Array.from({ length: dim }, () => Math.random() - 0.5); // center around 0
}

function train(graph, sentences, epochs = 5, lr = 0.5) {
  for (let i = 0; i < sentences.length; i++) {
    sentences[i] = sentences[i].map(word => word.toLowerCase());
  }

  for (const sentence of sentences) {
    for (const word of sentence) {
      if (!graph.get(word)) graph.set(word, ...randomVector(graph.dimensions));
    }
  }

  for (let e = 0; e < epochs; e++) {
    for (const sentence of sentences) {
      for (let i = 0; i < sentence.length - 1; i++) {
        const w1 = sentence[i];
        const w2 = sentence[i + 1];

        const v1 = graph.get(w1);
        const v2 = graph.get(w2);

        for (let d = 0; d < graph.dimensions; d++) {
          const diff = v2[d] - v1[d];
          v1[d] += lr * diff;
          v2[d] -= lr * diff * 0.5;
        }

        graph.set(w1, ...v1);
        graph.set(w2, ...v2);
      }
    }
  }
}

export { train };
