import React,{Component} from 'react';
import CreateRoom from "./layouts/CreateRoom"
import JoinRoom from "./layouts/JoinRoom"
import Conference from "./layouts/Conference"
import {API_URL} from "./config"
import { HMSClient, HMSPeer, HMSClientConfig } from '@100mslive/hmsvideo-web';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

async function getToken({ room_id, user_name, role = 'guest', env }) {
  const endpoint = `${API_URL}?api=token`;
  const { token } = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({ room_id, user_name, env, role }),
  })
    .then(response => response.json())
    .catch(err => console.log('Error client token: ', err));
  return token;
}

class App extends Component{
  constructor(){
    super()
    this.state={
      client:null,
      roomId:null
    }
  }

  _createClient = async ( userName, roomId, role="guest" ) => {
    let url = "wss://qa-in.100ms.live"
    //url="https://qa-in.100ms.live/"
    let authToken = await getToken({
      room_id: roomId,
      user_name: userName,
      role,
    });

    console.log(`%c[APP] TOKEN IS: ${authToken}`, 'color: orange');

    try {

      let peer = new HMSPeer(userName, authToken);
      let config = new HMSClientConfig({
        endpoint: url,
      });

      let client= new HMSClient(peer, config);
      console.log(client)
      this.setState({...this.state,"client":client,"roomId":roomId})
      return client

    } catch (err) {
      console.error('ERROR: ', err);
      alert('Invalid token');
    }
  }

  _createRoom = async (roomName) => {
    const endpoint = `${API_URL}?api=room`;
    console.log('Create Room endpoint', endpoint);
   
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        room_name: roomName,
        recording_info: {
          enabled: false,
        },
      }),
    }).catch(err => {
      console.log('Error', err);
    });

    console.log('Response: ', response);
    if (response.status != 200) {
      const data = await response.json();
      alert(data.msg)
    } else {
      const roomEntry = await response.json();
      console.log('response:', roomEntry);
      
      return roomEntry.id;
      
    }
  }

  _createRoomAndClient=async (roomName,userName, role="guest")=>{
      let roomId= await this._createRoom(roomName)
      await this._createClient(userName,roomId,role)

  }


  render(){
    return(
      <Router>
        <Switch>
        <Route exact path="/createRoom" render={(props)=>(
          <CreateRoom createRoomAndClient={this._createRoomAndClient} {...props} />
    )}>
            
        </Route>
        <Route exact path="/joinRoom" render={(props)=>(
          <JoinRoom createClient={this._createClient} {...props} />
    )}>
            
        </Route>
        <Route exact path="/room" render={(props)=>(
          <Conference {...this.state}  {...props} />
    )}>
            
        </Route>
        <Route exact path="/" render={() => (<Redirect to="/createRoom" />)} />
        </Switch>
    </Router>)
  }
}

export default App;
