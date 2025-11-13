function randomVector(dim) {
  return Array.from({ length: dim }, () => Math.random());
}

function train(graph, sentences, epochs = 5) {
  for (let e = 0; e < epochs; e++) {
    for (const sentence of sentences) {
      for (let i = 0; i < sentence.length - 1; i++) {
        const w1 = sentence[i];
        const w2 = sentence[i + 1];

        if (!graph.get(w1)) graph.set(w1, ...randomVector(graph.dimensions));
        if (!graph.get(w2)) graph.set(w2, ...randomVector(graph.dimensions));

        const v1 = graph.get(w1);
        const v2 = graph.get(w2);
        for (let d = 0; d < graph.dimensions; d++) {
          const avg = (v1[d] + v2[d]) / 2;
          v1[d] = avg;
          v2[d] = avg;
        }
        graph.set(w1, ...v1);
        graph.set(w2, ...v2);
      }
    }
  }
}

export { train };
