import { useEffect, useState } from "react";
import { ToastContainer, toast,Flip } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { ListGroup, ListGroupItem, Input, Button, Collapse, Card, CardBody, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { formatDistanceStrict } from 'date-fns';

export default function ToDoItem({ tasks,deleteTask,toggleDeleteModal,deleteModalIndex }) {
  const [openIndexes, setOpenIndexes] = useState([]);
  const [completes, setCompletes] = useState(new Array(tasks.length).fill(false)); 
  const [openModalIndex, setOpenModalIndex] = useState(null);
  
  const { control } = useForm({ mode: 'onChange' });

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);

  
  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

 
  useEffect(() => {
    setFilteredTasks(
      tasks.filter((item) => 
        item.task.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    
  }, [searchTerm, tasks]);

  const toggle = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleCompleteModal = (index) => {
    setOpenModalIndex(index === openModalIndex ? null : index);
  };

 


  

  const completeTask = (index) => {
    setCompletes((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
    setOpenModalIndex(null);
    toast.success(`Marked as completed!`,{transition:Flip});
  };

  return (
    <div className="">
      <ToastContainer autoClose={2500} theme="dark" 
      draggable 
      />

      
      <Controller
        name='search'
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Input
          className="w-[50%]  bg-black/50 focus:bg-black/50 border-2 border-purple-700 active:bg-black/50 placeholder-orange-500 placeholder-opacity-90 shadow-md shadow-white/60 ml-72 "
            type="search"
            style={{color:"darkorange"}}
            placeholder="Filter Tasks..."
            {...field}
            onChange={(e) => {
              field.onChange(e);
              setSearchTerm(e.target.value);
            }}
          />
        )}
      />
      
    <div className="m-auto items-center ">
      <ListGroup className="rounded-[5rem] border-none border-violet-500" >
        {filteredTasks.map((item, index) => {
          const task = item.task.charAt(0).toUpperCase() + item.task.slice(1);
          const date = formatDistanceStrict(item.date, new Date());

          return (
            <ListGroupItem key={index} className="bg-black/60 w-[200%] 
           mx-72 p-2 overflow-hidden border-1 border-violet-600 rounded-[2rem] ">
              <h2 className="font-bold text-orange-500 text-5xl text-center shadow-md shadow-purple-600">🎯 {task}</h2> 
              {item.priority === 'High'&&<h4 className="text-red-600 font-extrabold border-2 rounded-md  text-center mt-2 w-full  text-2xl border-red-500 shadow-md shadow-red-500 bg-black ">High</h4> }
              {item.priority === 'Moderate'&&<h4 className="text-yellow-400 font-extrabold border-2 rounded-md mt-2 w-full text-center  text-2xl border-yellow-500 shadow-md shadow-yellow-500 bg-black">Moderate</h4> }
              {item.priority === 'Low'&&<h4 className="text-green-500 font-extrabold border-2 rounded-md  text-center  mt-2 w-full text-2xl border-green-500 shadow-md shadow-green-500 bg-black">Low</h4> }
              
              {item.priority === 'High'&& <Button color="danger" block outline className="mt-6" onClick={() => toggle(index)}>
                Info
              </Button>}
              {item.priority === 'Moderate'&& <Button color="warning" block outline className="mt-6" onClick={() => toggle(index)}>
                Info
              </Button>}
              {item.priority === 'Low'&& <Button color="success" block outline className="mt-6" onClick={() => toggle(index)}>
                Info
              </Button>}
             
              <Collapse isOpen={openIndexes.includes(index)}>
                <Card className={item.priority==='High'? "bg-black/0 text-center":
                    item.priority ==='Moderate'? " bg-yellow-500/0 text-center":
                    "bg-green-600/5 text-center"
                 }>
                  <CardBody >
                    <h2 className="font-semibold text-2xl text-orange-500 border-x-2 border-purple-400 mx-[34rem]">Task</h2>
                    <h4 className="font-bold text-3xl border-2 rounded-md border-violet-500 shadow-md shadow-violet-500 mx-[29rem]  text-violet-600">{task}</h4>
                    <hr />
                    <h2 className="font-semibold text-2xl text-orange-500  border-purple-400 mx-[30rem]">Time to complete:</h2>
                    <h4 className="font-bold text-3xl border-2 rounded-md border-violet-500 shadow-md shadow-violet-500 mx-[29rem]  text-violet-600">{date}</h4>
                    <hr />
                    {item.details && (
                      <div>
                        <h2 className="font-semibold text-2xl text-orange-500  border-purple-400 mx-[30rem]">Details:</h2>
                        <p className="font-bold text-2xl border-2 rounded-md border-violet-500 shadow-md shadow-violet-500 mx-[2rem]  text-violet-600">{item.details}</p>
                      </div>
                    )}
                    <ButtonGroup >
                      <Button 
                        color="success" 
                        onClick={() => toggleCompleteModal(index)} 
                        disabled={completes[index]}
                        className="mt-2"
                      >
                        {completes[index] ? "Completed" : "Complete"}
                      </Button>

                      <Modal className="bg-black/5" isOpen={openModalIndex === index} toggle={() => toggleCompleteModal(index)}>
                        <ModalHeader>Complete Task</ModalHeader>
                        <ModalBody>
                          Check "{task}" as completed. (Tasks you’ve marked cannot be undone!)
                        </ModalBody>
                        <ModalFooter>
                          <Button color="success" outline onClick={() => completeTask(index)}>
                            Mark as completed!
                          </Button>
                          <Button color="secondary" onClick={() => toggleCompleteModal(index)}>
                            Cancel
                          </Button>
                        </ModalFooter>
                      </Modal>

                      <Button color="danger"  onClick={() => toggleDeleteModal(index)}
                        className={item.priority ==="High"? "bg-black text-red-700 mt-2":"mt-2"}>
                        Delete
                      </Button>
                    
                      <Modal isOpen={deleteModalIndex === index} toggle={() => toggleDeleteModal(index)}>
                        <ModalHeader>Delete Task</ModalHeader>
                        <ModalBody>
                          Are you sure you want to delete "{task}"?
                        </ModalBody>
                        <ModalFooter>
                          <Button color="danger" outline onClick={() => deleteTask(index)}>
                            Delete Task
                          </Button>
                          <Button color="secondary" onClick={() => toggleDeleteModal(index)}>
                            Cancel
                          </Button>
                        </ModalFooter>
                      </Modal>

                    </ButtonGroup>
                  </CardBody>
                </Card>
              </Collapse>
            </ListGroupItem>
          );
        })}
      </ListGroup>
      </div>
    </div>
  );
}
