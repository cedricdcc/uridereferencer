const { getLinkedDataNQuads, dereferenceURI } = require("../src/index");
const fs = require("fs");
const path = require("path");
const $rdf = require("rdflib");

describe("getLinkedDataNQuads", () => {
  it("should return a graph with triples from the given URI", async () => {
    // Mock the dereference function to return a stream of quads
    //mockdata is a ttl file with some triples
    let mockgraph = $rdf.graph();
    //fill in pockgraph with rdflib
    let mockdata = fs
      .readFileSync(path.resolve(__dirname, "./data/3293.ttl"), "utf-8")
      .toString();
    //console.log(mockdata);
    $rdf.parse(
      mockdata,
      mockgraph,
      "https://marineregions.org/mrgid/3293",
      "text/turtle"
    );

    //url to get triples from https://marineregions.org/mrgid/3293
    const uri = "https://marineregions.org/mrgid/3293";
    // Call the function
    getLinkedDataNQuads(uri).then((result) => {
      // Check the result
      expect(result.toString()).toEqual(mockgraph.toString());
    });
  });
});

describe("getLinkedDataNQuads", () => {
  it("should return a graph with triples from the given URI", async () => {
    // Mock the dereference function to return a stream of quads
    let mockgraph = $rdf.graph();
    let mockdata = fs
      .readFileSync(path.resolve(__dirname, "./data/3293.ttl"), "utf-8")
      .toString();
    $rdf.parse(
      mockdata,
      mockgraph,
      "https://marineregions.org/mrgid/3293",
      "text/turtle"
    );

    const uri = "https://marineregions.org/mrgid/3293";
    const resultGraph = await getLinkedDataNQuads(uri);

    expect(resultGraph.toString()).toEqual(mockgraph.toString());
  }, 30000);
});

describe("dereferenceURI", () => {
  it("should throw an error if trajectory is not an array of URI strings", async () => {
    const graph = $rdf.graph();
    const trajectory = "not an array";
    const uri = "https://example.com";

    await expect(dereferenceURI(graph, trajectory, uri)).rejects.toThrow(
      "trajectory must be an array of URI strings"
    );
  });

  it("should throw an error if graph is not an RDFLib graph", async () => {
    const graph = "not a graph";
    const trajectory = ["http://example.com/property"];
    const uri = "https://example.com";

    await expect(dereferenceURI(graph, trajectory, uri)).rejects.toThrow(
      "graph must be an RDFLib graph"
    );
  });

  it("should return the graph with triples from the given URI", async () => {
    const graph = $rdf.graph();
    const trajectory = ["http://example.com/property"];
    const uri = "https://example.com";

    const resultGraph = await dereferenceURI(graph, trajectory, uri);

    expect(resultGraph.toString()).toEqual(graph.toString());
  }, 30000);

  it("should return the graph with triples from the given URI", async () => {
    let mockgraph = $rdf.graph();
    let mockdata = fs
      .readFileSync(path.resolve(__dirname, "./data/3293.ttl"), "utf-8")
      .toString();
    $rdf.parse(
      mockdata,
      mockgraph,
      "http://marineregions.org/mrgid/3293",
      "text/turtle"
    );

    //get the length of the statements of the graph
    let leg_graph = mockgraph.statements.length;

    const trajectory = [
      "http://marineregions.org/ns/ontology#hasGeometry",
      "http://www.opengis.net/ont/geosparql#asWKT",
    ];
    const uri = "http://marineregions.org/mrgid/3293";

    const resultGraph = await dereferenceURI(mockgraph, trajectory, uri);
    //get the length of the statements of the resultGraph
    let leg_resultGraph = resultGraph.statements.length;
    console.log(leg_resultGraph);

    expect(leg_resultGraph).toBeGreaterThan(leg_graph);
  }, 30000);
});
