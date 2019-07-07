import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import TopBar from './TopBar';

class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TopBar
          image={require('./assets/icon.png')}
          swipable
          swipeDuration={2000}
          toHeight={300}
          backgroundColor="red"
          native={false}
          ref={ref => this.rrr = ref}
        />
        <Text>dddd</Text>
        <View>
          <Button
            title="OPEN"
            onPress={() => {
              this.rrr.fadeIn()
            }}
          />
          <Button
            title="CLOSE"
            onPress={() => {
              this.rrr.fadeOut()
            }}
          />
        </View>
      </View>
    )
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
