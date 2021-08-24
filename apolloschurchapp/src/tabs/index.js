import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useColorScheme } from 'react-native';
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationService,
  withTheme,
  Icon,
  Touchable,
} from '@apollosproject/ui-kit';
import { useApolloClient } from '@apollo/client';
import {
  UserAvatarConnected,
  createFeatureFeedTab,
} from '@apollosproject/ui-connected';
import { checkOnboardingStatusAndNavigate } from '@apollosproject/ui-onboarding';
import tabBarIcon from './tabBarIcon';

const HeaderLogo = withTheme(() => ({
  size: 24,
  name: 'brand-icon',
}))(Icon);

const SearchIcon = withTheme(({ theme: { colors, sizing: { baseUnit } } }) => ({
  name: 'search',
  size: baseUnit * 2,
  fill: colors.primary,
}))(Icon);

const SearchButton = ({ onPress }) => (
  <Touchable onPress={onPress}>
    <SearchIcon />
  </Touchable>
);

SearchButton.propTypes = {
  onPress: PropTypes.func,
};

const Avatar = withTheme(({ theme: { sizing: { baseUnit } } }) => ({
  size: 'small',
  containerStyle: {
    bottom: baseUnit * 0.25,
  },
}))(UserAvatarConnected);

const HeaderLeft = () => {
  const navigation = useNavigation();
  return <Avatar onPressIcon={() => navigation.navigate('Connect')} />;
};
const HeaderCenter = () => <HeaderLogo source={require('./wordmark.png')} />;
const HeaderRight = () => {
  const navigation = useNavigation();
  return <SearchButton onPress={() => navigation.navigate('Search')} />;
};

// we nest stack inside of tabs so we can use all the fancy native header features
const HomeTab = createFeatureFeedTab({
  screenOptions: {
    headerHideShadow: true,
    headerLeft: HeaderLeft,
    headerCenter: HeaderCenter,
    headerLargeTitle: false,
  },
  tabName: 'Home',
  feedName: 'HOME',
});

const ReadyTab = createFeatureFeedTab({
  screenOptions: {
    headerLeft: HeaderLeft,
  },
  tabName: 'Be Ready',
  feedName: 'READ',
});

const SetTab = createFeatureFeedTab({
  screenOptions: {
    headerLeft: HeaderLeft,
  },
  tabName: 'Get Set',
  feedName: 'WATCH',
});

const GoTab = createFeatureFeedTab({
  screenOptions: {
    headerLeft: HeaderLeft,
    headerRight: HeaderRight,
  },
  tabName: 'Go Serve',
  feedName: 'PRAY',
});

// This is not hooked up to the schema yet
const StoriesTab = createFeatureFeedTab({
  tabName: 'Stories',
  // feedName: 'STORIES',
});

const { Navigator, Screen } = createBottomTabNavigator();

const TabNavigator = ({ route }) => {
  const client = useApolloClient();
  // this is only used by the tab loaded first
  // if there is a new version of the onboarding flow,
  // we'll navigate there first to show new screens
  useEffect(
    () => {
      checkOnboardingStatusAndNavigate({
        client,
        navigation: NavigationService,
        navigateHome: false,
      });
    },
    [client]
  );

  let activeColor;
  const colorScheme = useColorScheme();

  switch (getFocusedRouteNameFromRoute(route)) {
    case 'Ready':
      activeColor = 'rgba(79, 110, 174, 1)';
      break;
    case 'Set':
      activeColor = 'rgba(95, 192, 194, 1)';
      break;
    case 'Go':
      activeColor = 'rgba(250, 101, 85, 1)';
      break;
    default:
      if (colorScheme === 'light') {
        activeColor = '#000000';
      } else {
        activeColor = '#ffffff';
      }
  }

  return (
    <Navigator lazy tabBarOptions={{ activeTintColor: activeColor }}>
      <Screen
        name="Home"
        component={HomeTab}
        options={{ tabBarIcon: tabBarIcon('house') }}
      />
      <Screen
        name="Ready"
        component={ReadyTab}
        options={{ tabBarIcon: tabBarIcon('ready') }}
      />
      <Screen
        name="Set"
        component={SetTab}
        options={{ tabBarIcon: tabBarIcon('set') }}
      />
      <Screen
        name="Go"
        component={GoTab}
        options={{ tabBarIcon: tabBarIcon('go') }}
      />
      <Screen
        name="Stories"
        component={StoriesTab}
        options={{ tabBarIcon: tabBarIcon('chat-dots') }}
      />
    </Navigator>
  );
};

TabNavigator.propTypes = {
  route: PropTypes.string,
};

export default TabNavigator;
