import { Feature } from '@apollosproject/data-connector-postgres';
import gql from 'graphql-tag';
import { Op } from 'sequelize';
import ApollosConfig from '@apollosproject/config';

const { models, migrations } = Feature;

class dataSource extends Feature.dataSource {
  getLocationFeature = async (args) => {
    const contentItemId = args.nodeId.split(':')[1];

    const locationDateFeature = await this.model
      .findAll({
        where: {
          parentId: contentItemId,
          type: {
            [Op.or]: ['Location', 'EventDate'],
          },
        },
      })
      .then((features) =>
        features.reduce((locationFeature, feature) => {
          if (feature.type === 'Location') {
            return {
              ...locationFeature,
              id: feature.id,
              name: feature.data.name,
              street: feature.data.street,
              city: feature.data.city,
              state: feature.data.state,
              zip: feature.data.zip,
              lat: feature.data.lat,
              long: feature.data.long,
            };
          }
          return {
            ...locationFeature,
            date: feature.data.date,
          };
        }, {})
      );

    return locationDateFeature.id ? locationDateFeature : null;
  };

  getOrganizationFeature = async (args) => {
    const contentItemId = args.nodeId.split(':')[1];
    const organizationFeature = await this.model.findOne({
      where: {
        parentId: contentItemId,
        type: 'Organization',
      },
    });

    if (organizationFeature) {
      return {
        id: organizationFeature.id,
        name: organizationFeature.data.name,
        logoUrl: organizationFeature.data.logo,
      };
    }
    return null;
  };
}

const resolver = {
  ...Feature.resolver,
  Query: {
    ...Feature.resolver.Query,
    getLocationFeature: (root, args, { dataSources }) =>
      dataSources.Feature.getLocationFeature({
        ...args,
      }),
    getOrganizationFeature: (root, args, { dataSources }) =>
      dataSources.Feature.getOrganizationFeature({
        ...args,
      }),
    getContentItemId: (root, args) =>
      ApollosConfig.TABS[args.tab]?.contentItemId,
  },
  CardListItem: {
    ...Feature.resolver.CardListItem,
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
  },
};

const schema = gql`
  ${Feature.schema}

  type LocationFeature implements Feature & Node {
    id: ID!
    order: Int
    name: String
    street: String
    city: String
    state: String
    zip: String
    lat: Float
    long: Float
    date: String
  }

  type OrganizationFeature implements Feature & Node {
    id: ID!
    order: Int
    name: String
    logoUrl: String
  }

  extend enum Tab {
    STORIES
  }

  extend type Query {
    getLocationFeature(nodeId: ID!): LocationFeature
      @cacheControl(scope: PRIVATE)
    getOrganizationFeature(nodeId: ID!): OrganizationFeature
      @cacheControl(scope: PRIVATE)
    getContentItemId(tab: Tab!): ID @cacheControl(scope: PRIVATE)
  }
`;

export { dataSource, migrations, resolver, schema, models };
