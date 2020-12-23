import React,{Component} from "react"
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
class Conference extends Component{
    constructor(props){
        super(props)
        this.state = {
            streams: [],
            streamInfo: [],
            localStream: null,
            audioMuted: false,
            videoMuted: false,
            pinned: false,
          };
        console.log(props)
    }

    _handleAddStream = async (room, peer, streamInfo) => {
        const { client } = this.props;
        console.log("new stream add")
        let streams = [...this.state.streams];
        try{
        let stream = await client.subscribe(streamInfo.mid, room);
        streams.push({ mid: stream.mid, stream, sid: streamInfo.mid });
        this.setState({...this.state ,streams },()=>{
            console.log(this.state)
        });
    }
    catch(e){
        console.log(e)
    }

        
      };
    
      _handleRemoveStream = async (room, streamInfo) => {
        console.log("new stream add")
        let streams = this.state.streams;
        streams = streams.filter(item => item.sid !== streamInfo.mid);
        this.setState({ ...this.state,streams },()=>{
            console.log(this.state)
        });
      };

    render(){
        if (!this.props.client) {
            console.log("Redirecting to Create Room page....")
            return <Redirect to="/" />;
        }
        return (<div>Inside Call</div>)
    }

    componentDidMount=async ()=>{
        try{
          let {client,roomId} = this.props
          
          
          client.on('connect',async () => {
            console.log("Client connected")
            try {
                console.log(roomId)
                await client.join(roomId);
            } catch(err) {
                // Handle error
                console.log(err)
            }
            try{
                const localStream = await client.getLocalStream({
                  resolution: "vga",
                  bitrate: 256,
                  codec: "VP8",
                  frameRate: 20,
                  shouldPublishAudio:true,
                  shouldPublishVideo:true
                });
                console.log(localStream)
                await client.publish(localStream, roomId);
                this.setState({...this.state,localStream})
            } catch(err) {
                // Handle error
                console.log(err)
            }
          });
          client.on('disconnect', () => {});
          client.on('peer-join', (room, peer) => {
              // Show a notification or toast message in the UI
          });
    
          client.on('peer-leave', (room, peer) => {
              // Show a notification or toast message in the UI
          });
    
          client.on('stream-add', this._handleAddStream);
          client.on('stream-remove', this._handleRemoveStream);
    
          client.on('broadcast', (room, peer ,message) => {
              // Show a notification or update chat UI
          });
          await client.connect()
        }
        catch(e){
          console.log(e)
        }
      }
}

export default withRouter(Conference)