import React, { Component } from "react";
import { View, Text, Button } from "react-native";

import firestore from "@react-native-firebase/firestore";

class FirebaseApp extends Component {
  state = {
    users: []
  };
  constructor(props) {
    super(props);
    this.subscriber = firestore()
      .collection("users")
      .onSnapshot(docs => {
        let users = [];
        docs.forEach(doc => {
          users.push(doc.data());
        });
        this.setState({ users });
        console.log(users);
      });
  }
  addRandomUser = async => {
    let name = Math.random()
      .toString(36)
      .substring(7);
    firestore()
      .collection('users')
      .add({
        name,
        age: 20
      });
  };

  onPostLike = postId => {
    // Create a reference to the post
    const usersReference = firestore().doc('users/0jSGIVAEEtGgAwu08YPq');

    return firestore().runTransaction(async transaction => {
      // Get users data first
      const usersSnapshot = await transaction.get(usersReference);

      if (!usersSnapshot.exists) {
        throw 'users does not exist!';
      }

      await transaction.update(usersReference, {
        age: usersSnapshot.data().age + 1,
      });
    });
  };

  massDeleteUsers = async () => {
    // Get all users
    const usersQuerySnapshot = await firestore()
      .collection('users')
      .get();
  
    // Create a new batch instance
    const batch = firestore().batch();
  
    usersQuerySnapshot.forEach(documentSnapshot => {
      batch.delete(documentSnapshot.ref);
    });
  
    batch.commit();
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {this.state.users.map((user, index) => {
          return (
            <View key={index}>
              <Text>
                {user.name}:{user.age}
              </Text>
            </View>
          );
        })}

        <Button title="Adicionar usuario" onPress={this.massDeleteUsers} />
      </View>
    );
  }
}

export default FirebaseApp;
