import { ContentItem } from '@apollosproject/data-connector-postgres';

import { Op } from 'sequelize';

const { schema, resolver, models, migrations } = ContentItem;

class dataSource extends ContentItem.dataSource {
  getFeatures = async (model) => {
    const features = await model.getFeatures({
      order: [['priority', 'ASC']],
    });
    // filter out location and event features
    // those are handled differently and are shown above the content
    return features.filter(
      (feature) =>
        !['EventDateFeature', 'LocationFeature'].includes(feature.apollosType)
    );
  };

  getFromCategoryIds = (ids = [], args = {}) => {
    if (ids.some((id) => typeof id === 'number')) {
      console.warn(
        'You are passing rock ids IDS to ContentItem.getFromCategoryIds. This is supported, but we recommend using Postgres IDS in your config.yml long term'
      );
      return this.model.findAll({
        ...args,
        include: [
          {
            model: this.sequelize.models.contentItemCategory,
            where: {
              originId: { [Op.in]: ids.map(String) },
              originType: 'rock',
            },
          },
          ...(args?.include || []),
        ],
      });
    }
    return this.model.findAll({
      ...args,
      where: {
        contentItemCategoryId: { [Op.in]: ids },
        ...args?.where,
      },
      // This is custom....normally it is sorted by DESC
      order: [['publishAt', 'ASC']],
    });
  };
}

export { schema, resolver, dataSource, models, migrations };
