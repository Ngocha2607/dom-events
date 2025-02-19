import './App.css'
import ConnectQuestionAndAnswer from './components/ConnectQuestionAndAnswer'
import SelectTextAndAddComment from './components/SelectTextAndAddComment'
import SelectTrueAnswerAndFillToBlankPositionInQuestion from './components/SelectTrueAnswerAndFillToBlankPositionInQuestion'

function App() {
  return (
    <>
 
      <SelectTextAndAddComment />

      {/* <SelectTrueAnswerAndFillToBlankPositionInQuestion /> */}

      <ConnectQuestionAndAnswer />
    </>
  )
}

export default App
