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
import {liststyles} from './liststyle';
import Icon from 'react-native-vector-icons/MaterialIcons';

class StatusList extends Component {
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

    acceptPage = () => {
        console.log('AcceptDoc');
        this.props.navigation.navigate('AcceptDoc');
    };

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
        <View style={liststyles.contentLayout}>
            <TouchableOpacity
              style={liststyles.itemContentView}
              onPress={() => this.assignPage()}>
              <TouchableOpacity
                style={liststyles.subItemTop}
                onPress={() => this.assignPage()}>
                <Icon
                  name="account-circle"
                  style={liststyles.itemIcon}
                  onPress={() => this.assignPage()}
                />
                <TouchableOpacity
                  style={liststyles.rowStyle}
                  onPress={() => this.assignPage()}>
                  <Text style={liststyles.itemText}>{doc.selectedUser}</Text>
                  <Text style={liststyles.itemTextDetail}>วันนี้ 11.30 น.</Text>
                </TouchableOpacity>
                <Icon
                  name="remove-red-eye"
                  style={liststyles.itemIcon} 
                />
                <Text style={liststyles.redDot}/>
              </TouchableOpacity>
              <TouchableOpacity
                style={liststyles.subItemBottom}
                >
                <TouchableOpacity >
                  <Text style={liststyles.itemTextTopic}>{doc.topic}</Text>
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

export default StatusList;