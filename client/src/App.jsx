import { useState } from 'react'
import './App.css'
 



export default function App(){
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);


  async function handleUpload(){
    if (!file) return;
    setLoading(true);

    try{
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:5000/upload",{
        method: "POST",
        body: formData,
      });

      setResult(await res.json());
    }catch(err){
      console.error(err);

      setResult({error:"Could not reach the server"
      });

    }finally{
      setLoading(false);
    }
    
    
  }

  return (
    <div>
      <h1>PDF Q&A</h1>
      <input
        type = "file"
        accept = "application/pdf"
        onChange = {(e)=>setFile(e.target.files[0])}/>

      <button onClick={handleUpload} disabled = {!file||loading}>
        {loading? "Uploading..." : "Upload"}
      </button>
      {result && <pre>{JSON.stringify(result,null,2)}</pre>}
    </div>
  );
}
