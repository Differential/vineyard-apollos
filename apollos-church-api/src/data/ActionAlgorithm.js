import { ActionAlgorithm } from '@apollosproject/data-connector-postgres';

const { schema, resolver } = ActionAlgorithm;

class dataSource extends ActionAlgorithm.dataSource {
  ACTION_ALGORITHMS = {
    ...this.ACTION_ALGORITHMS,
    COMPLETED_CONTENT_FEED: this.completedContentFeedAlgorithm.bind(this),
  };

  async completedContentFeedAlgorithm({ channelId = '' } = {}) {
    if (!channelId) return [];
    const { Person, ContentItem } = this.context.dataSources;
    const personId = await Person.getCurrentPersonId();

    const items = await ContentItem.model.findAll({
      include: {
        model: this.sequelize.models.interaction,
        where: { action: 'COMPLETE', personId },
        require: true,
      },
      where: { content_item_category_id: channelId },
    });

    return items.map((item, i) => ({
      id: `${item.id}${i}`,
      title: item.title,
      subtitle: item?.contentChannel?.name || '',
      relatedNode: item,
      image: item.getCoverImage(),
      action: 'READ_CONTENT',
      summary: item.summary,
    }));
  }
}

export { schema, resolver, dataSource };
