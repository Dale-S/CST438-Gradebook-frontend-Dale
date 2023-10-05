import React, {useState, useEffect}  from 'react';
import {SERVER_URL} from '../constants';
import {Link} from 'react-router-dom';
import { useHistory } from 'react-router-dom';

function AddAssignment(props) { 
  const headers = ['Assignment ID', 'Assignment Name', 'Due Date', 'Course Title', 'Course ID'];
  let assignmentId=0;
  const [assignment, setAssignment] = useState([]);
  const [asId, setAsId] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [cId, setCId] = useState('');
  const [inFormat, setFormat] = useState(true);

  const history = useHistory();

  const backToHome = () => {
    history.push('/');
  };

  const onChangeAsId = (e) =>{
    setAsId(e.target.value);
  }

  const onChangeCId = (e) =>{
    setCId(e.target.value);
  }

  const onChangeTitle = (e) =>{
    setTitle(e.target.value);
  }

  const fetchAssignment = () => {
    console.log("fetchAssignment");
    fetch(`${SERVER_URL}/assignment/${assignmentId}`)
    .then((response) => response.json() ) 
    .then((data) => { 
      console.log("assignment length "+data.length);
      setAssignment(data);
    }) 
    .catch(err => console.error(err)); 
  }

  const onChangeDate = (e) => {
    setMessage("");
    if(/^\d{4}-\d{2}-\d{2}$/.test(e.target.value)){
      console.log("in correct format")
      setFormat(true);
    }
    else{
      setMessage("Due Date must be in yyyy-mm-dd format");
      setFormat(false);
    }
    setDate(e.target.value);
  }
  const onChangeName = (e) => {
    console.log(name)
    setName(e.target.value);
  }

  const saveAssignment = () => {
    setMessage(''); 
    console.log("assignmentCreate.save");     
    const as = {
      "id" : asId,
      "assignmentName" : name,
      "dueDate" : date,
      "courseTitle" : title,
      "courseId" : cId
    };
    if(inFormat == true){
      fetch(`${SERVER_URL}/assignment/create` , 
        {  
          method: 'POST', 
          headers: { 'Content-Type': 'application/json', }, 
          body: JSON.stringify(as)
        } )
      .then(res => {
        if (res.ok) {
          fetchAssignment(assignmentId);
          setMessage("Assignment saved.");
        } else {
          setMessage("Save error. "+res.status);
          console.error('Save assignment error =' + res.status);
      }})
      .catch(err => {
        setMessage("Exception. "+err);
        console.error('Save assignment exception =' + err);
      });
    }
    else{
      setMessage("Due Date must be in yyyy-mm-dd format, changes not saved");
    }
  }
  
  useEffect(() => {
    // fetchAssignment();
  }, [] )
  
  return (
      <div>
        <h3>Create A New Assignment</h3>
        <div margin="auto">
        <h4>{message}&nbsp;</h4>
            <table className="Center"> 
              <thead>
                <tr>
                  {headers.map((title, idx) => (<th key={idx}>{title}</th>))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                        name="assignmentId"
                        value={asId}  
                        type="text"
                        placeholder={asId}
                        onChange={(e) => onChangeAsId(e)}
                    />
                  </td>
                  <td>
                    <input
                        name="assignmentName"
                        value={name}  
                        type="text"
                        placeholder={name}
                        onChange={(e) => onChangeName(e)}
                    />
                  </td>
                  <td>
                    <input
                        name="dueDate"
                        value={date}  
                        type="text"
                        placeholder={date}
                        onChange={(e) => onChangeDate(e)}
                    />
                  </td>
                  <td>
                    <input
                        name="title"
                        value={title}  
                        type="text"
                        placeholder={title}
                        onChange={(e) => onChangeTitle(e)}
                    />
                  </td>
                  <td>
                    <input
                        name="cId"
                        value={cId}  
                        type="text"
                        placeholder={cId}
                        onChange={(e) => onChangeCId(e)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <br></br>
            <button id="sedit" type="button" margin="auto" onClick={saveAssignment}>Save Changes</button>
            <br></br>
            <br></br>
            <button id="home" type="button" margin="auto" onClick={backToHome}>Home Page</button>
        </div>
    </div>
  ); 
}

export default AddAssignment;