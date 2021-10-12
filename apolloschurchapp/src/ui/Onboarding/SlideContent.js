import React from 'react';
import { View } from 'react-native';
import {
  styled,
  withTheme,
  Icon,
  H3,
  H5,
  withIsLoading,
} from '@apollosproject/ui-kit';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native-safe-area-context';

const IconWrapper = styled(
  ({ theme }) => ({
    paddingBottom: theme.sizing.baseUnit, // wrapper is used to pad placeholder as well.
    alignItems: 'center',
  }),
  'ui-onboarding.Slide.SlideContent.IconWrapper'
)(View);

const BrandIcon = withTheme(
  ({ theme, icon }) => ({
    name: typeof icon === 'string' ? icon : 'brand-icon',
    size: theme.sizing.baseUnit * 10,
  }),
  'ui-onboarding.Slide.SlideContent.BrandIcon'
)(Icon);

const TitleWrapper = styled(
  ({ theme }) => ({
    paddingBottom: theme.sizing.baseUnit * 0.5, // wrapper is used to pad placeholder as well.
    alignItems: 'center',
  }),
  'ui-onboarding.Slide.SlideContent.TitleWrapper'
)(View);

const Title = styled(
  ({ theme }) => ({
    color: theme.colors.primary,
  }),
  'ui-onboarding.Slide.SlideContent.Title'
)(H3);

const DescriptionWrapper = styled(
  () => ({ alignItems: 'center' }),
  'ui-onboarding.Slide.SlideContent.DescriptionWrapper'
)(View);

const Description = styled(
  ({ theme }) => ({
    color: theme.colors.text.secondary,
  }),
  'ui-onboarding.Slide.SlideContent.Description'
)(H5);

const Wrapper = styled(
  ({ theme }) => ({
    paddingVertical: theme.sizing.baseUnit,
    paddingHorizontal: theme.sizing.baseUnit,
    marginTop: '50%',
  }),
  'ui-onboarding.Slide.SlideContent.Wrapper'
)(SafeAreaView);

const SlideContent = withIsLoading(
  ({
    icon,
    title,
    descriptionOne,
    descriptionTwo,
    children,
    isLoading,
    ...props
  }) => {
    if (!icon && !title && !description && !children) {
      console.warn(
        `Warning: You need to pass at least one prop for SlideContent to render something cowboy.`
      );
    }

    return (
      <Wrapper {...props}>
        <View>
          {icon ? (
            <IconWrapper>
              <BrandIcon icon={icon} isLoading={isLoading} />
            </IconWrapper>
          ) : null}
          <TitleWrapper>
            <Title>{title}</Title>
          </TitleWrapper>
          <DescriptionWrapper>
            <Description>{descriptionOne}</Description>
            <Description>{descriptionTwo}</Description>
          </DescriptionWrapper>
        </View>
        {children}
      </Wrapper>
    );
  }
);

SlideContent.displayName = 'SlideContent';

SlideContent.propTypes = {
  icon: PropTypes.oneOfType([
    PropTypes.bool, // Use default `brand-icon`
    PropTypes.string, // Use a custom icon name
  ]),
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default SlideContent;
