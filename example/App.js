import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import TopBar from './AnimatedToolbar';

class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TopBar
          image={require('./assets/icon.png')}
          toHeight={300}
          backgroundColor="red"
          native={false}
          ref={ref => this.rrr = ref}
        />
        <Text>Open up App.js to start working on your app!</Text>
        <Button
          title="OPEN"
          onPress={() => {
            this.rrr.runAnimations()
          }}
        />
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
