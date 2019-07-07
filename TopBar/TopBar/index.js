import React from 'react';
import {
  View, StatusBar, Animated, Dimensions, PanResponder
} from 'react-native';
import PropTypes from 'prop-types'

import styles from './index.styles';

class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fadeAnim: new Animated.Value(-props.toHeight),
    };

    this.toolbarAnimation = {
      toValue: props.toHeight,
      duration: props.fadeinDuration,
      useNativeDriver: this.props.native
    }

    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        if (gestureState.moveY < this.props.toHeight) {
          Animated.timing(this.state.fadeAnim, {
            toValue: gestureState.moveY,
            duration: 0,
            useNativeDriver: this.props.native
          }).start()
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        Animated.timing(this.state.fadeAnim, {
          toValue: gestureState.moveY < this.props.toHeight / 2 ? 0 : this.props.toHeight,
          duration: 300,
          useNativeDriver: this.props.native
        }).start()
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }

  componentDidMount() {
    const { enable } = this.props;
    if (!enable) {
      return
    }

    this.runAnimations();
  }

  componentDidUpdate(prevProps) {
    const hasEnabled = this.props.enable && this.props.enable !== prevProps.enable;

    hasEnabled && this.runAnimations()
  }

  runAnimations = () => {
    const { fadeout, fadeoutDuration } = this.props;

    this.fadeIn(() => fadeout && this.fadeOut(fadeoutDuration))
  }

  fadeIn = (next) => {
    Animated.timing(this.state.fadeAnim, this.toolbarAnimation).start(next)
  }

  fadeOut = (duration) => {
    const { fadeoutAfter, native } = this.props;
    const toolbarFadeoutAnimation = {
      toValue: 0,
      duration,
      useNativeDriver: native
    }
    setTimeout(() => Animated.timing(this.state.fadeAnim, toolbarFadeoutAnimation).start(this.props.onFadeOut), fadeoutAfter)
  }

  render() {
    const { fadeAnim } = this.state;
    const {
      image,
      renderContent,
      backgroundColor,
      opacity,
      native,
      toWidth,
      toHeight
    } = this.props;
    return (
      <View
        style={[
          styles.mainContainer,
          { top: native ? -toHeight : 0, }
        ]}>
        <Animated.View
          style={[styles.topLogoContainer, {
            width: Dimensions.get('window').width / (toWidth || 1.5),
            height: native ? this.props.toHeight : fadeAnim,
            translateY: native ? fadeAnim : undefined,
            backgroundColor,
            opacity,
          }]}
          {...this._panResponder.panHandlers}
        >
          {renderContent && renderContent()}
          {image &&
            <View style={{
              paddingTop: StatusBar.currentHeight,
              paddingBottom: 20,
            }}>
              <Animated.Image
                resizeMode="contain"
                source={image}
                style={{
                  flex: 1,
                  width: Dimensions.get('window').width / 1.5,
                  height: native ? toHeight : fadeAnim,
                }}
              />
            </View>
          }
        </Animated.View>
      </View>
    )
  }
}

TopBar.propTypes = {
  native: PropTypes.bool,
  enable: PropTypes.bool,
}

TopBar.defaultProps = {
  native: true,
  enable: true,
}

export default TopBar;