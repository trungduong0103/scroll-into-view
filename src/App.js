import React from "react";
import "./styles.css";

function Box({ index, updateVisibleItems }) {
  console.log("rendering", { index });
  const boxRef = React.useRef();
  const [isIntersecting, setIsIntersecting] = React.useState(undefined);

  React.useEffect(() => {
    const elm = boxRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        updateVisibleItems(index, entry.isIntersecting);
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );
    elm && observer.observe(elm);

    return () => {
      observer.unobserve(elm);
    };
  }, []);

  return (
    <div id={`box-id-${index}`} ref={boxRef} className="box">
      <span>This is box #{index}</span>
      <span>Is visible: {JSON.stringify(isIntersecting)}</span>
    </div>
  );
}

export default function App() {
  const [chosenCard, setChosenCard] = React.useState(0);
  const visibleItems = React.useRef([]);

  function scrollToCard() {
    const cardElm = document.getElementById(`box-id-${chosenCard}`);
    scroll(cardElm);
  }

  function updateVisibleItems(index, isVisible) {
    if (isVisible) {
      visibleItems.current = [...visibleItems.current, index];
    } else {
      visibleItems.current = visibleItems.current.filter((id) => id !== index);
    }
  }

  function scroll(item) {
    if (item) item.scrollIntoView({ behavior: "smooth" });
  }

  function onNext() {
    const last = visibleItems.current.sort()[visibleItems.current.length - 1];
    const cardElm = document.getElementById(`box-id-${last + 1}`);
    scroll(cardElm);
  }

  function onPrevious() {
    const first = visibleItems.current.sort()[0];
    const cardElm = document.getElementById(`box-id-${first - 1}`);
    scroll(cardElm);
  }

  return (
    <div>
      <div className="App">
        {[...Array(10)].map((_, index) => (
          <Box
            key={index}
            index={index}
            visibleItems={visibleItems}
            updateVisibleItems={updateVisibleItems}
          />
        ))}
      </div>
      <div style={{ display: "block", position: "fixed" }}>
        <input
          value={chosenCard}
          onChange={(e) => setChosenCard(e.target.value)}
        />
        <button onClick={scrollToCard}>Scroll into view</button>

        <button onClick={onNext}>Next</button>
        <button onClick={onPrevious}>Previous</button>
      </div>
    </div>
  );
}
