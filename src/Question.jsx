import React, { useState, useEffect } from 'react'
import {decode} from 'html-entities';


export default function Question (props) {

    let data = props.quizzicalData.map((item, index) => {
        // we get the incorrect answers array and insert the correct answer into that array using splice
        console.log("item",item.incorrect_answers)
        let answers = item.incorrect_answers
        answers.splice(1, 0, item.correct_answer).sort()
        // than we sort the array randomly
        // return the newData array of objects, with an objet for each question we have
        return {
            id:index,
            key:index,
            question: decode(item.question),
            answers: answers
        }     
    })  
    
    console.log("data", data)

    // newData state used to get the questions and answers we gonna rend
    const [newData, setNewData] = useState([])
    
    
    // everytime the data changes we use this effect to setNewData with the new values from data
    useEffect(() => {
        setNewData(() => {
            // for every item in data array that has the 5 objects with key:values
            return data.map((item, index) => {
                // we get the incorrect answers array and insert the correct answer into that array using splice
                let answers = item.incorrect_answers
                answers.splice(1, 0, item.correct_answer).sort()
                // than we sort the array randomly
                // return the newData array of objects, with an objet for each question we have
                return {
                    id:index,
                    key:index,
                    question: decode(item.question),
                    answers: answers
                }        
            })
        })
    }, [data])


    // create a function to select on of the answer
    function select (event) {
        let selectAnswer = []
        selectAnswer.push(event.target.value)
        console.log(selectAnswer)
    }

    function checkAnswers () {
        // get the correct answer from every question
        data.map( (item) => {
            console.log(item.correct_answer) 
        })
    }

    

    return (
        <div>
            <h3 className="question"></h3>
             <div>
                {/* {map through every question we get from the API} */}
                {newData.map((questionObj) => (
                    <div 
                    key={questionObj.id}
                    id={questionObj.id}
                    >
                        <p>{questionObj.question}</p>   
                        <form>
                            {/* map through every possible answer */}
                            {questionObj.answers.map((answer) => (
                                <div>
                                    <input 
                                        key={answer}
                                        type="radio"
                                        id={answer}
                                        name="selectedAnswer"
                                        value={answer}
                                        onClick={select}
                                    />
                                    <label htmlFor={answer}>{answer}</label>
                                    <br />
                                </div>
                            ))}

                        </form>

                    </div>
                ))}
            </div>
            <br></br>            
            <div className="div">
                
            </div>
            <button onClick={checkAnswers}>Check Answers</button>                    
            <button onClick={props.startPage}>Play again</button>
        </div>
    )

}