import * as $rdf from "rdflib";
import { dereference } from "rdf-dereference";

function dereferenceURI(graph, trajectory, uri) {
  // check type of parameters
  // trajectory is an array of URI strings
  if (!Array.isArray(trajectory)) {
    throw new Error("trajectory must be an array of URI strings");
  }
  // graph is an RDFLib graph
  if (!(graph instanceof $rdf.graph)) {
    throw new Error("graph must be an RDFLib graph");
  }

  // example trajectory: ["http://marineregions.org/ns/ontology#hasGeometry", "http://www.opengis.net/ont/geosparql#asWKT"]

  return graph;
}

function getObjectsGraphFromPropertyPath(graph, trajectory, uri) {
  console.log(graph);
  let trajectory_string = "<" + trajectory.join(">/<") + ">";
  console.log(trajectory_string);
  let query = `SELECT ?o WHERE { <${uri}> ${trajectory_string} ?o . }`;
  console.log(query);
  const queryObject = $rdf.SPARQLToQuery(query, false, graph);
  const results = graph.querySync(queryObject);
  console.log(results);
  let all_objects = [];
  for (let i = 0; i < results.length; i++) {
    let row_result = results[i];
    let value_object = row_result["?o"].value;
    all_objects.push(value_object);
  }
  return all_objects;
}

module.exports = { dereferenceURI, getObjectsGraphFromPropertyPath };
