import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function TranslateComponent(props) {

    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('')
    const [message, setMessage] = useState()

    const checkAnswer = async () => {
        setLoading(true)
        const options = {
            method: "POST",
            body: JSON.stringify({
            message : [
                {
                    role: "user",
                    content: `أنا أعمل على ترجمة الجملة التالية \n ${props.message} \n وكانت ترجمتي لها هي هذه الجملة \n ${value} \n فهل ترجمتي صحيحة للجملة، تأكد لي من الترجمة الصحيحة وأعطني خطأي في حال كان لدي خطأ`
                }
            ]
            }),
            headers: {
              "Content-Type": "application/json"
            }
          }

          try {
            const response = await fetch( process.env.REACT_APP_API_URL +'/chat/completions', options)
            const data = await response.json()
            console.log(data);
            setMessage(data.message.content)
            setLoading(false)
          } catch(e) {
            console.error(e);
            setLoading(false)
          }
    }

    console.log(value);

    return(
        <>
        {props.message && 
            <Box component='main' sx={{mt: 2}}>
                <Box component='div'>
                    <TextField value={value} onChange={e => setValue(e.target.value)} placeholder="الترجمة" />
                    <Button variant="contained" onClick={checkAnswer} sx={{ display: 'block', mt: 2, mx: 'auto'}}>تأكد من الترجمة</Button>
                </Box>
                {loading ? <CircularProgress /> : message &&
                    <Box component='div' sx={{mt:2}}>
                        <Typography component='span'>
                            {message}
                        </Typography>
                    </Box>
                }

            </Box>    
            
        }

        </>
    )
}