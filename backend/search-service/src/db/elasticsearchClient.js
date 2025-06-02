import { Client } from "@elastic/elasticsearch";
import { ELASTICSEARCH_NODE, ELASTICSEARCH_INDEX } from "../config/config.js";

const esClient = new Client({ node: ELASTICSEARCH_NODE });

export async function search(searchString) {
  const result = await esClient.search({
    index: ELASTICSEARCH_INDEX,
    query: {
      multi_match: {
        query: searchString,
        fields: ["filename", "title", "description"],
        type: "best_fields",
        fuzziness: "AUTO",
      },
      _source: ["videoId"],
    },
  });

  const hits = result.hits.hits;
  const videoIds = hits.map((hit) => hit._source.videoId);
  return videoIds;
}
