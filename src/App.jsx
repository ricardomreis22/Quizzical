import React, { useState, useEffect, useRef } from "react";
import Question from "../src/Question";
import Start from "../src/Start";
import { decode } from "html-entities";

export default function App() {
  const [questionsComponent, setQuestionsComponent] = useState(false);
  const [fetchData, setFetchData] = useState(false);
  const [quizzicalData, setQuizzicalData] = useState([]);
  const [button, setButton] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

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
    return array.map((item) => {
      return (item = decode(item, { level: "all" }));
    });
  }
  const didMount = useRef(false);

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      fetch("https://opentdb.com/api.php?amount=5")
        .then((res) => res.json())
        .then((data) => {
          const dataArr = data.results?.map((questionObj) => {
            const decodeQuestion = decode(questionObj.question, {
              level: "all",
            });

            const decodedAnswers = decodeArr(
              shuffle([
                ...questionObj.incorrect_answers,
                questionObj.correct_answer,
              ])
            );

            return {
              ...questionObj,
              question: decodeQuestion,
              answers: decodedAnswers,
              selectedAnswer: "",
              isCorrect: "",
            };
          });

          setLoading(false);
          setQuizzicalData(dataArr);
        });
    };
    // fetch only runs on change of fetchData, not on mount the component and only after 3 secs
    setTimeout(fetchData, 3000);
  }, [fetchData]);

  // Toggle between starting page and questions page
  function start() {
    setQuestionsComponent((prev) => !prev);
    setButton(false);
  }

  function menu() {
    setLoading(true);
    setFetchData((prev) => !prev);
    setQuestionsComponent((prev) => !prev);
    setButton(false);
  }

  // eu quero que o setTimeout seja feito logo apos o menu iniciar e nao quando entrar no play game

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
      {!questionsComponent && <Start startQuiz={start} />}
      {questionsComponent && (
        <Question
          loading={loading}
          startPage={menu}
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
