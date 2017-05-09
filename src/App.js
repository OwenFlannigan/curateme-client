import React, { Component } from 'react';
import logo from './logo.svg';
import md5 from 'js-md5';
import QueryString from 'query-string';
import _ from 'lodash';

import { Layout, Navigation, Drawer, Header, Textfield, IconButton, Menu, MenuItem, Badge, Snackbar } from 'react-mdl';
import { browserHistory, IndexLink, Link } from 'react-router';
import SongPlayer from './Components/SongPlayer';
import { InboxDialog, AddFriendDialog } from './Components/Dialog';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: '',
      messages: {},
      profile: this.props.route.auth.getProfile(),
      isSnackbarActive: false
    };
  }

  componentDidMount() {
    const { controller, audioController, auth } = this.props.route;


    audioController.emitter.addListener('updated', (data) => {
      this.setState({ playerData: data, isPlayerActive: true });
    });

    if (auth.loggedIn()) {
      // refresh inbox every minute
      this.loadInbox();
      this.timer = setInterval(() => {
        this.loadInbox();
      }, 60000);
    }

    controller.getUsers()
      .then((data) => {
        // remove myself from list
        delete data[auth.getProfile().userKey];
        var users = _.map(_.compact(data), (user) => {
          return user.username;
        });
        this.setState({ users: users });
      });
  }

  componentWillUnmount() {
    if (this.timer) {
      this.timer = null;
    }
  }

  loadInbox() {
    const { controller } = this.props.route;

    controller.getMyProfile()
      .then((data) => {
        if (data.inbox) {
          this.setState({ inbox: data.inbox });
        } else {
          this.setState({ inbox: {} });
        }
      });
  }

  handleChange(event) {
    var fields = {};
    fields[event.target.name] = event.target.value;
    this.setState(fields);
  }

  handleSearch() {
    console.log('searching');
    if (this.state.searchQuery) {
      browserHistory.push('/search?' + QueryString.stringify({ q: this.state.searchQuery }));
      this.setState({ searchQuery: '' });
    }
    // const { controller } = this.props.route;

    // if (this.state.searchQuery) {
    //   controller.search(this.state.searchQuery)
    //     .then((data) => {
    //       console.log('search data', data);
    //     });
    // }
  }

  handleMessageDelete(messageKey) {
    const { controller } = this.props.route;

    controller.deleteMyMessage(messageKey)
      .then((data) => {
        if (data.message) {
          this.loadInbox();
        }
      });
  }

  handleAddFriendSubmit() {
    console.log('submitted with users', this.state.addFriendUsers);
    this.setState({ loading: true });
    const { controller } = this.props.route;

    var usernames = _.map(this.state.addFriendUsers, (user) => {
      return user.text;
    });

    controller.addFriend(usernames)
      .then((data) => {
        this.setState({
          loading: false,
          isAddFriendDialogActive: false,
          addFriendUsers: [],
          isSnackbarActive: true,
          snackBarText: data.message
        });
      });
  }

  render() {
    let children = null;
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        auth: this.props.route.auth, //sends auth instance from route to children
        audio: this.props.route.audioController
      });
    }


    if (this.state.isPlayerActive) {
      var childBottomMargin = '7rem';
    }

    if (this.state.inbox) {
      var sharedPlaylistsMessages = {};
      _.forEach(this.state.inbox.playlists, (message, key) => {
        sharedPlaylistsMessages[key] = (
          <div>
            <Link to={'/users/' + message.from.key}>{message.from.name}</Link> shared a <Link to={'/playlists/' + message.playlist_key}>playlist</Link> with you.
          </div>
        );
      });

      // concact here, when more message styles have been added. May need to _.flatten
      console.log('shared stuff', sharedPlaylistsMessages);
      var messages = sharedPlaylistsMessages;
    }


    // var profile = <img className="profile-button" src={'https://www.gravatar.com/avatar/' + md5('oflann@uw.edu')} />;
    var title = <h1 style={{ paddingLeft: '0' }}>curate<span>.</span>me</h1>;
    return (
      <div className="App">
        <Layout fixedHeader>
          <Header title={title} hideSpacer seamed style={{ position: 'relative' }}>

            <Navigation className="hide-phone">
              <IndexLink to="/home" activeClassName="active">Home</IndexLink>
              {/*<IndexLink to="/discovery" activeClassName="active">Discovery</IndexLink>*/}
              <IndexLink to="/playlists" activeClassName="active">My Playlists</IndexLink>
              {/*<IndexLink to="/radio" activeClassName="active">Radio</IndexLink>*/}
              <IndexLink to="/events" activeClassName="active">Events</IndexLink>
              {children.props.auth.loggedIn() && <IndexLink onClick={children.props.auth.logout}>Logout</IndexLink>}
            </Navigation>

            <div className="nav-search-container">
              <Textfield
                className="nav-search-field"
                onChange={(e) => { this.handleChange(e) }}
                label="Search..."
                name="searchQuery"
                placeholder="search..."
                value={this.state.searchQuery}
                expandable
                expandableIcon="search"
                onClick={() => { this.handleSearch() }}
                onKeyPress={(e) => { if (e.key == 'Enter') { this.handleSearch() } }}
              />

              {this.props.route.auth.loggedIn() && <div className="add-menu-container" style={{ verticalAlign: 'super' }}>
                <IconButton
                  name={_.values(messages).length ? 'mail' : 'mail_outline'}
                  onClick={() => { this.setState({ isInboxActive: true }) }} />
              </div>}

              {this.props.route.auth.loggedIn() && <div className="add-menu-container" style={{ verticalAlign: 'super' }}>
                <IconButton name="add" id="add-menu" />
                <Menu target="add-menu" align="right">
                  {/*<MenuItem>Post an Update</MenuItem>*/}
                  <MenuItem><Link to="/playlists/add">Create a Playlist</Link></MenuItem>
                  <MenuItem onClick={() => { this.setState({ isAddFriendDialogActive: true }) }}><Link>Add a Friend</Link></MenuItem>
                </Menu>
              </div>}
            </div>

            {/*{profile}*/}
          </Header>

          <Drawer title="Navigation" className="hide-desktop">
            <Navigation>
              <IndexLink to="/" activeClassName="active">Home</IndexLink>
              <IndexLink to="/playlists" activeClassName="active">My Playlists</IndexLink>
              <IndexLink to="/radio" activeClassName="active">Radio</IndexLink>
            </Navigation>
          </Drawer>

          <div style={{ marginBottom: childBottomMargin }}>
            {children}
          </div>

          {this.state.playerData && <SongPlayer
            data={this.state.playerData}
            updateParent={(state) => { this.setState(state) }} />}


        </Layout>

        {this.state.isInboxActive && <InboxDialog
          active={this.state.isInboxActive}
          onClose={() => { this.setState({ isInboxActive: false }) }}
          onDeleteMessage={(key) => { this.handleMessageDelete(key) }}
          onRefresh={() => { this.loadInbox() }}
          messages={messages ? messages : []} />}

        {this.state.isAddFriendDialogActive &&
          <AddFriendDialog
            active={this.state.isAddFriendDialogActive}
            users={this.state.users}
            tags={_.map(this.state.addFriendUsers, 'name')}
            onNewTag={(u) => { this.setState({ addFriendUsers: u }) }}
            onClose={() => { this.setState({ isAddFriendDialogActive: false, addFriendUsers: [] }) }}
            onSubmit={() => { this.handleAddFriendSubmit() }}
            users={this.state.users} />}

        <Snackbar
          active={this.state.isSnackbarActive}
          onClick={() => { this.setState({ isSnackbarActive: false }) }}
          onTimeout={() => { this.setState({ isSnackbarActive: false }) }}
          action="Close">{this.state.snackBarText}</Snackbar>

      </div>
    );
  }
}

export default App;
