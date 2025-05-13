import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT;

const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
}); 