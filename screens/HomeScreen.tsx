import * as React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Post, REST } from '../api';

import SliderPostsScreen from '../components/SliderPostsScreen';
import { Text, View } from '../components/Themed';

export default function TabHomeScreen({navigation}:{navigation:any}) {
  const [data, setData] = React.useState<Array<Post>>([])
  React.useEffect(() => {
    REST.getPosts().then((payload)=>{      
      setData(payload)
    })
  }, [])

  if(data.length){
    return (
      <ScrollView style={styles.container}>
        <SliderPostsScreen
          posts={data}
          title={"Recommended"}
          onPress={(post) => navigation.navigate('RecipeScreen',{post})}
        />
      </ScrollView>
    )
  }else{
    return (<Text>Loading...</Text>)
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    marginLeft: 12,
  },
});
