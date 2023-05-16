import { useReactMediaRecorder } from "react-media-recorder";
import MicIcon from '@mui/icons-material/Mic';
import IconButton from '@mui/material/IconButton';
import MicOffIcon from '@mui/icons-material/MicOff';
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";


export default function RecordView(props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState()
  const [sentence, setSentence] = useState()

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true, blobPropertyBag: { type: "audio/mpeg"} });
  

    const getText = async () => {
      setLoading(true)
      let file = await fetch(mediaBlobUrl).then(r => r.blob());

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(process.env.REACT_APP_API_URL + '/totext', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        confirmText(data.text);
        setSentence(data.text)
      } catch(e) {
        console.error(e);
        setLoading(false)
      }
    }

    const confirmText = async (sentence) => {
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: ` أكمل لي النص التالي والذي يحاول المستخدم من خلاله التأكد من أن جمله متطابقة مع الحاسوب
            Computer: I study English every day to improve my language skills
            User: I study English every day to improve my language skills
            Assistent: جملة متطابقة تمامًا، أحسنت
            Computer: The sun rises in the east and sets in the west
            User: The sun rise in the east and set in the west
            Assistent: هنالك خطأ في الجملة حيث أنك لم تلفظ الحرف s في كلمة rises و كلمة sets
            Computer: Water boils at 100 degrees Celsius
            User: vater bols at 100 degrees Clsius
            Assistent: لديك خطأ في لفظ Water و boils و Celsius
            Computer: ${props.aiSentence}
            User: ${sentence}
            Assistent:`
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }
      try {
        const response = await fetch(process.env.REACT_APP_API_URL + '/completions', options)
        const data = await response.json()
        setMessage(data.result)
        setLoading(false)
      } catch(e) {
        console.error(e);
        setLoading(false)
      }
    }

  

  return (
    <div>
      <Box
      component='div' sx={{ mt: 10}}>
        {status === 'recording' ? 
          <IconButton onClick={stopRecording}>
            <MicOffIcon />
          </IconButton>
          :  
          <IconButton onClick={startRecording}>
            <MicIcon />
          </IconButton>  
        }
      </Box>

        {mediaBlobUrl 
        ? 
        <Box
        component='div' sx={{ mt: '15'}}>
        <audio src={mediaBlobUrl} controls autoPlay /> 
        <Box
        component='div' sx={{ mt: '15'}}>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={getText}>
          {loading ? <CircularProgress size="1rem" /> : "تأكد من الجملة"}
        </Button>
        </Box>
        {message 
        ?
        <Box component='div' sx={{ mt: 5}}>
          <Typography component='p'>{message}</Typography>
          <Typography component='p'>الجملة التي ذكرتها هي:</Typography>
          <Typography component='p'>{sentence}</Typography>
        </Box> : ''}

        </Box>
        : 
        ''}

    </div>
  );
};
