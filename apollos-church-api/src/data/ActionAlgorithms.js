import { ActionAlgorithm } from '@apollosproject/data-connector-rock';

class dataSource extends ActionAlgorithm.dataSource {
  ACTION_ALGORITHMS = {
    ...this.ACTION_ALGORITHMS,
    BE_READY_CONTENT_FEED: this.beReadyContentFeedAlgorithm.bind(this),
    GET_SET_CONTENT_FEED: this.getSetContentFeedAlgorithm.bind(this),
    GO_SERVE_CONTENT_FEED: this.goServeContentFeedAlgorithm.bind(this),
  };

  async contentFeedAlgorithm({ channelIds = [], limit = 20, skip = 0 } = {}) {
    const { ContentItem } = this.context.dataSources;
    const items = await ContentItem.getFromCategoryIds(channelIds, {
      limit,
      skip,
    });
    return items.map((item, i) => ({
      id: `${item.id}${i}`,
      title: item.title,
      subtitle: item.contentChannel?.name,
      relatedNode: item,
      image: item.getCoverImage(),
      action: 'READ_CONTENT',
      summary: item.summary,
    }));
  }

  async beReadyContentFeedAlgorithm({
    channelIds = [],
    limit = 1,
    skip = 0,
  } = {}) {
    const { ContentItem } = this.context.dataSources;
    const items = await ContentItem.getFromCategoryIds(channelIds, {
      limit,
      skip,
    });
    return items.map((item, i) => ({
      id: `${item.id}${i}`,
      title: item.title,
      subtitle: 'Be Ready',
      relatedNode: item,
      image: null,
      action: 'READ_CONTENT',
      summary: item.summary,
    }));
  }

  async getSetContentFeedAlgorithm({
    channelIds = [],
    limit = 1,
    skip = 0,
  } = {}) {
    const { ContentItem } = this.context.dataSources;
    const items = await ContentItem.getFromCategoryIds(channelIds, {
      limit,
      skip,
    });
    return items.map((item, i) => ({
      id: `${item.id}${i}`,
      title: item.title,
      subtitle: 'Get Set',
      relatedNode: item,
      image: null,
      action: 'READ_CONTENT',
      summary: item.summary,
    }));
  }

  async goServeContentFeedAlgorithm({
    channelIds = [],
    limit = 1,
    skip = 0,
  } = {}) {
    const { ContentItem } = this.context.dataSources;
    const items = await ContentItem.getFromCategoryIds(channelIds, {
      limit,
      skip,
    });
    return items.map((item, i) => ({
      id: `${item.id}${i}`,
      title: 'Find Your Next Service',
      subtitle: 'Go Serve',
      relatedNode: item,
      image: null,
      action: 'READ_CONTENT',
      summary: item.summary,
    }));
  }
}

export { dataSource };
