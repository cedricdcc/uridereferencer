const { getLinkedDataNQuads } = require("../src/index");
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
    console.log(mockdata);
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
      expect(result).toEqual(mockgraph);
    });
  });
});
