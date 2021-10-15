import { gql } from '@apollo/client';

export default gql`
  query CurrentUserPhoto {
    currentUser {
      profile {
        firstName
        lastName
      }
    }
  }
`;
