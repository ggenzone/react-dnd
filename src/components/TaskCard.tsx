import { useState } from "react";
import { type Id, type Task } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"

interface TaskCardProps {
  task: Task
  deleteTask: (taskId: Id) => void
  updateTask: (taskId: Id, content: string) => void
}
function TaskCard(props: TaskCardProps) {
  const { task, deleteTask, updateTask } = props
  const [editMode, setEditMode] = useState(false)
  const [ mouseIsOver, setMouseIsOver ] = useState(false)

  const { setNodeRef, attributes, transform, listeners, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task
    },
    disabled: editMode
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }

  
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-mainBackgroundColor relative p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl opacity-30 border-2 border-rose-500 cursor-grab"
      />
    )
  }


  const toggleEditMode = () => {
    setEditMode(edit => !edit)
    setMouseIsOver(false)
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-mainBackgroundColor relative p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab"
      >
        <textarea 
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none" 
          value={task.content} 
          autoFocus
          onChange={(e) => {updateTask(task.id, e.target.value)}}
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              toggleEditMode()
            } 
          }}
        />
      </div>
    )
  }

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-mainBackgroundColor relative p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab"
      onMouseEnter={() => {setMouseIsOver(true)}}
      onMouseLeave={() => {setMouseIsOver(false)}}
    >
      <div onClick={toggleEditMode}>
        {task.content}
      </div>
      {mouseIsOver && (
        <button className="absolute right-4" onClick={() => deleteTask(task.id)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      )}
    </div>
  )

}

export default TaskCard