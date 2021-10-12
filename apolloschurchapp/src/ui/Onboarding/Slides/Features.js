import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { named } from '@apollosproject/ui-kit';

import { Slide } from '@apollosproject/ui-onboarding';
import SlideContent from '../SlideContent';

const Features = memo(
  ({
    firstName,
    descriptionOne,
    descriptionTwo,
    BackgroundComponent,
    ...props
  }) => (
    <Slide {...props}>
      {BackgroundComponent}
      <SlideContent
        icon="brand-icon"
        title={"We're Glad You're Here."}
        descriptionOne={descriptionOne}
        descriptionTwo={descriptionTwo}
      />
    </Slide>
  )
);

Features.displayName = 'Features';

Features.propTypes = {
  /* The `Swiper` component used in `<onBoarding>` looks for and hijacks the title prop of it's
   * children. Thus we have to use more unique name.
   */
  firstName: PropTypes.string,
  descriptionOne: PropTypes.string,
  descriptionTwo: PropTypes.string,
  /* Recommended usage:
   * - `Image` (react-native)
   * - `GradientOverlayImage` (@apollosproject/ui-kit) for increased readability
   * - `Video` (react-native-video) because moving pictures!
   */
  BackgroundComponent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

Features.defaultProps = {
  descriptionOne: "We're Excited To Start This Journey To",
  descriptionTwo: 'Overflow Our City With Kindness.',
};

export default named('ui-onboarding.Features')(Features);
