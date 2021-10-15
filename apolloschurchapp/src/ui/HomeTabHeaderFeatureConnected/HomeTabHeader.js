import React from 'react';
import { View } from 'react-native';
import { useQuery } from '@apollo/client';
import { H4, H3, styled } from '@apollosproject/ui-kit';
import { format, startOfToday } from 'date-fns';

import GET_USER_NAME from './getUserName';

const StyledCard = styled(({ theme }) => ({
  backgroundColor: theme.colors.paper || undefined,
  ...{
    paddingHorizontal: theme.sizing.baseUnit,
    paddingVertical: theme.sizing.baseUnit * 0.75,
  },
}))(View);

const DateText = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
}))(H4);

const GreetingText = styled(({ theme }) => ({
  color: theme.colors.text.primary,
}))(H3);

const HomeTabHeader = () => {
  const { data } = useQuery(GET_USER_NAME, {
    fetchPolicy: 'cache-and-network',
  });

  const { firstName } = data.currentUser.profile;

  const today = format(startOfToday(), 'EEEE, MMMM do');

  return (
    <StyledCard>
      <DateText>{today}</DateText>
      <GreetingText>{`Welcome, ${firstName}!`}</GreetingText>
    </StyledCard>
  );
};

export default HomeTabHeader;
