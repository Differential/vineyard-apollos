import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  styled,
  named,
  BackgroundView,
  NavigationService,
} from '@apollosproject/ui-kit';
import { AnalyticsConsumer } from '@apollosproject/ui-analytics';

import {
  OnboardingSwiper,
  onboardingComplete,
  WITH_USER_ID,
  AskNotificationsConnected,
  FollowConnected,
} from '@apollosproject/ui-onboarding';

const ONBOARDING_VERSION = 2;

const OnboardingBackgroundView = named(
  'ui-onboarding.Onboarding.OnboardingBackgroundView'
)(BackgroundView);

const FullscreenBackgroundView = styled({
  position: 'absolute',
  width: '100%',
  height: '100%',
})(OnboardingBackgroundView);

export { ONBOARDING_VERSION };

function Onboarding(props) {
  const route = useRoute();
  const navigation = useNavigation();

  const userVersion = route?.params?.userVersion || props?.userVersion || 0;
  const slides = props?.slides || [AskNotificationsConnected, FollowConnected];
  const { data } = useQuery(WITH_USER_ID, { fetchPolicy: 'network-only' });
  return (
    <AnalyticsConsumer>
      {({ notify }) => (
        <>
          <FullscreenBackgroundView />
          <OnboardingSwiper
            userVersion={userVersion}
            onComplete={() => {
              onboardingComplete({
                userId: data?.currentUser?.id,
                version: ONBOARDING_VERSION,
                notify,
              });
              navigation.dispatch(
                NavigationService.resetAction({
                  navigatorName: 'Tabs',
                  routeName: 'Home',
                })
              );
            }}
          >
            {({ swipeForward }) => (
              <>
                {slides.map((Slide) => (
                  <Slide
                    key={Slide.displayName}
                    onPressPrimary={swipeForward}
                  />
                ))}
              </>
            )}
          </OnboardingSwiper>
        </>
      )}
    </AnalyticsConsumer>
  );
}

Onboarding.propTypes = {
  userVersion: PropTypes.number,
  slides: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Onboarding;
