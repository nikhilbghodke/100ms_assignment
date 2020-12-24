import React,{Component} from "react"
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import VideoView from "./../components/VideoView"
import { withStyles } from "@material-ui/core/styles";
import NavBar from "./../components/Navbar"
import Controls from "./../components/Controls"
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
const styles = (theme) => ({
    root:{
        height:"100vh",
        backgroundColor:"#a8d8ea"
    },
    videos:{
        height:"70vh"
        
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#aa96da',
    },
    
  })
class Conference extends Component{
    constructor(props){
        super(props)
        this.state = {
            streams: [],
            streamInfo: [],
            localStream: null,
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

      disconnect=()=>{
        this.props.client.disconnect()
        this.props.history.push("/createRoom")
      }

      render(){
        const { classes } = this.props;
        let {client,roomId} = this.props
        if (!this.props.client) {
            console.log("Redirecting to Create Room page....")
            return <Redirect to="/" />;
        }
        let selfVideo=null
        if(this.state.localStream)
        selfVideo=<VideoView stream={this.state.localStream} isLocal={true}/>
        let videos=(this.state.streams.map((val,index)=>{
            console.log(val)
            return(<VideoView stream={val.stream} isLocal={false}/>)
        }))
        
        return (<Grid container className={classes.root}>
                        <NavBar/>
                    <Grid container item xs={12} spacing={3} className={classes.videos} justify="center" alignItems="center">
                        {this.state.localStream?selfVideo:<CircularProgress className={classes.backdrop} color="inherit" />}{videos}
                    </Grid>
                    <Grid container item={12} alignItems="center" justify="center">
                      <Grid item xs={4}>
                        <Controls {...this.state} client={client} roomId={roomId} disconnect={this.disconnect}/>
                      </Grid>
                    </Grid>
                </Grid>)
    }
}

export default withStyles(styles, { withTheme: true })(Conference);