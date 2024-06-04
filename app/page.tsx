"use client"
import axios from "axios";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { emotionConfig } from "./config";
import { ColorRing } from "react-loader-spinner";

export default function Home() {
  const defaultColor = "#cccccc"
  const [rows, setRows] = useState(2);
  const [input, setinput] = useState("");
  const [output, setoutput] = useState<{ label: string; score: number }[]>();
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState(defaultColor);
  const [tagsVisible, setTagsVisible] = useState(false)
  
  useEffect(() => {
  
    const inputTimeout =  setTimeout(() => {
      runPrediction();
    }, 1000);

    return ()=> clearTimeout(inputTimeout);
  
  }, [input]);

  useEffect(() => {
    handelColor();
    setTagsVisible(true);
  }, [output]);
  
  function handelColor() {
    if (output && output.length > 0) {
      const colorKey = (output as any[])[0].label;
      const colorHex = (emotionConfig as any)[colorKey].colorHex;
      setColor(colorHex);
    }
  }
  


  async function runPrediction() {
    if (input) {
      setLoading(true);
      setTagsVisible(false)
      // send api call
      const res = await axios.post('api/emotion', { input: input })
      setoutput(res.data.filteredResponse)
      // console.log('Response data:', res.data);
      setLoading(false);
   }    
  }

  function handeInputChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    setinput(event.target.value);
    //increase the number of rows if required
    const newRows = Math.max(1, Math.ceil(event.target.scrollHeight / 20))
    setRows(newRows);
  }

  return (
    <main style={{backgroundColor: color + "aa"}} className="transition-all delay-500 flex min-h-screen flex-col items-center p-24">
      <h1 className="lga:text-4xl text-2xl font-mono font-semibold tracking-tight">Paint My Mood</h1>
      <div className="w-1/2 min-w-80 border-2 border-black p-4 rounded-lg">
        <textarea
          rows={rows}
          onChange={handeInputChange}
          placeholder="type how you feel . . ."
          className="resize-none outline-none block w-full text-sm placeholder-slate-600 bg-transparent">
        </textarea>
      </div>
      <p>{'> ' + input}</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {output?.map(({label, score}) => {
          return <span style={{opacity: tagsVisible ? 1 : 0}} key={label} className="transition-all cursor-pointer bg-indigo-100 text-indigo-800 text-lg px-4 py-1 rounded-full border border-indigo-400" >{label} { (emotionConfig as any)[label].emoji}</span> 
        })}
      </div>
      {loading && renderLoader()}
    </main>
  );

  function renderLoader() {
    return (<ColorRing
      visible={true}
      height="80"
      width="80"
      ariaLabel="color-ring-loading"
      wrapperStyle={{}}
      wrapperClass="color-ring-wrapper"
      colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
      />)
  }
}

