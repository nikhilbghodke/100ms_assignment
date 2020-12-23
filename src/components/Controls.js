import React,{Component} from 'react';
import { ControlButton } from './ControlButton';
import {Card,Grid} from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import MicIcon from '@material-ui/icons/Mic';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicOffIcon from '@material-ui/icons/MicOff';
import CallEndIcon from '@material-ui/icons/CallEnd';
import ShareIcon from '@material-ui/icons/Share';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import ShareRoomDetails from "./ShareRoomDetails"
const styles = (theme) => ({
  root:{
    backgroundColor:"#fcbad3"
  }
})
class Controls extends Component{
  constructor(props){
    super(props)
    this.state={
      audioMuted:false,
      videoMuted:false
    }
    console.log("In controls")
    console.log(props)
  }

  render(){
    const { classes,roomId } = this.props;
    return (
      <Card elevation={6} className={classes.root}>
        <Grid container justify="space-around">
          <Grid item xs={3} container justify="center">
            <Tooltip title="Turn on/off mic">
              <IconButton color="primary" aria-label="Voice" component="span" onClick={()=>{
                this.setState({...this.state,audioMuted:!this.state.audioMuted})
                this.state.audioMuted?this.props.localStream.unmute('audio'):this.props.localStream.mute('audio')
              }}>
                {!this.state.audioMuted?<MicIcon />:<MicOffIcon/>}
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={3} container justify="center">
          <Tooltip title="Turn on/off video">
              <IconButton color="primary" aria-label="Video" component="span" onClick={()=>{
                this.setState({...this.state,videoMuted:!this.state.videoMuted})
                this.state.videoMuted?this.props.localStream.unmute('video'):this.props.localStream.mute('video')
              }}>
                  {!this.state.videoMuted?<VideocamIcon />:<VideocamOffIcon/>}
              </IconButton>
          </Tooltip>
          </Grid>
          <Grid item xs={3} container justify="center">
          <Tooltip title="Leave">
                <IconButton color="primary" aria-label="Leave Call" component="span" onClick={this.props.disconnect}>
                  <CallEndIcon />
                </IconButton>
          </Tooltip>
          </Grid>
          <Grid item xs={3} container justify="center">
          <Tooltip title="Share Room Id">
                
                <ShareRoomDetails roomId={roomId}/>
          </Tooltip >
          </Grid>
        </Grid>
      </Card>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Controls);
