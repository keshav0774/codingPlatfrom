const Problem = require('../models/problem');
const User = require('../models/User')
const bcrypt = require('bcrypt');
const Submission = require('../models/submission')
const {getLanguageById,submitBatched,submitToken} = require('../utlis/problemutility');

const createProblem = async (req, res) => {
  try {
   
    const {
      title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution} = req.body;
    if ( !title || !description ||!difficulty ||!referenceSolution) {
      return res.status(401).send("Missing or invalid required fields");
    }

    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);
     
      if (!languageId || !completeCode) {
        return res.status(402).send("Invalid LanguageID & completeCode solution");
      }
      // ---- VISIBLE TEST CASES ----
      const visibleSubmissions = visibleTestCases.map(tc => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: tc.input,
        expected_output: tc.output
      }));

      const visibleResult = await submitBatched(visibleSubmissions);
      
      const visibleTokens = visibleResult.map(r => r.token);

      const visibleStatus = await submitToken(visibleTokens);
      for (const test of visibleStatus) {
        
        if (test.status_id === 6 || test.status_id === 7) {
          return res
            .status(403)
            .send(`Reference solution error ${language}: ${getStatusDescription(test.status_id)}`);
        }
      }
      
    }
    const prob = await Problem.create({
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution,
      problemCreator: req.result._id // auth middleware se
    });
    const reply = {
      _id : prob._id,
     title : prob.title,
     description : prob.description,
     difficulty : prob.difficulty,
     tags : prob.tags
    }
    res.status(201).json({
      message : "Problem saved successfully", 
      problem : reply

    })

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error: "+err.message);
  }
};

function getStatusDescription(statusId) {
  const statusMap = {
    1: "In Queue",
    2: "Processing",
    3: "Accepted",
    4: "Wrong Answer",
    5: "Time Limit Exceeded",
    6: "Compilation Error",
    7: "Runtime Error",
    8: "Memory Limit Exceeded"
  };
  return statusMap[statusId] || `Unknown status: ${statusId}`;
};

const updateProblem = async (req,res)=>{
  const {id} = req.params;
  
  const {
  title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution} = req.body;
  try {
    if(!id) {
      return res.status(400).send("Missing Id Field")
    }
    if ( !title || !description ||!difficulty) {
      return res.status(400).send("Missing or invalid required fields");
    }
    const DsaProblem = await Problem.findById(id);
    if(!DsaProblem){
      return res.status(400).send("Id is not present in server")
    }

  const newProblem =   await Problem.findByIdAndUpdate(id, {...req.body}, {runValidators:true});
  res.status(200).send(newProblem);
  } catch (err) {
    res.status(400).send(`Error updating problem: ${err.message}`)
  }
};

const deleteProblem = async (req, res)=>{
  const {id} = req.params;
  const { password } = req.body;
  try {
    if(!id || !password) {
    return res.status(400).send("Invalid Credential")
    }
  const user = await User.findById(req.result._id)
  if(!user) {
    return res.status(404).send("User not found")
  }
  const ismatch = await bcrypt.compare(password, user.password)
  if(!ismatch){
    return res.status(401).send("Inavlid Password")
  }

  const result = await Problem.findById(id);
  if(!result){
    return res.status(404).send("Id not found in server");
  }
  const DeletedProblem = await Problem.findByIdAndDelete(id);
  if(!DeletedProblem) {
     return res.status(404).send("Problem is Missing");
  }
  return res.status(200).send("Problem Deleted Successfully")

  } catch (err) {
    res.status(500).send("Error: "+err.message)
  }
};

const getProblemById = async (req,res)=>{
  const {id} = req.params;
 
  if(!id){
    return res.status(400).send("Invalid Problem Id");
  }
  try {
    const result = await Problem.findById(id);
    if(!result) {
      return res.status(400).send("Problem Is Missing")
    }
    res.status(200).json({
    _id : result._id,
    title : result.title, 
    description: result.description, 
    difficulty: result.difficulty, 
    tags : result.tags, 
    visibleTestCases : result.visibleTestCases, 
    startCode : result.startCode, 
    hiddenTestCases: result.hiddenTestCases,
    referenceSolution : result.referenceSolution
})
  } catch (err) {
     res.status(500).send("Error: "+err.message)
  }
};

const getAllProblem = async (req,res)=>{
  try {
  
    const problems = await Problem.find({}).select('_id title difficulty tags ');
   
  if(!problems){
    return res.status(404).send("Problems are not found");
  }
  res.status(200).send(problems);
  } catch (err) {
    res.status(500).send("Error: "+err.message)
  }
};

const solvedAllProblembyUser = async (req,res)=>{
   
  try {
    
    const user = req.result;
    
    const result = await User.findById(user._id).populate({
      path: "problemSolved",
      select: "_id tags title difficulty"
    });
    
   return res.status(201).send(result.problemSolved)

  } catch (err) {
    res.status(500).send("Server Error: "+ err.message)
  }
}

const submittedProblem = async(req,res)=>{

  try {
      const UserId = req.result._id;
      const ProblemId = req.params.pid;
 
     const ans = await Submission.find({UserId, ProblemId});
     if(ans.length ===0 ) return res.status(200).send([]);
     res.status(200).send(ans);
  } catch (error) {
    res.status(500).send("Internal Server Error"+ error.message);
  }
}



module.exports = {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem};
