import * as React from 'react';
import Box from '@mui/material/Box';
import {useState} from 'react';
import Typography from '@mui/material/Typography';
import ToolBar from '../components/ToolBar'
import SideBar from '../components/SideBar';
import TextField from '@mui/material/TextField';
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import RecordView from '../components/ReacordView';
import { CardContent, Card, Grid } from '@mui/material';
import QuestionView from '../components/questionView';



export default function MainComponent(props) {

  const [value, setValue] = useState()
  const [message, setMessage] = useState(null)
  const [previousMessage, setPreviousMessage] = useState([])
  const [messages, setMessages] = useState()
  const [openMobile, setOpenMobile] = useState()
  const [loading, setLoading] = useState(false)
  const [recordView, setRecordView] = useState(false)
  const [buttonText, setButtonText] = useState()
  const [questionView, setQuestionView] = useState(false)

  const drawerWidth = 240;


  const pull_open_mobile = (data) => {
    setOpenMobile(data)
  }


  

  const sendData = (sectionName, sectionType ) => {
    
    if(sectionType === "شرح الدرس") {
      getData(`أشرح لي كطالب يتعلم اللغة الإنجليزية في المستوى A2 ماهو ${sectionName}`)
      setRecordView(false)
      setQuestionView(false)
      setButtonText('أشرح لي المزيد')
    } else if(sectionType === "أسئلة") {
      getData(`Please give me one multiple-choice question without an answer so that I can work on solving it. Also, consider me an English language student learning the ${sectionName} section. Please put each answer on a separate line`)
      setRecordView(false)
      setQuestionView(true)
      setButtonText('أعطني سؤال جديد')
    } else if(sectionType === 'محادثة') {
      getData(`أعطني جملة باللغة الإنجليزية بسيطة تحتوي على ${sectionName}`)
      setRecordView(true)
      setQuestionView(false)
      setButtonText('أعطني نص جديد')
    } else if(sectionType === 'ترجمة') {
      getData(`اعطني تمرين ترجمة لأعمل في ترجمته يحتوي على ${sectionName}`)
      setRecordView(false)
      setQuestionView(false)
    }


    console.log({"text": sectionName, "data": sectionType });
  }


  const getData = async (prompt) => {
    setLoading(true)
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: [
            {
              role: "user",
              content: prompt
            }
          ]
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/completions', options)
      const data = await response.json()
      console.log(data);
      setMessage(data.message.content);
      console.log((data.message));
      setPreviousMessage([
        {
          role: "user",
          content: prompt
        },
        {
          role: data.message.role,
          content: data.message.content
        }
      ])
      setLoading(false)
    } catch(error) {
      console.error(error)
      setLoading(false)
    }
  }


  const getMoreData = async () => {
    setLoading(true)
    console.log(messages);
    console.log(previousMessage);
    console.log(buttonText);
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: [
          ...previousMessage,
            {
              role: "user",
              content: buttonText
            }
          ]
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/completions', options)
      const data = await response.json()
      console.log(data);
      setMessage(data.message.content)
      setPreviousMessage([
        ...previousMessage,
        {
          role: "user",
          content: buttonText
        },
        {
          role: data.message.role,
          content: data.message.content
        }
      ])
      setLoading(false)
    } catch(error) {
      console.error(error);
      setLoading(false)
    }
  }

  
  const getAnswer = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: messages
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/completions', options)
      const data = await response.json()
      console.log(data);
      setMessage(data.message.content)
      setPreviousMessage([
        ...previousMessage,
        {
          role: "user",
          content: value
        },
        {
          role: data.message.role,
          content: data.message.content
        }
      ])
    } catch(error) {
      console.error(error)
    }
  }


    return(
        <Grid
          container
          spacing={0}
          direction="column"
        >
            <Box sx={{ display: 'flex' }}>
                <ToolBar openMobile={pull_open_mobile} />
                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                    aria-label="mailbox folders"
                >
                    <SideBar sendData={sendData} mobileOpenFunc={openMobile} />
                </Box>
                {loading ?  
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, justifyContent: 'center', alignItems: 'center', }}
                >     
                  <CircularProgress sx={{mt: 50, transform: 'translateY(-50%)'}} />
                  <Typography>يرجى انتظار الإجابة</Typography>
                </Box>
                :
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
                >{message &&
                  <Card sx={{ maxWidth: '750px', mx: 'auto', backgroundColor: 'white', mt: 10}}>
                    <CardContent>
                    {questionView ? 
                      <QuestionView message={message} />
                    :
                      <Typography sx={{ mt: 6, fontSize: '24px', textAlign: 'left'}} variant="p" component="span">
                        {message.split(/\n/).map((line, index) => <div key={index}>{line}</div>)}
                      </Typography>
                    }
                  <Button variant="outlined" sx={{ mt: 2 }} onClick={() => {
                    getMoreData()
                  }}>{buttonText}</Button>
                  {recordView ? <RecordView aiSentence={message} /> : ""}
                    </CardContent>
                  </Card> 
                }

                    <Paper sx={{mx: 'auto', position: 'fixed', width: { sm: `calc(100% - ${drawerWidth}px)` }, bottom: 0}} component="footer" square>
                      <Container maxWidth="lg">

                        <Box
                          sx={{
                            flexGrow: 1,
                            justifyContent: "center",
                            display: "flex",
                            mb: 2,
                          }}
                        >
                          <form className='message-send'>
                            <TextField fullWidth label="أسألني" id="fullWidth" value={value} 
                            onChange={e => {setValue(e.target.value);     
                              setMessages([
                                ...previousMessage,
                                {
                                  role: "user",
                                  content: value
                                }
                              ])}} sx={{width: '80%'}} />
                            <IconButton aria-label="delete" sx={{ position: "absolute", right: '11%', transform: 'rotate(180deg)', mt: 1 }} onClick={() => {setValue(''); getAnswer();}}>
                              <SendIcon />
                            </IconButton>
                          </form>
                             
                        </Box>
                      </Container>
                    </Paper>
                  
                </Box>
                }

            </Box>
        </Grid>
    )
} 