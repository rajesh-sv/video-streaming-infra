import { Client } from "@elastic/elasticsearch";
import { ELASTICSEARCH_NODE, ELASTICSEARCH_INDEX } from "./config.js";
import { logger } from "./pinoLogger.js";

const esClient = new Client({ node: ELASTICSEARCH_NODE });

export async function ensureIndexExists() {
  const indexExists = await esClient.indices.exists({
    index: ELASTICSEARCH_INDEX,
  });

  if (!indexExists) {
    logger.info(
      `Elasticsearch index "${ELASTICSEARCH_INDEX}" does not exist. Creating...`,
    );
    await esClient.indices.create({
      index: ELASTICSEARCH_INDEX,
      body: {
        mappings: {
          properties: {
            filename: { type: "text", analyzer: "english" },
            title: { type: "text", analyzer: "english" },
            description: { type: "text", analyzer: "english" },
            indexedAt: { type: "date" },
          },
        },
      },
    });
    logger.info(`Elasticsearch index "${ELASTICSEARCH_INDEX}" created`);
  }
}

export async function indexVideoDocument(videoData) {
  const indexData = {
    filename: videoData.filename,
    title: videoData.title,
    description: videoData.description,
  };

  await esClient.index({
    index: ELASTICSEARCH_INDEX,
    id: videoData.videoId,
    body: {
      ...indexData,
      indexedAt: new Date(),
    },
  });
}
