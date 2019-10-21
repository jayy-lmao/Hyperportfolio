import React from 'react';
import { Feed } from 'semantic-ui-react';

/**
 * A single newsfeed item to go under a Newsfeed's feed component
 * @param {Object} Current news item with relevant information to format from service call
 */
const NewsFeedItem = ({ item }) => {
  const actualDate = new Date(item.published_at * 1000);
  return (
    <Feed.Event href={item.link}>
      <Feed.Label image={item.main_image && item.main_image.resolutions[1].url} />
      <Feed.Content>
        <Feed.Date content={String(actualDate)} />
        <Feed.Summary>
          {item.title}
          <i>
            -
            {' '}
            {item.author}
          </i>
        </Feed.Summary>
      </Feed.Content>
    </Feed.Event>
  );
};

export default NewsFeedItem;
