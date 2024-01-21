import { useEffect ,useState } from "react";




function getFirstSentence(inputString) {
  // Use a regular expression to match the first sentence
  var match = inputString.match(/[^.!?]*[.!?]/);
  
  // Check if there is a match
  if (match) {
    // Return the matched first sentence
    return match[0].trim();
  } else {
    // If no match is found, return the original string
    return inputString;
  }
}

function removeOffset(str) {
  let subsetToRemove = "Paroles de la chanson ";
  let cleanResponseFirst = str.replace(subsetToRemove, "").trim();
  let cleanResponse =cleanResponseFirst.replace("par", "").trim();
  return cleanResponse;
}





function LyricsQuizComponent() {

    let artist = "Eminem";
    let title = "Lose Yourself";
  const [lyrics, setLyrics] = useState("");
useEffect(() => {
  const fetchLyrics = async () => {
    try {
      const response = await fetch("https://api.lyrics.ovh/v1/" + artist + "/" + title);
      const data = await response.json();
      setLyrics(data.lyrics);
      console.log("Lyrics:", data);
      let apiResult = getFirstSentence(data.lyrics);
      let cleanText = removeOffset(apiResult);
      setLyrics(cleanText);
      console.log("Lyrics:", cleanText);
    } catch (error) {
      console.error("Error fetching lyrics:", error);
    }
  };

  fetchLyrics();
}, []);

    return (
      <div>
        <h3>Lyrics:</h3>
        <p>{lyrics}</p>
      </div>
    );

}
export default LyricsQuizComponent;