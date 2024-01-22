import { useEffect ,useState } from "react";

let songs = [
  ["Eminem","lose yourself"], //keep
  ["Franz Ferdinand","Take Me Out"],
  ["The Killers","Mr. Brightside"],
  ["David Bowie","Life on Mars"],
  ["Nirvana","Smells Like Teen Spirit"],
  ["Smashing Pumpkins", "1979"],
  ["Smashing Pumpkins", "Today"],
  ["Stone Temple Pilots","Creep"],
  ["Talking Heads","Psycho Killer"],
  ["Talking Heads","Once in a Lifetime"],
  ["Frank Zapppa","Don't Eat the Yellow Snow"],
  ["Frank Zappa", "Joes Garage"],
]// console.log("Songs:", songs.length);

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

function spitLines(str) {
  const linesArray = str.split('\n');
  // const line = linesArray[1] + '\n' + linesArray[2] + '\n'+linesArray[3] + '\n'+linesArray[4];
  // const line2 = linesArray.slice(2, 5);

  return [linesArray[1], linesArray[2], linesArray[3] , linesArray[4], linesArray[5], linesArray[6]];

}


function getRandInt() {
  // get random number between 0 and songs.length

  let randInt = Math.floor(Math.random() * songs.length);
  return randInt;
}

console.log("Random number:", getRandInt());

function LyricsQuizComponent() {
  let index = getRandInt();
  let artist = songs[index][0];
  let title = songs[index][1];

  let artistUrl = encodeURIComponent(artist);
  let titleUrl = encodeURIComponent(title);
  console.log(artistUrl);
  console.log(titleUrl);
 
const [lines, setLines] = useState([]);

useEffect(() => {
  const fetchLyrics = async () => {
    try {
      console.log("Artist:", artist);
      // console.log("Title:", title);
      const response = await fetch(
        "https://api.lyrics.ovh/v1/" + artistUrl + "/" + titleUrl
      );
      console.log("Response:", response);
      const data = await response.json();

      let apiResult = getFirstSentence(data.lyrics);
      let cleanText = removeOffset(apiResult);

      // Update state with lines array
      setLines(spitLines(cleanText));

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
    {lines.map((line, index) => (
      <p key={index}>{line}</p>
    ))}

  </div>
);
}

export default LyricsQuizComponent;