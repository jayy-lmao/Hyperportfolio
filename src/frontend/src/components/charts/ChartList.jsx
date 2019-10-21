import React, { Component } from 'react';
import 'pure-react-carousel/dist/react-carousel.es.css';
import 'pure-react-carousel/dist/react-carousel.cjs.css';
import { Card, Header, Container } from 'semantic-ui-react';
import {
  CarouselProvider, Slider, Slide, DotGroup,
} from 'pure-react-carousel';

import SparkLine from './Sparkline';

/**
 * Constructs a slider and carousel to act as a single visual component to
 * display charted summaries of major stocks
 */
class ChartList extends Component {
  /**
   * Constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    const { charts } = this.props;
    this.state = {
      galleryItems: this.galleryItems(charts),
      loading: true,
      width: 0,
    };
  }

  /**
   * Lifecycle function that runs upon completion of component loading
   */
  componentDidMount = () => {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  };

  /**
   * Update the state in response to a prop change
   * @param {Object} props - Props passed from parents.
   * @param {Array<object>} props.charts - Array of charts.
   */
  componentWillReceiveProps = ({ charts }) => {
    this.setState({ galleryItems: this.galleryItems(charts), loading: false });
  };

  /**
   * Gets the width of the window when it's resized.
   */
  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  /**
   * Constructs individual chart "cards" for the carousel
   * @param {Array<object>} charts - relevant information for a specific chart
   */
  galleryItems(charts) {
    return charts.map(chart => (
      <Card key={chart.symbol} className="ticker-card">
        <Card.Content key={chart.symbol}>
          <Card.Description className="center">
            <Header className="ticker-header" as="h5">{chart.shortName}</Header>
            <SparkLine
              className="home-ticker"
              onDragStart={this.handleOnDragStart}
              symbol={chart.symbol}
              range="1d"
              interval="5m"
            />
          </Card.Description>
        </Card.Content>
      </Card>
    ));
  }

  /**
   * Renders component
   * Adds a carousel with a slider component to flick through stock cards
   * @return {ReactElement} markup
   */
  render() {
    const { galleryItems, loading, width } = this.state;
    const maxWidth = width / 200;
    return (
      <div className="ticker-box animated fadeIn">
        <CarouselProvider
          alt="carousel"
          naturalSlideWidth={60}
          naturalSlideHeight={90}
          isPlaying
          hasMasterSpinner={loading}
          totalSlides={galleryItems.length}
          visibleSlides={galleryItems.length > maxWidth ? maxWidth : galleryItems.length}
          dragEnabled
        >
          <Slider>
            {galleryItems.map((item, index) => (
              <Slide className="tracker-slide" index={index} key={index.toString()}>
                {item}
              </Slide>
            ))}
          </Slider>
          <Container textAlign="center">
            {!loading && <DotGroup alt="Buttons for carousel" className="ui buttons centered animated fadeIn" />}
          </Container>
        </CarouselProvider>
      </div>
    );
  }
}

export default ChartList;
