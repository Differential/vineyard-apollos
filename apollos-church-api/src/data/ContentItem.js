import { ContentItem } from '@apollosproject/data-connector-postgres';
import { Sequelize } from 'sequelize';
import { createGlobalId } from '@apollosproject/server-core';

const { schema, models, migrations } = ContentItem;

class dataSource extends ContentItem.dataSource {
  async getContentItemTags({ limit }) {
    const tags = await this.sequelize.models.tag.findAll({
      subQuery: false,
      limit,
      includeIgnoreAttributes: false,
      attributes: [
        'name',
        [Sequelize.fn('COUNT', Sequelize.col('contentItems.id')), 'itemsCount'],
      ],
      where: {
        type: 'ContentItem',
      },
      include: [
        {
          model: this.sequelize.models.contentItem,
          attributes: [],
          as: 'contentItems',
        },
      ],
      group: ['tag.id'],

      order: [Sequelize.literal('"itemsCount" DESC')],
    });

    return tags.map(({ name }) => name);
  }

  getFeatures = async (model) => {
    const { Feature } = this.context.dataSources;
    const features = await model.getFeatures({
      order: [['priority', 'ASC']],
    });

    // filter out location and event features
    // those are handled differently and are shown above the content
    const filteredFeatures = features.filter(
      (feature) =>
        !['EventDateFeature', 'LocationFeature'].includes(feature.apollosType)
    );

    if (
      model.dataValues.contentItemCategoryId ===
      '1acff1cb-805b-4561-b5f7-ee136b0b39b4'
    ) {
      filteredFeatures.push(
        Feature.createActionTableFeature({
          __typename: 'ActionTableFeature',
          title: '',
          actions: [
            {
              id: createGlobalId(
                JSON.stringify({
                  __typename: 'ActionTableItem',
                  title: 'Share your story',
                }),
                'ActionTableItem'
              ),
              title: 'Share your story',
              action: 'OPEN_URL',
              relatedNode: {
                __typename: 'Url',
                url: 'GoDoGood://app-link/nav/Stories',
              },
            },
          ],
        })
      );
    }

    return filteredFeatures;
  };
}

const resolver = {
  ...ContentItem.resolver,
  Query: {
    ...ContentItem.resolver.Query,
    contentItemTags: (root, args, { dataSources }) =>
      dataSources.ContentItem.getContentItemTags({ limit: 10 }),
  },
};

export { schema, resolver, dataSource, models, migrations };
