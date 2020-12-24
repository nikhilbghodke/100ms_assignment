import React, {Component} from "react"
import Grid from '@material-ui/core/Grid';

export default class VideoView extends Component{
    constructor(props){
        super(props)
    }
    componentDidMount = () => {
        const { stream } = this.props;
        this.video.srcObject = stream;
      };
    
    componentWillUnmount = () => {
        this.video.srcObject = null;
    };

    render(){
        return (<Grid item xs={4}>
        <video
          ref={ref => {
            this.video = ref;
          }}
          id={12}
          autoPlay
          playsInline
          muted={this.props.isLocal}
          width="100%"
          height="100%"
        />
        </Grid>)
    }

}