import React, {
    Component
  } from 'react';
  import {
    View,
    Text,
    FlatList,
    TouchableOpacity
  } from 'react-native';
// import firebase from 'firebase';
import ListView from 'deprecated-react-native-listview';
import {styles} from './AssignDoc/SearchAssignDoc/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

class ItemList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            // dataSource: new ListView.DataSource({
            //     rowHasChanged: (row1, row2) => row1 !== row2
            // }),
        }
    }

    assignPage = () => {
        console.log('AssignDoc');
        this.props.navigation.navigate('AssignDoc');
    };


    // getDataSource(posts) {
    //     console.log('getDataSource')
    //     console.log(posts)
    //     if(!posts) return;
    //     return this.state.dataSource.cloneWithRows(posts);
    // }

    // componentDidMount() {
    //     console.log('componentDidMount')
    //     console.log(this.props.posts)
    //     this.setState({dataSource: this.getDataSource(this.props.posts)});
    // }

    // componentWillReceiveProps(props) {
    //     console.log('componentWillReceiveProps')
    //     console.log(props.posts)
    //     this.setState({dataSource: this.getDataSource(props.posts)});
    // }


    listenForDocs(tmpDocs) {
        tmpDocs.on('value', (dataSnapshot) => {
            var docs = [];
            dataSnapshot.forEach((child) => {
                docs.push({
                    name: child.val().title,
                    _key: child.key
                });
            });

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(docs)
            });
        });
    }

    renderRow = (doc) => {
        return (
        <View style={styles.contentLayout}>
            <TouchableOpacity
              style={styles.itemContentView}
              onPress={() => this.assignPage()}>
              <TouchableOpacity
                style={styles.subItemTop}
                onPress={() => this.assignPage()}>
                <Icon
                  name="account-circle"
                  style={styles.itemIcon}
                  onPress={() => this.assignPage()}
                />
                <TouchableOpacity
                  style={styles.rowStyle}
                  onPress={() => this.assignPage()}>
                  <Text style={styles.itemText}>{doc.assignTo}</Text>
                  <Text style={styles.itemTextDetail}>วันนี้ 11.30 น.</Text>
                </TouchableOpacity>
                <Icon
                  name="remove-red-eye"
                  style={styles.itemIcon} 
                />
                <Text style={styles.redDot}/>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subItemBottom}
                >
                <TouchableOpacity >
                  <Text style={styles.itemTextTopic}>{doc.topic}</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        );
    }


    renderRefreshControl() {
        this.setState({ isLoading: true })
        // this.props.getPosts();
    }

    render() {
        return(
            <FlatList
                data={this.props.docs}
                renderItem={({item}) => this.renderRow(item)}
                keyExtractor={(item, index) => item.Id}
                onRefresh={() => this.renderRefreshControl()}
                refreshing={this.state.isLoading}
                initialNumToRender={3}
                contentContainerStyle={{
                    flexGrow: 0,
                }}
            />
            // <FlatList
            //     dataSource={this.state.dataSource}
            //     renderRow={this.renderRow}
            //     enableEmptySections={true}
            // />
        );
    }
}

export default ItemList;