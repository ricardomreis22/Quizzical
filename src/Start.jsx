import React from "react";

export default function Start(props){
    return (
        <div className="start">
            <h1>Quizzical</h1>
            <p> Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
                Modi voluptates deserunt quo eaque? 
                Voluptatem a facere impedit assumenda doloribus, aperiam quis,
                modi officiis sint totam, minima neque amet enim quidem.
            </p>
            <button onClick={props.startQuiz}>Start quiz</button>
        </div>
    )
}