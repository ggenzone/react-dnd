import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { type Column, type Id, type Task } from "../types"
import { useMemo, useState } from "react"
import TaskCard from "./TaskCard"

interface ColumnContainerProps {
  column: Column
  onDeleteColumn: (id: Id) => void
  updateColumn: (id: Id, title: string) => void

  createTask: (columnId: Id) => void
  deleteTask: (taskId: Id) => void
  updateTask: (taskId: Id, content: string) => void
  tasks: Task[]
}

function ColumnContainer (props: ColumnContainerProps): JSX.Element {
  const { column, onDeleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask } = props
  const [editMode, setEditMode] = useState(false)
  const { setNodeRef, attributes, transform, listeners, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column
    },
    disabled: editMode
  })

  const tasksId = useMemo(() => tasks.map(task => task.id), [tasks])
  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef} 
        style={style}
        className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col opacity-40 border-2 border-rose-500">
      </div>)
  }

  return (
    <div
      ref={setNodeRef} 
      style={style}
      className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col">
      <div
        onClick={() => { setEditMode(true) }}
        {...attributes}
        {...listeners}
        className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-4 font-bold boder-bgColumnBackgroundColor flex items-center justify-between">
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full">0</div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-black focus:border-rose-500 border-rounded outline-none px-2"
              autoFocus
              onChange={(e) => {updateColumn(column.id, e.target.value)}}
              onBlur={() => setEditMode(false)} 
              defaultValue={column.title} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setEditMode(false)
                } 
              }}
            /> 
          )}
        </div>
        <button onClick={() => onDeleteColumn(column.id)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksId}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask}/>
          ))}
        </SortableContext>
      </div>
      <button
        onClick={() => createTask(column.id)} 
        className='flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500'>
        Add task
      </button>
    </div>
  )
}

export default ColumnContainer