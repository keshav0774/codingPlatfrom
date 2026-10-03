import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/login";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Signup from "./pages/signup";
import ForgetPassword from './pages/forgetPassword'
import DeleteProblem from "./pages/deletePage";
import Admin from "./pages/adminPanel";
import { checkAuthAPI } from "./pages/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import ProblemPage from "./pages/problemPage";
import CreateProblem from "./pages/createProblem";
import UpdateProblemList from "./pages/UpdateProblemList";
import UpdateProblem from './pages/UpdateProblem';
function App(){
 
  // check the user Is authenticated or not 
   const dispatch = useDispatch();

  const { isAuthenticated, loading, user } = useSelector((state)=>state.auth)

   useEffect(()=>{
    dispatch(checkAuthAPI())
  },[dispatch]); 

 
  if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
               <p className="text-gray-600">Loading...</p>
            </div>
         </div>
      );
   }
  return (
    <>
     <Routes>
         <Route path="/" element={<Home></Home>}></Route>
         <Route path='/login' element={isAuthenticated? <Navigate to='/'/>:<Login></Login>}></Route>
         <Route path='/signup' element={isAuthenticated?<Navigate to='/'/>:<Signup></Signup>}></Route>
         <Route path='/profile' element={isAuthenticated?<Profile></Profile>:<Navigate to='/'></Navigate>}></Route>
         <Route path='/problem/:problemId' element={isAuthenticated?<ProblemPage></ProblemPage>:<Navigate to='/'/>}></Route>


         {/* Admin Route */}
         <Route path='/admin' element={isAuthenticated && user?.role === 'Admin' ? <Admin></Admin>:<Navigate to='/'></Navigate>}></Route>
         <Route path='/admin/add-problem' element={isAuthenticated && user?.role === 'Admin'? <CreateProblem></CreateProblem>:<Navigate to='/'></Navigate>}></Route>
         <Route path="/admin/update-problem" element={isAuthenticated && user?.role === 'Admin' ? <UpdateProblemList></UpdateProblemList>:<Navigate to='/'></Navigate>} />
         <Route path="/admin/update-problem/:problemId" element={isAuthenticated && user?.role === 'Admin' ? <UpdateProblem></UpdateProblem>:<Navigate to='/'></Navigate>}/>
         <Route path='admin/delete-problem' element={isAuthenticated && user?.role === 'Admin'? <DeleteProblem></DeleteProblem>:<Navigate to='/'></Navigate>}></Route>
         <Route path='/forgot-password' element={<ForgetPassword></ForgetPassword>}></Route> 
       
     </Routes>
    </>
  )
}  

export default App;
