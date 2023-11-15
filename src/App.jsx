import React, { useState, useEffect } from 'react'

import Start from './Start'
import Question from './Question'

export default function App() {

    const [questionsComponent, setQuestionsComponent] = useState(false)
    const [quizzicalData, setQuizzicalData ] = useState([])

    console.log(quizzicalData)
    console.log(questionsComponent)
    useEffect(() =>{
        fetch("https://opentdb.com/api.php?amount=5")
        .then(res => res.json())
        .then(data => setQuizzicalData(data.results))
        console.log("render")
    }, [])

    // Toggle between starting page and questions page
    function changePage() {
        console.log("1")
        setQuestionsComponent(prev => !prev)    
    }

    return (
        <div>
            {/* toggle between starting page and question page */}
            { !questionsComponent && < Start startQuiz={changePage}/>}
            { questionsComponent && < Question startPage={changePage} quizzicalData={quizzicalData}/>}
            {/* <pre>{JSON.stringify(quizicalData, null, 2)}</pre> */}
        </div>
    )

} 