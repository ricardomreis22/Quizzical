import React, { useState, useEffect } from "react";
import Question from "./Question";
import Start from "./Start";
import { decode } from "html-entities";

export default function App() {
  const [questionsComponent, setQuestionsComponent] = useState(false);
  const [quizzicalData, setQuizzicalData] = useState([]);
  const [button, setButton] = useState(false);
  const [count, setCount] = useState(0);

  // Helper function to shuffle an array
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  // Helper function to decode the answers array
  function decodeArr(array) {
    array.map((item) => {
      item = decode(item, { level: "all" });
    });
  }

  useEffect(() => {
    const fetchData = () => {
      fetch("https://opentdb.com/api.php?amount=5")
        .then((res) => res.json())
        .then((data) => {
          const dataArr = data.results?.map((questionObj) => {
            return {
              ...questionObj,
              question: decode(questionObj.question, { level: "all" }),
              answers: decode(
                shuffle([
                  ...questionObj.incorrect_answers,
                  questionObj.correct_answer,
                ])
              ),
              selectedAnswer: "",
              isCorrect: "",
            };
          });
          setQuizzicalData(dataArr);
        });
    };
    if (quizzicalData.length === 0) {
      fetchData();
    }
  }, [questionsComponent]);

  // Toggle between starting page and questions page
  function changePage() {
    setQuestionsComponent((prev) => !prev);
    setButton(false);
  }

  // When select an answer that answer goes to selectedAnswers property on that answer Question Object
  function select(event, answer, questionObjet) {
    setQuizzicalData((prevQuizzical) => {
      return prevQuizzical.map((questionObj) => {
        if (questionObj.question === questionObjet.question) {
          return { ...questionObj, selectedAnswer: `${answer}` };
        } else {
          return { ...questionObj };
        }
      });
    });
  }

  function checkAnswers() {
    setButton(true);
    setQuizzicalData((prev) => {
      setCount(0);
      return prev.map((questionObj) => {
        if (questionObj.selectedAnswer) {
          if (questionObj.correct_answer === questionObj.selectedAnswer) {
            setCount((prev) => prev + 1);
            return { ...questionObj, isCorrect: "correct" };
          } else {
            return { ...questionObj, isCorrect: "incorrect" };
          }
        } else {
          return { ...questionObj };
        }
      });
    });
  }

  return (
    <div>
      {/* toggle between starting page and question page */}
      {!questionsComponent && <Start startQuiz={changePage} />}
      {questionsComponent && (
        <Question
          startPage={changePage}
          quizzicalData={quizzicalData}
          select={select}
          checkAnswers={checkAnswers}
          button={button}
          count={count}
        />
      )}
    </div>
  );
}
