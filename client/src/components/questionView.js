import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";


export default function QuestionView(props) {
    const [ answers, setAnswers ] = useState([])
    const [ question, setQuestion ] = useState()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState()

    const checkAnswer = async (userAnswer) => {
        setLoading(true)
        const options = {
            method: "POST",
            body: JSON.stringify({
            message : [
                {
                    role: "assistant",
                    content: props.message
                },
                {
                    role: "user",
                    content: "هل الأجابة " + userAnswer + " صحيحة لهذا السؤال " + props.message
                }
            ]
            }),
            headers: {
              "Content-Type": "application/json"
            }
          }

          try {
            const response = await fetch(process.env.REACT_APP_API_URL + '/chat/completions', options)
            const data = await response.json()
            console.log(data);
            setMessage(data.message.content)
            setLoading(false)
          } catch(e) {
            console.error(e);
            setLoading(false)
          }
    }

useEffect(() => {
    if(props.message) {
        const regex = /([A-Ea-e]\)|[A-Ea-e]\.)(.*)/g;
        const answerArray = props.message.match(regex)
        const firstLine = props.message.split("\n")[0];
        setAnswers(answerArray)
        setQuestion(firstLine)
    }
},[props.message])

    return(
        <>

        <Box component="main"
        >
            <Typography component='h3'>{question}</Typography>
            {answers.map((answer, index) => {
                return(<Button variant="contained" size="medium" sx={{ ml: 2, mt: 2 }} key={index} onClick={() => checkAnswer(answer)}>{answer}</Button>)
            })}
        </Box>


        {loading ? <CircularProgress sx={{mt: 3, mb: 3, mx: 'auto'}} /> : message &&
        <Box component="main" sx={{mt: 3}}>
            <Typography component='span'>{message}</Typography>
        </Box>

        }
        </>
    )
}