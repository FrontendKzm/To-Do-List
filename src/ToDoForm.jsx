import { useEffect, useState } from 'react'
import { useForm,Controller } from 'react-hook-form';
import { ToastContainer, toast,Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import {Form,Input,InputGroup,FormFeedback,Button, FormGroup,Label, ButtonGroup} from 'reactstrap'
import ToDoList from './ToDoList';
import ToDoItem from './ToDoItem';

export default function ToDoForm() {
  const { handleSubmit, control,register,reset, formState: { errors } } = useForm({mode:'onChange',
    defaultValues:
    {task: "",  
    priority: "", 
    date: "",  
    details: "",}} );
    const [deleteModalIndex, setDeleteModalIndex] = useState(null);
  const[tasks,setTasks] = useState([])
  const onSubmit = (data) => {
    setTasks((prevTasks)=> [...prevTasks,data])
    toast.success('New Task Added!')
    reset({ task: "", priority: "", date: "", details: "" });
  };
  useEffect(()=>{
    console.log(tasks)
  },[tasks,errors])
  
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, []);

  
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);


  const deleteTask = (index) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
    setDeleteModalIndex(null);
    toast.error("Task Deleted!");
};
 const toggleDeleteModal = (index) => {
    setDeleteModalIndex(index === deleteModalIndex ? null : index);
    
  };


  return (
    
    <div className=" w-full  p-4 " >
      <h1 className=" h-20 text-center text-6xl  text-black
      font-bold  rounded-2xl shadow-2xl max-w-full overflow-hidden shadow-black " >Just Keep Doin'!</h1>
      <div className="w-full lg:w-1/3">
      <Form onSubmit={handleSubmit(onSubmit)} className="mt-3 border-2 border-x-black border-y-orange-500 rounded-xl w-full text-center bg-black/70 ml-[600px] ">
        <FormGroup>
          <Label htmlFor="task" className="text-2xl font-extrabold text-orange-600 border-2 border-black rounded-md bg-slate-900 shadow-md shadow-orange-500 text-center">Task</Label>
          <Controller
            name="task"
            control={control}
            rules={{
              required: "*Required",
              minLength: { value: 4, message: "Must contain at least 4 characters!" },
              maxLength:{value:20,message:'Maximum length is 20'}
            }}
            render={({ field }) => (
              <Input
                id="task"
                type="text"
                placeholder="Add a new task..."
                invalid={!!errors.task}
                {...field}
                className="bg-black border-1 w-79 border-orange-800 shadow-md rounded-lg shadow-orange-800 font-semibold text-white placeholder-white text-center"
              />
            )}
          />
{errors.task && <div style={{ color: 'red', marginTop: '5px' }}>{errors.task.message}</div>}
        </FormGroup>
            <FormGroup>
              <Label htmlFor='priority'  className="text-2xl font-extrabold text-orange-600 border-2 border-black rounded-md bg-slate-900 shadow-md shadow-orange-500">Priority</Label><br/>
              <Controller
              name='priority'
              control={control}
              rules={{required:'*Required'}}
              render={({field})=>( <ButtonGroup >
                <Button
                className="font-semibold pr-12"
                  color="danger"
                  outline
                  onClick={() => field.onChange('High')}
                  active={field.value === 'High'}
                >
                  High
                </Button>
                <Button
                className="font-semibold pr-5"
                  color="warning"
                  outline
                  onClick={() => field.onChange('Moderate')}
                  active={field.value === 'Moderate'}
                >
                  Moderate
                </Button>
                <Button
                className="font-semibold pr-16"
                  color="success"
                  outline
                  onClick={() => field.onChange('Low')}
                  active={field.value === 'Low'}
                >
                  Low
                </Button>
              </ButtonGroup>)} 
/> {errors.priority && <div style={{ color: 'red', marginTop: '5px' }}>{errors.priority.message}</div>}

            </FormGroup>
        <FormGroup>
         <Label htmlFor='date'  className="text-2xl font-extrabold text-orange-600 border-2 border-black rounded-md bg-slate-900 shadow-md shadow-orange-500">Deadline</Label>   
            <Controller
            name='date'
            control={control}
            rules={{
            required:"*Required",
            validate:(value)=>{
              const selectedDate = new Date(value);
              const today = new Date();
              today.setHours(0,0,0,0)
              if(selectedDate<today){
               return "You can't select a past date!" 
              } else
              return true;
            }
          
          }}
            render={({field})=>(<Input type='date' id='date' {...field} invalid={!!errors.date} 
              className="bg-black border-1 border-orange-800 shadow-md rounded-lg w-78 shadow-orange-800 font-semibold text-white placeholder-white appearance-none text-center"
/>)}/>
            {errors.date && <div style={{ color: 'red', marginTop: '5px' }}>{errors.date.message}</div>}
        </FormGroup>
        <FormGroup>
            <Label htmlFor='details' className="text-2xl font-extrabold text-orange-600 border-2 border-black rounded-md bg-slate-900 shadow-md shadow-orange-500">Details: *optional</Label>
            <Controller
            name='details'
            control={control}
            rules={{required:false ,minLength:{value:10,message:'Must contain at least 10 characters!'}}}
            render={({field})=>(<Input
              className="bg-black border-1 border-orange-800 shadow-md rounded-lg shadow-orange-800 font-semibold text-white placeholder-white appearance-none w-78" 
              type='textarea'
              id='details'
              placeholder='Details about your task..'
              invalid={!!errors.details}
              {...field} />
            )} /> {errors.details && <FormFeedback>{errors.details.message}</FormFeedback>}
        </FormGroup>


        <Button type="submit" color="light" block outline disabled={errors.task || errors.date?true:false} className="hover:bg-orange-500 text-2xl font-bold border-1 border-orange-700 hover:border-orange-600 shadow-md mb-2">Add Task</Button>
      </Form>
      <div >
      <ToDoItem tasks={tasks} deleteTask={deleteTask} toggleDeleteModal={toggleDeleteModal} deleteModalIndex={deleteModalIndex} />
      </div>      
      </div>
    </div>
   
  );
}