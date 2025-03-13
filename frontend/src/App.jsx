import './App.css';
import Signup from './components/signup';
import Login from './components/Login';
import Header from './components/header';
import JoinCourse from './components/join_course_student';
import CreateCourse from './components/create_course_teacher';
import JoinFirst from './components/joinfirst_student';
import CreateFirst from './components/createfirstcourse_teacher';
function App() {
  return (
    <div className="App">
      <Header />
      <JoinFirst />
      <CreateFirst />
      <CreateCourse />
      <JoinCourse />
      <Login />
      <Signup />
    </div>
  );
}

export default App;
