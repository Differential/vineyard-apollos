import { get } from 'lodash';
import { createGlobalId } from '@apollosproject/server-core';
import { Feature } from '@apollosproject/data-connector-postgres';

const id = (type) => ({ apollosId, id: rootId }) =>
  apollosId || createGlobalId(rootId, type);

const { schema, dataSource, resolver: baseResolver } = Feature;

const resolver = {
  ...baseResolver,
  CardListItem: {
    coverImage: ({ image }) => image,
    title: ({ title }, { hyphenated }, { dataSources: { ContentItem } }) =>
      title && hyphenated
        ? ContentItem.createHyphenatedString({ text: title })
        : title,
    actionIcon: ({ subtitle }) => {
        console.log("subtitle: ", subtitle);
    //   switch (subtitle) {
    //     case 'Be Ready':
    //       return 'themed-ready';
    //     case 'Get Set':
    //       return 'themed-set';
    //     case 'Go Serve':
    //       return 'themed-go';
    //     default:
    //       return null;
    //   }
    },
    hasAction: (root, args, { dataSources: { ContentItem } }) =>
      root.attributes &&
      !!get(ContentItem.getVideos(root.relatedNode), '[0].sources[0]', null),
    labelText: ({ subtitle }) => subtitle,
    id: id('CardListItem'),
  },
};

export { dataSource, resolver, schema };
