import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import FirstPage from './components/FirstPage.jsx'
import UserRegistration from './components/UserRegistration.jsx'
import './index.css'
import UserPage from './components/UserPage.jsx'
import SignIn from './components/SignIn.jsx'
import Upload from './upload/upload.jsx'
import YourCard from './crousal/your_card.jsx'
import EditCard from './edit/editCard.jsx'
import Other_card from './crousal/other_card.jsx'
import Comment from './comment/comment.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<FirstPage/>} />
        <Route path='registration' element={<UserRegistration/>} />
        <Route path='userpage' element={<UserPage/>} />
        <Route path='signin' element={<SignIn/>} />
        <Route path='upload' element={<Upload/>} />
        <Route path='yourcard' element={<YourCard/>} />
        <Route path='editcard' element={<EditCard/>} />
        <Route path='otherCard' element={<Other_card/>} />
        <Route path='comment' element={<Comment/>} />
      </Routes>
    </Router>
  </React.StrictMode>,
)
