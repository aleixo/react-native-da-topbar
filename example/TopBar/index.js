import React from 'react';
import {
  View, StatusBar, Animated, Dimensions, PanResponder
} from 'react-native';

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
    }

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => { },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderTerminate: (evt, gestureState) => { },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
      onPanResponderMove: (evt, gestureState) => {
        const { toHeight } = this.props;
        if (gestureState.moveY < toHeight) {
          Animated.timing(this.state.fadeAnim, {
            toValue: gestureState.moveY,
            duration: 0,
          }).start()
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { swipeDuration } = this.props;
        const { toHeight } = this.props;
        const toValue = gestureState.moveY < toHeight / 2 ? 0 : toHeight;
        Animated.timing(this.state.fadeAnim, {
          toValue,
          duration: swipeDuration,
        }).start()
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
    const { fadeoutAfter } = this.props;
    const toolbarFadeoutAnimation = {
      toValue: 0,
      duration,
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
      toWidth,
      toHeight
    } = this.props;
    return (
      <View
        style={[
          styles.mainContainer,
          { top: 0, }
        ]}>
        <Animated.View
          style={[styles.topLogoContainer, {
            width: Dimensions.get('window').width / (toWidth || 1.5),
            height: fadeAnim,
            backgroundColor,
            opacity,
          }]}
          {...this.props.swipable && this._panResponder.panHandlers}
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
                  height: fadeAnim,
                }}
              />
            </View>
          }
        </Animated.View>
      </View>
    )
  }
}

TopBar.defaultProps = {
  enable: true,
  swipeDuration: 300,
}

export default TopBar;