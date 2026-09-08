const express = require('express');
const problemRouter = express.Router();
const {adminMiddleware,userMiddleware} = require('../middleware/midleware')
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem} = require('../controllers/userProblem')



problemRouter.post('/create',adminMiddleware, createProblem);
problemRouter.put('/update/:id', adminMiddleware,updateProblem);
problemRouter.delete('/delete/:id', adminMiddleware,deleteProblem);

problemRouter.get('/problemById/:id',userMiddleware, getProblemById)
problemRouter.get('/getAllProblem',getAllProblem);
problemRouter.get('/problemSolvedByUser',userMiddleware, solvedAllProblembyUser)
problemRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem)
// problemCreate ,  problemUpdate,  problemDelete, problemFetch,getAllProblem,solvedProblem

module.exports = problemRouter;


// update