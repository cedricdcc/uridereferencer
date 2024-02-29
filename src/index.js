import * as $rdf from "rdflib";
import rdfDereferencer from "rdf-dereference";

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
  console.log(objects);
  if (objects.length > 0) {
    console.log(objects);
    return objects;
  }

  if (trajectory.length > 0) {
    console.log(trajectory);
    trajectory.pop();
    return getObjectsFromPropertyPathList(graph, trajectory, uri);
  }

  if (trajectory.length == 0) {
    return [];
  }
}

async function getData(uri, formats) {
  for (const format of formats) {
    try {
      const response = await fetch(uri, { headers: { Accept: format } });
      const contentType = response.headers.get("Content-Type");

      if (response.ok && contentType.includes(format)) {
        return { format, response };
      }
    } catch (error) {
      console.log(error);
    }
  }
  throw new Error("No acceptable format found");
}

export async function getLinkedDataNQuads(uri) {
  // flow function
  // 1. check different formats of the uri and fetch the uri with the correct accept header
  // 2. if the uri has a return format then fetch the uri with the correct accept header
  // 3. if it doesn't ttl or jsonld then fetch the html page of the uri and search for fair signposting links in the head
  // 4. if there are fair signposting links then fetch the uri with the correct accept header given in the fair signposting link // check if this catches all the cases

  const store = $rdf.graph();

  //all formats to check for // TODO: check to make this a global variable in a config file

  const return_formats = [
    "text/turtle",
    "application/ld+json",
    "application/rdf+xml",
    "application/n-triples",
    "application/n-quads",
    "text/n3",
    "text/rdf+n3",
    "text/html",
  ];

  // first try-catch the whome function to detect global errors
  try {
    // get data from uri
    //const data = await fetchData(fetcher, uri, return_formats);
    //console.log(store);

    const data = await getData(uri, return_formats);
    let text = await data.response.text();
    console.log(text);

    switch (data.format) {
      case "application/ld+json":
        $rdf.parse(text, store, uri, "application/ld+json");
        break;
      case "text/turtle":
        $rdf.parse(text, store, uri, "text/turtle");
        break;
      case "text/html":
        //search for fair signposting links in the head
        parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        //get all head links with rel describedby
        const links = doc.querySelectorAll('head link[rel="describedby"]');
        if (links.length > 0) {
          // foreach link get the href and check if it has http in it not prepend the uri
          // the format of the should be in the attribute type of the link , if not then check the extension of the href
          // if the format is not supported then throw an error
          for (const link of links) {
            let href = link.getAttribute("href");
            const type = link.getAttribute("type");
            //if href doesn't include http in the beginning then prepend the uri
            if (!href.includes("http")) {
              href = uri + href;
            }
            //fetch the href with the correct accept header
            const response = await fetch(href, {
              headers: {
                Accept: type,
              },
            });

            //get the text of the response
            text = await response.text();
            if (type === "application/ld+json") {
              $rdf.parse(text, store, href, "application/ld+json");
            } else {
              $rdf.parse(text, store, href, "text/turtle");
            }
          }
        } else {
          throw new Error("No fair signposting links found");
        }
        break;
      default:
        try {
          $rdf.parse(text, store, uri, data.format);
        } catch (error) {
          console.log(error);
          throw new Error("Error parsing data");
        }
    }

    // add data to store
    // await addDataToStore(store, data);
    // return the store
    console.log(store);
    return store;
  } catch (error) {
    console.log(error);
  }
}

function getObjectsGraphFromPropertyPath(graph, trajectory, uri) {
  //console.log(graph);
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
  getLinkedDataNQuads,
};
