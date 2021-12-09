import React, { memo } from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';
import { styled, named, withTheme } from '@apollosproject/ui-kit';

import { Slide } from '@apollosproject/ui-onboarding';
import SlideContent from '../SlideContent';

const Background = withTheme(({ theme }) => ({
  style: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: '20%',
  },
  source:
    theme.type === 'light'
      ? require('./PrayLight.png')
      : require('./PrayDark.png'),
}))(Image);

const StyledSlideContent = styled({
  height: '33%',
})(SlideContent);

const Features = memo(({ firstName, description, ...props }) => (
  <Slide {...props}>
    <Background />
    <StyledSlideContent
      title={'Support Your Community Through Prayer'}
      description={description}
    />
  </Slide>
));

Features.displayName = 'Features';

Features.propTypes = {
  /* The `Swiper` component used in `<onBoarding>` looks for and hijacks the title prop of it's
   * children. Thus we have to use more unique name.
   */
  firstName: PropTypes.string,
  description: PropTypes.string,
  /* Recommended usage:
   * - `Image` (react-native)
   * - `GradientOverlayImage` (@apollosproject/ui-kit) for increased readability
   * - `Video` (react-native-video) because moving pictures!
   */
};

Features.defaultProps = {
  description: 'Pray for others or submit prayer requests.',
};

export default named('ui-onboarding.Features')(Features);
