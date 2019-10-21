import React, { Component } from 'react';
import {
  Item, Icon, Container, Modal, Label, Loader, Divider, Step,
} from 'semantic-ui-react';
import WatchItem from './WatchlistItem';
import Navbar from '../../navbar/Navbar';
import CreateWatchlistPage from './CreateWatchlistModal';
import watchlistService from '../../../services/watchlistService';

/**
 * A component that wraps around a watchlist display table anad constructs all
 * components that comprise the main watchlist page
 */
class WatchlistPage extends Component {
    /**
     * Given state of component
     */
    state = {
      watchlists: [],
      creator: false,
      isLoaded: false,
    }

    /**
     * Sets the watchlists on the list display
     * @param {Array<String>} The watchlists to display
     */
    setWatchlists = (watchlists) => {
      if (watchlists) {
        this.setState({
          watchlists,
          isLoaded: true,
        });
      }
    }

    /**
     * Lifecycle method that runs when this component mounts
     */
    componentDidMount = async () => {
      const { history } = this.props;
      watchlistService.getWatchlists(this.setWatchlists)
        .catch(() => history.push('/')); // Sends user to home if there's a permission error
    }

    /**
     * Toggles the overlaid watchlist creator between the user creating a watchlist or
     * viewing the page
     */
    toggleCreator = () => {
      const { creator } = this.state;
      this.setState({ creator: !creator });
      if (creator) {
        this.componentDidMount();
      }
    }

    /**
     * render
     * @return {ReactElement} markup
     */
    render() {
      const { watchlists, isLoaded, creator } = this.state;
      const { history } = this.props;
      return (
        <div>
          <Container>
            <Navbar page="Watchlists" />
            <Step.Group unstackable size="mini">
              <Step active as="a" onClick={() => history.push('/watchlists/')}>
                <Icon size="mini" name="eye" />
                <Step.Content>
                  <Step.Title>Watchlists</Step.Title>
                  <Step.Description>Manage Watchlists</Step.Description>
                </Step.Content>
              </Step>
            </Step.Group>
            <br />
            <Modal
              basic
              dimmer="inverted"
              open={creator}
              onClose={this.componentDidMount}
            >
              <CreateWatchlistPage toggleCreator={this.toggleCreator} watchlists={watchlists} />
            </Modal>
            <Label
              as="a"
              onClick={() => this.toggleCreator()}
            >
              <Icon size="large" name="plus square" />
                        New Watchlist
            </Label>
            <Divider />
            {isLoaded
              ? (
                <div className="animated fadeIn faster">
                  <Item.Group divided>
                    {watchlists.map(
                      watchlist => (
                        <WatchItem
                          title={watchlist.name}
                          id={watchlist.id}
                          description={watchlist.description}
                          dateCreated={watchlist.date_created.split('T')[0]}
                          key={watchlist.name}
                          redirect={history.push}
                        />
                      ),
                    )
                            }
                  </Item.Group>
                </div>
              )
              : (
                <Loader size="large">Loading</Loader>
              )
                    }
          </Container>
        </div>
      );
    }
}

export default WatchlistPage;
