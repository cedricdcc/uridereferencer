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

function getObjectsFromPropertyPathList(graph, trajectory, uri) {
  // do the getObjectsGraphFromPropertyPath reciprocal until you find an object
  // if you find an object, return it
  // if you don't find an object , pop the last element of the trajectory and do the getObjectsGraphFromPropertyPath reciprocal again
  console.log(trajectory);
  let objects = getObjectsGraphFromPropertyPath(graph, trajectory, uri);
  if (objects.length > 0) {
    console.log(objects);
    return objects;
  }

  if (trajectory.length > 0) {
    console.log(trajectory);
    trajectory.pop();
    return getObjectsGraphFromPropertyPath(graph, trajectory, uri);
  }

  if (trajectory.length == 0) {
    return [];
  }
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

module.exports = {
  dereferenceURI,
  getObjectsGraphFromPropertyPath,
  getObjectsFromPropertyPathList,
};
