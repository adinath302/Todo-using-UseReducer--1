import React, { useEffect, useReducer, useState } from 'react'
import { FiEdit } from "react-icons/fi";


const Todo_filterui = () => {

    //Reducer Function >
    const Reducer = (state, action) => {
        if (action.type === 'HANDLE_INPUT_CHANGE') {   // Controlled Input
            return { ...state, Inputvalue: action.payload };
        }
        if (action.type === "RESETINPUT") {  // Reset the Input 
            return { ...state, Inputvalue: '' }
        }
        if (action.type === "HANDLE_DELETE") {  // Delete Todo
            return { ...state, Todo: state.Todo.filter(item => item.id !== action.payload.id) }
        }
        if (action.type === "HANDLE_TODO") {
            return {
                ...state, Todo: [...state.Todo, action.payload],
                Inputvalue: ''
            }
        }
        if (action.type === "HANDLE_COMPLETE") {
            return {
                ...state,
                Todo: state.Todo.map(item => (item.id === action.payload.id
                    ?
                    { ...item, complete: !item.complete }
                    :
                    item))
            }
        }
        if (action.type === "HANDLE_FILTER") {
            return {
                ...state, status: action.payload  // Just Take the action ( type , payload ) and add it to status and use it as regular state
            }
        }
        if (action.type === "HANDLE_EDIT") {
            return {
                ...state,
                IsEditing: true,
                EditID: action.payload.id,
                EditValue: state.Todo.find(t => t.id === action.payload.id).text
            }
        }
        if (action.type === "HANDLE_SAVE_CHANGE") {
            return {
                ...state,
                Todo: state.Todo.map((item) =>
                    item.id === Inputstate.EditID
                        ? { ...item, text: action.payload }
                        : item)
            }
        }
    }

    // initial value stored inside an object >
    const initialstate = {
        Inputvalue: '',
        Todo: [],
        status: "all",
        IsEditing: false,
        EditID: null,
        EditValue: '',
    }

    // Storaging Data To LocalStorage >
    const getInitialState = () => {
        const localData = JSON.parse(localStorage.getItem("todos"));
        return localData ? { ...initialstate, Todo: localData } : initialstate;
    }

    const [Inputstate, dispatch] = useReducer(Reducer, initialstate, getInitialState) // UseReducer Hook >

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(Inputstate.Todo))
    }, [Inputstate.Todo])

    // console.log("state log " + Inputstate.IsEditing);
    console.log("state id " + Inputstate.EditID);

    const HandleSubmit = (event) => {
        event.preventDefault()
        if (Inputstate.Inputvalue.trim() === "") return;
        const NewTodo = {
            id: Date.now(),
            text: Inputstate.Inputvalue,
            complete: false,
        }
        dispatch({ type: "HANDLE_TODO", payload: NewTodo })
        // console.log(Inputstate.Todo);
        // console.log("NewTODO" + NewTodo);
    }

    const FilteredTodo = Inputstate.Todo.filter(Todo => {
        if (Inputstate.status === "all") return true;
        if (Inputstate.status === "complete") return Todo.complete;
        if (Inputstate.status === "pending") return !Todo.complete;
    })

    return (
        <div className='flex flex-col justify-center items-center text-center gap-6 mt-12 '>
            <form
                action=""
                onSubmit={HandleSubmit}
                className='flex flex-col gap-4'>
                <input
                    required
                    name='Name'
                    type="text"
                    className='border p-2'
                    placeholder='enter the todo'
                    value={Inputstate.Inputvalue}
                    onChange={(event) => {
                        dispatch({ type: "HANDLE_INPUT_CHANGE", payload: event.target.value })
                    }
                    }
                />
                <button
                    type='submit'
                    className='p-2 border bg-amber-400 select-none cursor-pointer'>Submit</button>
            </form>
            <div className='flex gap-3 '>
                <div className='border p-1 cursor-pointer' onClick={() => dispatch({ type: "HANDLE_FILTER", payload: "all" })}>All</div>
                <div className='border p-1 cursor-pointer' onClick={() => dispatch({ type: "HANDLE_FILTER", payload: "complete" })}>Complete</div>
                <div className='border p-1 cursor-pointer' onClick={() => dispatch({ type: "HANDLE_FILTER", payload: "pending" })}>Pending</div>
            </div>

            <ul className='gap-2 flex flex-col cursor-pointer'>
                {FilteredTodo.map((item) => (
                    <li key={item.id}>
                        <div className={`flex gap-2 items-center`}>

                            {
                                Inputstate.EditID === item.id ? (
                                    <>
                                        < input
                                            required
                                            name='Name'
                                            type="text"
                                            className='border p-2'
                                            placeholder='enter the todo'
                                            value={item.id}
                                            onChange={(event) => dispatch({ type: "HANDLE_SAVE_CHANGE", payload: event.target.value })}
                                        />
                                        <div className='flex p-2 items-center select-none' onClick={() => dispatch({ type: "HANDLE_SAVE_CHANGE", payload: { id: item.id } })}>
                                            Save
                                        </div>
                                        <div className='flex p-2 items-center select-none' onClick={() => dispatch({ type: "HANDLE_EDIT", payload: { id: item.null } })}>
                                            Cancel
                                        </div>
                                    </>
                                ) : (
                                    <p
                                        className={`${item.complete ? "line-through" : "none"} mb-0 border p-2 flex select-none`}
                                        onClick={() => dispatch({ type: "HANDLE_COMPLETE", payload: { id: item.id } })}>{item.text}
                                    </p>
                                )}
                            <div className='flex p-2 items-center select-none' onClick={() =>
                                dispatch({ type: "HANDLE_EDIT", payload: { id: item.id } })} >
                                <FiEdit />
                            </div>
                            <div className='flex p-2 items-center select-none' onClick={() => dispatch({ type: "HANDLE_DELETE", payload: { id: item.id } })}>
                                ❌
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div >
    )
}

export default Todo_filterui