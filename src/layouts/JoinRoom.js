import React,{Component} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import qs from "qs"
import { withStyles } from "@material-ui/core/styles";
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
})
class JoinRoom extends Component {
    constructor(props){
        super(props)
        console.log(props.location)
        this.state={
          username:"",
          roomid:""||qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).id
        }
      }
  
    render(){
        const { classes } = this.props;
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Join Room
        </Typography>
        <form className={classes.form} noValidate  onSubmit={async (event)=>{
          event.preventDefault();
          let {username,roomid,role="guest"}= this.state
          await this.props.createClient(username,roomid,role)
          this.props.history.push(`/room`)
        }}>
          <Grid container spacing={2}>
          <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="roomid"
                label="Room Id"
                id="roomid"
                value={this.state.roomid}
                disabled={qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).id}
                onChange={(e)=>{
                    this.setState({...this.state,"roomid":e.target.value})
                  }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="username"
                label="Username"
                id="username"
                value={this.state.username}
                onChange={(e)=>{
                    this.setState({...this.state,"username":e.target.value})
                  }}
              />
            </Grid>
           
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Join Room
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/#/createRoom" variant="body2">
                Create a Room
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );}
}
export default withStyles(styles, { withTheme: true })(JoinRoom);