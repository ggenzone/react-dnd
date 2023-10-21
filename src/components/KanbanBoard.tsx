import { useMemo, useState } from "react"
import { type Column, type Id, type Task } from "../types"
import ColumnContainer from "./ColumnContainer"
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove } from "@dnd-kit/sortable"
import { createPortal } from "react-dom"
import TaskCard from "./TaskCard"


function KanbanBoard () {
  const [columns, setColumns] = useState<Column[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  const [activeColumn, setActiveColumn] = useState<Column | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const columnsId = useMemo(() => columns.map(col => col.id), [columns])


  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10
    }
  }))


  function createNewColumn () {
    const id = generateId()
    const columnToAdd: Column = {id, title: `Title ${id.toString()}`}

    setColumns(cols => ([...cols, columnToAdd]))
  }

  function updateColumn (id: Id, title: string) {
    setColumns(cols => cols.map(c => (c.id === id ? { ...c, title } : c) ))
  }

  function updateTask (id: Id, content: string) {
    setTasks(tasks => tasks.map(c => (c.id === id ? { ...c, content } : c) ))
  }


  function onDeleteColumn(id: Id) {
    const filteredColumns = columns.filter(col => col.id !== id)

    setColumns(filteredColumns)
  }

  function createTask(columnId: Id) {
    const id = generateId()
    const taskToAdd: Task = { id, columnId, content: `Task ${id.toString()}`}

    setTasks(tasks => ([...tasks, taskToAdd]))
  }

  function deleteTask (taskId: Id) {
    setTasks(tasks => tasks.filter(task => task.id !== taskId))
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'column') {
      setActiveColumn(event.active.data.current.column)
      return
    }

    if (event.active.data.current?.type === 'task') {
      setActiveTask(event.active.data.current.task)
      return
    }
  }


  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null)
    setActiveTask(null)
    const { active, over } = event

    if (!over) {
      return
    }

    const activeColumnId = active.id
    const overColumnId = over.id

    if (activeColumnId === overColumnId) {
      return
    }

    const isActiveAColumn = active.data.current?.type === 'column'
    const isOverAColumn = over.data.current?.type === 'column'

    if (!isActiveAColumn || !isOverAColumn) {
      return
    }

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => (col.id === activeColumnId))
      const overColumnIndex = columns.findIndex((col) => (col.id === overColumnId))

      return arrayMove(columns, activeColumnIndex, overColumnIndex)
    })
  }

  function onDragOver(event: DragEndEvent) {
    const { active, over } = event

    if (!over) {
      return
    }

    const activeColumnId = active.id
    const overColumnId = over.id

    if (activeColumnId === overColumnId) {
      return
    }

    const isActiveATask = active.data.current?.type === 'task'
    const isOverATask = over.data.current?.type === 'task'

    if (!isActiveATask) {
      return
    }

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((col) => (col.id === activeColumnId))
        const overIndex = tasks.findIndex((col) => (col.id === overColumnId))
  
        tasks[activeIndex].columnId = tasks[overIndex].columnId

        return arrayMove(tasks, activeIndex, overIndex)
      })
    }

    const isOverAColumn = over.data.current?.type === 'column'

    if (isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((col) => (col.id === activeColumnId))
        tasks[activeIndex].columnId = overColumnId
        return arrayMove(tasks, activeIndex, activeIndex)
      })
    }
  }

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map(col => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  tasks={tasks.filter(task => task.columnId === col.id)}
                  onDeleteColumn={onDeleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={createNewColumn}
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2"
          >
            Add column
          </button>
        </div>
        {
          createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnContainer 
                  tasks={tasks.filter(task => task.columnId === activeColumn.id)} 
                  column={activeColumn}
                  onDeleteColumn={onDeleteColumn} 
                  updateColumn={updateColumn} 
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              )}
              {activeTask && (
                <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask} />
              )}
            </DragOverlay>,
            document.body
          )
        }
      </DndContext>
    </div>
  )
}

function generateId() {
  return Math.floor(Math.random() * 1001)
}

export default KanbanBoard