import React, {useState, useEffect}  from 'react';
import {SERVER_URL} from '../constants';
import {Link} from 'react-router-dom';
import { useHistory } from 'react-router-dom';


//  required properties -  assignmentId
//  


function EditAssignment(props) {
  
  const headers = ['Assignment Name', 'Course Title', 'Due Date'];
  let assignmentId=0;
  const [assignment, setAssignment] = useState([]);
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [inFormat, setFormat] = useState(true);

  const path = window.location.pathname;  // /gradebook/123
  const s = /\d+$/.exec(path)[0];
  //console.log("Grade assignmentId="+s);
  assignmentId=s;

  const history = useHistory();

  const backToHome = () => {
    history.push('/');
  };

  const fetchAssignment = () => {
    console.log("fetchAssignment");
    fetch(`${SERVER_URL}/assignment/${assignmentId}`)
    .then((response) => response.json() ) 
    .then((data) => { 
      console.log("assignment length "+data.length);
      setAssignment(data);
      setDate(data.dueDate);
      setName(data.assignmentName);
      setTitle(data.courseTitle);
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

  const saveEdit = () => {
    setMessage(''); 
    console.log("assignmentEdit.save");     
    const as = {
      "id" : assignment.id,
      "assignmentName" : name,
      "dueDate" : date,
      "courseTitle" : title,
      "courseId" : assignment.courseId
    };
    if(inFormat == true){
      fetch(`${SERVER_URL}/assignment/update/${assignmentId}` , 
        {  
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json', }, 
          body: JSON.stringify(as)
        } )
      .then(res => {
        if (res.ok) {
          fetchAssignment(assignmentId);
          setMessage("Edit saved.");
        } else {
          setMessage("Save error. "+res.status);
          console.error('Save edit error =' + res.status);
      }})
      .catch(err => {
        setMessage("Exception. "+err);
        console.error('Save edit exception =' + err);
      });
    }
    else{
      setMessage("Due Date must be in yyyy-mm-dd format, changes not saved");
    }
  }
  
  useEffect(() => {
    fetchAssignment();
  }, [] )
  
  return (
    <div>
      <h3>Assignment Edit</h3>
      <div margin="auto" >
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
                        name="assignmentName"
                        value={name}  
                        type="text"
                        placeholder={name}
                        onChange={(e) => onChangeName(e)}
                    />
                  </td>
                  <td>{assignment.courseTitle}</td>
                  <td>
                    <input
                        name="dueDate"
                        value={date}  
                        type="text"
                        placeholder={date}
                        onChange={(e) => onChangeDate(e)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <br></br>
            <button id="sedit" type="button" margin="auto" onClick={saveEdit}>Save Changes</button>
            <br></br>
            <br></br>
            <button id="home" type="button" margin="auto" onClick={backToHome}>Home Page</button>
        </div>
    </div>
  );
}

export default EditAssignment;