import { get } from 'lodash';
import { createGlobalId } from '@apollosproject/server-core';
import { Feature } from '@apollosproject/data-connector-postgres';

const id = (type) => ({ apollosId, id: rootId }) =>
  apollosId || createGlobalId(rootId, type);

const { schema, dataSource, resolver } = Feature;

const testResolver = {
  ...resolver,
  CardListItem: {
    coverImage: ({ image }) => image,
    title: ({ title }, { hyphenated }, { dataSources: { ContentItem } }) =>
      title && hyphenated
        ? ContentItem.createHyphenatedString({ text: title })
        : title,
    actionIcon: ({ subtitle }) => {
      switch (subtitle) {
        case 'Be Ready':
          return 'themed-ready';
        case 'Get Set':
          return 'themed-set';
        case 'Go Serve':
          return 'themed-go';
        default:
          return null;
      }
    },
    hasAction: (root, args, { dataSources: { ContentItem } }) =>
      root.attributes &&
      !!get(ContentItem.getVideos(root.relatedNode), '[0].sources[0]', null),
    labelText: ({ subtitle }) => subtitle,
    id: id('CardListItem'),
  },
};

export { dataSource, testResolver as resolver, schema };
