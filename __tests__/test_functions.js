// Import the required libraries
//const { getObjectsGraphFromPropertyPath } = require("../src/index"); // replace with your actual file
import * as $rdf from "rdflib";
import { expect } from "@jest/globals";
import {
  dereferenceURI,
  getObjectsGraphFromPropertyPath,
  getObjectsFromPropertyPathList,
} from "../src/index";

// Write a test for getObjectsGraphFromPropertyPath
test("getObjectsGraphFromPropertyPath returns correct value", async () => {
  // Setup
  const expectedOutput = ["http://example.org/object"]; // replace with expected output
  const fake_graph = $rdf.graph();
  // some fake triples to insert
  const s = $rdf.sym("http://example.org/subject");
  const p = $rdf.sym("http://marineregions.org/ns/ontology#hasGeometry");
  const o = $rdf.sym("http://example.org/object");

  fake_graph.add(s, p, o);

  const trajectory = ["http://marineregions.org/ns/ontology#hasGeometry"];

  const trajectory_second = [
    "http://marineregions.org/ns/ontology#hasGeometry",
    "http://www.opengis.net/ont/geosparql#asWKT",
  ];

  // Exercise
  const output = getObjectsGraphFromPropertyPath(
    fake_graph,
    trajectory,
    "http://example.org/subject"
  );

  console.log(output);

  // Verify
  expect(output).toEqual(expectedOutput);
});

// Write a test for getObjectsFromPropertyPathList
test("getObjectsFromPropertyPathList returns correct value", () => {
  // Setup
  const expectedOutput = ["http://example.org/object"]; // replace with expected output
  const fake_graph = $rdf.graph();
  // some fake triples to insert
  const s = $rdf.sym("http://example.org/subject");
  const p = $rdf.sym("http://marineregions.org/ns/ontology#hasGeometry");
  const o = $rdf.sym("http://example.org/object");

  fake_graph.add(s, p, o);

  const trajectory = [
    "http://marineregions.org/ns/ontology#hasGeometry",
    "http://www.opengis.net/ont/geosparql#asWKT",
    "http://www.opengis.net/ont/extras#asGML",
  ];

  // Exercise
  const output = getObjectsFromPropertyPathList(
    fake_graph,
    trajectory,
    "http://example.org/subject"
  );

  console.log(output);

  // Verify
  expect(output).toEqual(expectedOutput);
});
