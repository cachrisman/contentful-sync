const moment = require('moment');

const findDifferences = ({stagingContent, productionContent, type}) => {
  const updatedContent = [];
  const newContent = [];
  const removedContent = [];
  // For each piece of staging content, update the matching piece of production content
  // if the publish of the staging content is later than the matching production content
  stagingContent.forEach( (stagingDatum) => {
    const matchingProductionDatum = productionContent.find( (productionDatum) => {
      return stagingDatum.sys.id === productionDatum.sys.id
    });
    if (matchingProductionDatum) {
      const productionPublishTime = moment(matchingProductionDatum.sys.publishedAt);
      const stagingPublishTime = moment(stagingDatum.sys.publishedAt);
      if (stagingPublishTime.isSameOrAfter(productionPublishTime)) {
        updatedContent.push(stagingDatum)
      }
    } else {
      newContent.push(stagingDatum)
    }
  });
  productionContent.forEach( (productionDatum) => {
    const matchingStagingDatum = stagingContent.find( (stagingDatum) => {
      return productionDatum.sys.id === stagingDatum.sys.id;
    });
    if (!matchingStagingDatum) {
      removedContent.push(productionDatum)
    }
  })
  return {
    type,
    updatedContent,
    newContent,
    removedContent
  }
}

const formatData = function (contentfulData) {
  const { stagingData, productionData } = contentfulData;
  const productionContentTypes = productionData.contentTypes;
  const productionEntries = productionData.entries;
  const productionAssets = productionData.assets;

  const stagingContentTypes = stagingData.contentTypes;
  const stagingEntries = stagingData.entries;
  const stagingAssets = stagingData.assets;
  return [
    {
      type: 'Entries',
      stagingContent: stagingEntries,
      productionContent: productionEntries
    },
    {
      type: 'Assets',
      stagingContent: stagingAssets,
      productionContent: productionAssets
    },
    {
      type: 'ContentTypes',
      stagingContent: stagingContentTypes,
      productionContent: productionContentTypes
    }
  ]
}

const diffSpaces = (contentfulData) => {
  console.log('Beginning diffing of Contentful spaces');
  const dataSets = formatData(contentfulData)
  return dataSets.map( (set) => {
    return findDifferences(set)
  });
}

module.exports = diffSpaces;
