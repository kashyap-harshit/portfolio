"use client";
import React, { useEffect, useState } from "react";

interface factJson {
  id: number;
  text: string;
}
function RandomFact() {
  const [fact, setFact] = useState("");
  useEffect(() => {
    const getFact = async () => {
      const res = await fetch("https://uselessfacts.jsph.pl/random.json");
      const resJson: factJson = await res.json();
      const theText = resJson.text.replaceAll(".", ",");
      setFact(theText);
    };
    getFact();
  }, []);
  return (
    <span>did you know {fact.toLowerCase().slice(0, fact.length - 1)}?</span>
  );
}

export default RandomFact;
