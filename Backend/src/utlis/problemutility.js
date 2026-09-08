const axios = require('axios');


const getLanguageById = (lang) => {
  const languageMap = {
    'c++': 54,
    'cpp':54,
    'javascript': 63,   // Node.js
    'python': 71,
    'java': 62
  };

  if (!lang) throw new Error("Language missing");

  const id = languageMap[lang.trim().toLowerCase()];
  if (!id) {
    throw new Error(`Unsupported language: ${lang}`);
  }
  return id;
};

module.exports = { getLanguageById };


const submitBatched = async (submissions)=>{
    
    
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        headers: {
    'x-rapidapi-key': '9c409799admsh5bf823b5711fb10p14997ajsnea188bc1c073',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
    },
    data: {
        submissions
    }
 };

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

return await fetchData();
}

const waiting = (timer) =>
  new Promise(resolve => setTimeout(resolve, timer));''

const submitToken = async(resultToken)=>{
   

const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resultToken.join(","),
    base64_encoded: 'true',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': '9c409799admsh5bf823b5711fb10p14997ajsnea188bc1c073',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}
 while(true){
const result =  await fetchData();
   if(!result || !result.submissions) {   // <-- safe check
            console.error("Invalid result from Judge0:", result);
      }
      const IsResultObtained = result.submissions.every((r)=>r.status_id > 2)
        if(IsResultObtained) return result.submissions;
        await waiting(1000);
 }
}

module.exports = {getLanguageById,submitBatched,submitToken};





