import React from 'react';
import { Card, Feed } from 'semantic-ui-react';
import NewsFeedItem from './NewsFeedItem';

/**
 * Newsfeed component that constructs and displays news relevant to a given instrument
 * @param {Objec} data retrieved from service call to populate newsfeed
 */
const NewsFeed = ({ data }) => (
  <Card fluid>
    <Card.Content>
      <Card.Header>Recent News</Card.Header>
    </Card.Content>
    <Card.Content>
      <Feed>
        {data.result
          && data.result.map(
            newsItem => <NewsFeedItem key={newsItem.uuid} item={newsItem} />,
          )}
      </Feed>
    </Card.Content>
  </Card>
);

export default NewsFeed;
