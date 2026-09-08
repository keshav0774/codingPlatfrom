const Submission = require('../models/submission');
const Problem = require('../models/problem');
const {getLanguageById,submitBatched,submitToken} = require('../utlis/problemutility')


const submitCode = async (req,res)=>{
    try {
       const UserId = req.result._id;
       const ProblemId = req.params.id

       const {code, language} = req.body;

       if(!UserId || !ProblemId || !code || !language)
        return res.status(400).send("Field Is Missing")

    // fetch the problem from Db
    const problem = await Problem.findById(ProblemId);
    if(!problem) 
        return res.status(400).send("Problem Not Found")
    
    const submittedResult = await Submission.create({
        UserId,
        ProblemId,
        code,
        language,
        status:"pending",
        testCasesTotal:problem.hiddenTestCases.length
    })

    // Judge0 ko code submit karna hai 
    
    const languageId = getLanguageById(language);

    const visibleSubmissions = problem.hiddenTestCases.map(tc => ({
        source_code: code,
        language_id: languageId,
        stdin: tc.input,
        expected_output: tc.output
    }));
    const visibleResult = await submitBatched(visibleSubmissions);

    const visibleTokens = visibleResult.map(r => r.token);

    const visibleStatus = await submitToken(visibleTokens);
   
    let testCasesPassed = 0;
    let runtime = 0;
    let status = "accepted"
    let errorMessage = null;
    let memory = 0;
    // Update the submitResult 
    for (const test of visibleStatus){
        if(test.status_id == 3)
        {
            testCasesPassed++;
            runtime = runtime+ parseFloat(test.time);
            memory = Math.max(memory, test.memory)
        }else{
          if(test.status_id == 4){
            status = 'error'
            errorMessage = test.stderr;
          }
          else{
            status = 'wrong';
            errorMessage = test.stderr;
          }
        }
    }
        // store Result in DB
        submittedResult.status = status;
        submittedResult.testCasesPassed = testCasesPassed;
        submittedResult.runtime = runtime;
        submittedResult.errorMessage = errorMessage
        submittedResult.memory = memory;

       const result =  await submittedResult.save();
       
       //inserr the problem id in user schema problemSolved if it is already present and 
       // it other wise insert the problem 
       // req.result === User Information 

     if(!req.result.problemSolved.includes(ProblemId)){
        req.result.problemSolved.push(ProblemId);
        await req.result.save();
     }
     const accepted  = (status == 'accepted')
     res.status(201).json({
     accepted, 
     totalTestCases : submittedResult.totalTestCases,
     passedTestCases : submittedResult.testCasesPassed,
     runtime,
     memory
     })

    } catch (err) {
        return res.status(500).send("Error Occured: "+ err.message);
    }
}

const runCode = async (req,res)=>{
    

    try {
    const UserId = req.result._id;
    const ProblemId = req.params.id

    const {code, language} = req.body;

    if(!UserId || !ProblemId || !code || !language)
        return res.status(400).send("Field Is Missing")

    // fetch the problem from Db
    const problem = await Problem.findById(ProblemId);
    if(!problem) 
        return res.status(400).send("Problem Not Found")

    // Judge0 ko code submit karna hai 
    
    const languageId = getLanguageById(language);

    const visibleSubmissions = problem.visibleTestCases.map(tc => ({
        source_code: code,
        language_id: languageId,
        stdin: tc.input,
        expected_output: tc.output
    }));
    const visibleResult = await submitBatched(visibleSubmissions);

    const visibleTokens = visibleResult.map(r => r.token);

    const visibleStatus = await submitToken(visibleTokens);
 
    let testCasesPassed = 0;
    let totalRuntime = 0;
    let maxMemory = 0;
        
    const results = visibleStatus.map((test, index) => {
    const passed = test.status_id === 3;
            if (passed) {
                testCasesPassed++;
                totalRuntime += parseFloat(test.time || 0);
                maxMemory = Math.max(maxMemory, test.memory || 0);
            }
            
            return {
                testCase: index + 1,
                passed,
                input: problem.visibleTestCases[index].input,
                expectedOutput: problem.visibleTestCases[index].output,
                actualOutput: test.stdout || "",
                error: test.stderr || null,
                runtime: test.time,
                memory: test.memory,
                status: test.status_description || (passed ? "Accepted" : "Wrong Answer")
            };
        });
        res.status(200).json({
            success: true,
            results,
            summary: {
                totalTests: visibleStatus.length,
                passedTests: testCasesPassed,
                allPassed: testCasesPassed === visibleStatus.length,
                totalRuntime: totalRuntime.toFixed(3),
                maxMemory
            }
        });

    } catch (err) {
        return res.status(500).send("Error Occured: "+ err.message);
    }
}



module.exports = {submitCode,runCode}