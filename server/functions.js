export function chunkText(text, chunkSize = 400, overlap = 60){
    const words =  text.replace(/\s+/g," ").trim().split(" ");
    const chunks =  [];
    const step =  chunkSize - overlap;

    for(let start = 0; start < words.length;start+=step){
        chunks.push(words.slice(start, start+chunkSize).join(" "));
        if (start + chunkSize >= words.length) break;
    }
    return chunks
}


export function looksLikeRealText(text){
    const sample = text.slice(0,5000);
    if (sample.length===0) return false;
    const readable = sample.match(/[a-zA-Z0-9\s.,;:'"!?()-]/g)?.length ?? 0;
    return readable/sample.length > 0.85;
}