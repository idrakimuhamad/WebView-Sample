'use strict';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  WebView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const WEBVIEW_REF = 'GMSMST';
const DEFAULT_URL = 'http://gms.mst-tech.com/';
const HEADER = '#2A9CD7';
const BGWASH = 'rgba(255,255,255,0.8)';
const DISABLED_WASH = 'rgba(255,255,255,0.25)';

const customScript = `
  function callback(e) {
    var e = window.e || e;

    if (e.target.tagName !== 'A')
        return;
    if (e.target.host !== 'gms.mst-tech.com') {
      // if not the same host, eg redirect from the app,
      // stop it from redirecting
      e.preventDefault();
    }
  }
  (function () {
    if (document.addEventListener)
      document.addEventListener('click', callback, false);
    else
      document.attachEvent('onclick', callback);
  }());
`;

class WebViewApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: DEFAULT_URL,
      backButtonEnabled: false,
      forwardButtonEnabled: false,
      loading: true,
      scalesPageToFit: true,
      status: 'No page loaded'
    };
  }
  goBack() {
    this.refs[WEBVIEW_REF].goBack();
  }

  goForward() {
    this.refs[WEBVIEW_REF].goForward();
  }

  reload() {
    this.refs[WEBVIEW_REF].reload();
  }

  onNavigationStateChange(navState) {
    this.setState({
      backButtonEnabled: navState.canGoBack,
      forwardButtonEnabled: navState.canGoForward,
      url: navState.url,
      status: navState.title,
      loading: navState.loading,
      scalesPageToFit: true
    });
  }

  onBridgeMessage(message){
    switch (message) {
      case 'stop':
        this.refs[WEBVIEW_REF].stopLoading();
        break;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.controlRow}>
          <TouchableOpacity
            onPress={this.goBack.bind(this)}
            style={this.state.backButtonEnabled ? styles.navButton : styles.disabledButton}>
            <Text>
               <Icon name="md-arrow-back" size={30} color="#333" />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.goForward.bind(this)}
            style={this.state.forwardButtonEnabled ? styles.navButton : styles.disabledButton}>
            <Text>
              <Icon name="md-arrow-forward" size={30} color="#333" />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.reload.bind(this)}
            style={styles.navButton}>
            <Icon name="md-refresh" size={30} color="#333" />
          </TouchableOpacity>
        </View>
        <WebView
          ref={WEBVIEW_REF}
          automaticallyAdjustContentInsets={false}
          style={styles.webView}
          source={{uri: this.state.url}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          decelerationRate="normal"
          onNavigationStateChange={this.onNavigationStateChange.bind(this)}
          startInLoadingState={true}
          scalesPageToFit={this.state.scalesPageToFit}
          injectedJavaScript={customScript}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HEADER
  },
  controlRow: {
    flexDirection: 'row',
    padding: 8,
    paddingTop: 38,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0, .35)'
  },
  webView: {
    backgroundColor: BGWASH,
    height: 350,
  },
  navButton: {
    padding: 3,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BGWASH,
    borderColor: 'transparent',
    borderRadius: 3,
  },
  disabledButton: {
    padding: 3,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DISABLED_WASH,
    borderColor: 'transparent',
    borderRadius: 3,
  },
  goButton: {
    height: 24,
    padding: 3,
    marginLeft: 8,
    alignItems: 'center',
    backgroundColor: BGWASH,
    borderColor: 'transparent',
    borderRadius: 3,
    alignSelf: 'stretch',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    height: 22,
  },
  statusBarText: {
    color: 'white',
    fontSize: 13,
  }
});

AppRegistry.registerComponent('WebViewApp', () => WebViewApp);
